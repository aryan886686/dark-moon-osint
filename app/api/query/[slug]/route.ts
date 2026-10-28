import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const cookieStore = await cookies()
    const session = verifyToken(cookieStore.get('session')?.value || '')
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (!(await checkRateLimit(session.username))) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const db = await getDb()
    const feature = await db.collection('features').findOne({ slug, active: true })

    if (!feature) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 })
    }

    const url = new URL(request.url)
    const queryParams = Object.fromEntries(url.searchParams.entries())

    let finalUrl = feature.apiUrl as string
    for (const [key, value] of Object.entries(queryParams)) {
      if (finalUrl.includes(`{${key}}`)) {
        finalUrl = finalUrl.replace(`{${key}}`, encodeURIComponent(value))
      } else {
        const separator = finalUrl.includes('?') ? '&' : '?'
        finalUrl += `${separator}${key}=${encodeURIComponent(value)}`
      }
    }

    const headers: Record<string, string> = { 'User-Agent': 'DarkMoon-OSINT/1.0' }
    if (feature.apiKey) headers['Authorization'] = `Bearer ${feature.apiKey}`

    const response = await fetch(finalUrl, { headers, cache: 'no-store' })
    const data = await response.json().catch(() => ({}))

    await db.collection('query_logs').insertOne({
      username: session.username,
      feature: slug,
      params: queryParams,
      timestamp: new Date()
    })

    return NextResponse.json({
      success: true,
      data,
      feature: { name: feature.name, description: feature.description }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
