import { getDb } from './db'

const WINDOW_MS = 60000
const MAX_REQUESTS = 30

export async function checkRateLimit(identifier: string): Promise<boolean> {
  const db = await getDb()
  const now = Date.now()
  
  const record = await db.collection('rate_limits').findOneAndUpdate(
    { identifier },
    {
      $push: { timestamps: { $each: [now], $slice: -MAX_REQUESTS } }
    },
    { upsert: true, returnDocument: 'after' }
  )
  
  if (!record || !record.timestamps) return true
  
  const recent = record.timestamps.filter((t: number) => now - t < WINDOW_MS)
  return recent.length <= MAX_REQUESTS
}
