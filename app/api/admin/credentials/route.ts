import { NextResponse } from 'next/server'
import { generateCredentials, unbindDevice } from '@/lib/auth'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { getDb } from '@/lib/db'

export async function POST(request: Request) {
  const session = verifyToken(cookies().get('session')?.value || '')
  if (session?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  
  const { action, username, role } = await request.json()
  
  if (action === 'create') {
    const creds = await generateCredentials(username, role)
    return NextResponse.json(creds)
  }
  
  if (action === 'unbind') {
    await unbindDevice(username)
    return NextResponse.json({ success: true })
  }
  
  if (action === 'list') {
    const db = await getDb()
    const users = await db.collection('credentials').find({}, { projection: { password: 0 } }).toArray()
    return NextResponse.json(users)
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
