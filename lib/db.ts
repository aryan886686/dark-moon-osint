import { MongoClient, Db } from 'mongodb'

let cachedDb: Db | null = null
let cachedClient: MongoClient | null = null

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb
  
  const client = new MongoClient(process.env.MONGODB_URI!)
  await client.connect()
  
  cachedClient = client
  cachedDb = client.db('darkmoon')
  
  const credentials = cachedDb.collection('credentials')
  await credentials.createIndex({ username: 1 }, { unique: true })
  await credentials.createIndex({ deviceFingerprint: 1 }, { sparse: true })
  
  return cachedDb
}

export async function closeDb() {
  if (cachedClient) await cachedClient.close()
}
