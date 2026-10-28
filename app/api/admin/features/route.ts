import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

async function getSession() {
  const cookieStore = await cookies()
  return verifyToken(cookieStore.get('session')?.value || '')
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = await getDb()
  const features = await db.collection('features').find({}).toArray()
  return NextResponse.json(features)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (session?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const { name, slug, description, apiUrl, apiKey, icon } = body

  if (!name || !slug || !apiUrl) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const db = await getDb()
  const result = await db.collection('features').insertOne({
    name, slug, description, apiUrl, apiKey: apiKey || null,
    icon: icon || '🔍', active: true, createdAt: new Date()
  })

  return NextResponse.json({ id: result.insertedId })
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (session?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { slug } = await request.json()
  const db = await getDb()
  await db.collection('features').deleteOne({ slug })

  return NextResponse.json({ success: true })
}
