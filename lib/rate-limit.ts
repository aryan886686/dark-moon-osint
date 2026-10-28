import { getDb } from './db'

const WINDOW_MS = 60000
const MAX_REQUESTS = 30

export async function checkRateLimit(identifier: string): Promise<boolean> {
  const db = await getDb()
  const now = Date.now()

  const update = {
    $push: { timestamps: { $each: [now], $slice: -MAX_REQUESTS } }
  } as any

  await db.collection('rate_limits').updateOne(
    { identifier },
    update,
    { upsert: true }
  )

  const record = await db.collection('rate_limits').findOne({ identifier })
  if (!record || !Array.isArray(record.timestamps)) return true

  const recent = (record.timestamps as number[]).filter((t) => now - t < WINDOW_MS)
  return recent.length <= MAX_REQUESTS
}
