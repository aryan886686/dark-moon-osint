import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  const session = verifyToken(cookies().get('session')?.value || '')
  if (session?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  
  const db = await getDb()
  const features = await db.collection('features').find({}).toArray()
  return NextResponse.json(features)
}

export async function POST(request: Request) {
  const session = verifyToken(cookies().get('session')?.value || '')
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
  const session = verifyToken(cookies().get('session')?.value || '')
  if (session?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  
  const { slug } = await request.json()
  const db = await getDb()
  await db.collection('features').deleteOne({ slug })
  
  return NextResponse.json({ success: true })
}
