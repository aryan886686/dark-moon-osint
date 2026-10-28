import { NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { username, password, deviceFingerprint } = await request.json()
    
    if (!username || !password || !deviceFingerprint) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    
    const result = await authenticateUser(username, password, deviceFingerprint)
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }
    
    const response = NextResponse.json({ user: result.user })
    response.cookies.set('session', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })
    
    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
