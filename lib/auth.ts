import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { getDb } from './db'

export interface UserSession {
  username: string
  role: 'admin' | 'user'
  deviceFingerprint: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(payload: UserSession): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as UserSession
  } catch {
    return null
  }
}

export async function generateCredentials(username: string, role: 'admin' | 'user' = 'user') {
  const db = await getDb()
  const password = Math.random().toString(36).slice(-12) + 'A1!'
  const hashedPw = await hashPassword(password)
  
  await db.collection('credentials').insertOne({
    username,
    password: hashedPw,
    role,
    deviceFingerprint: null,
    createdAt: new Date()
  })
  
  return { username, password }
}

export async function authenticateUser(username: string, password: string, deviceFingerprint: string) {
  const db = await getDb()
  const user = await db.collection('credentials').findOne({ username })
  
  if (!user) return { error: 'Invalid credentials' }
  
  const isValid = await verifyPassword(password, user.password)
  if (!isValid) return { error: 'Invalid credentials' }
  
  if (user.deviceFingerprint && user.deviceFingerprint !== deviceFingerprint) {
    return { error: 'Account locked to another device. Contact admin.' }
  }
  
  if (!user.deviceFingerprint) {
    await db.collection('credentials').updateOne(
      { username },
      { $set: { deviceFingerprint } }
    )
  }
  
  const token = generateToken({
    username: user.username,
    role: user.role,
    deviceFingerprint
  })
  
  return { token, user: { username: user.username, role: user.role } }
}

export async function unbindDevice(username: string) {
  const db = await getDb()
  await db.collection('credentials').updateOne(
    { username },
    { $set: { deviceFingerprint: null } }
  )
}
