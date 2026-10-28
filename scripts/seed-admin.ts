// Environment variables load karo
import dotenv from 'dotenv'
import path from 'path'

// .env.local file se load karo
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Debug - confirm karo ki URI load hua
console.log('🔍 MongoDB URI loaded:', process.env.MONGODB_URI ? '✅ YES' : '❌ NO')

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local')
  console.error('📁 Current directory:', process.cwd())
  console.error('📝 Please check if .env.local file exists in:', process.cwd())
  process.exit(1)
}

import { generateCredentials } from '../lib/auth'

async function seed() {
  console.log('🌑 Creating master admin account...')
  const creds = await generateCredentials('darkmoon-admin', 'admin')
  console.log('✅ Master Admin Created:')
  console.log(`   Username: ${creds.username}`)
  console.log(`   Password: ${creds.password}`)
  console.log('\n⚠️  Save these credentials NOW - they will not be shown again!')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})