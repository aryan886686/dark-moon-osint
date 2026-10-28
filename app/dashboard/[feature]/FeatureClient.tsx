'use client'

import { use, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function FeatureClient({ params }: { params: Promise<{ feature: string }> }) {
  const resolvedParams = use(params)
  const feature = resolvedParams.feature
  
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleQuery = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch(`/api/query/${feature}?input=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Query failed')
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <Link href="/dashboard" className="text-gray-400 hover:text-white mb-8 inline-block">
        ← Back to Dashboard
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold gradient-text mb-2 capitalize">
          {feature.replace(/-/g, ' ')}
        </h1>

        <div className="glass rounded-xl p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter your query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
              className="flex-1 px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
            />
            <button
              onClick={handleQuery}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium disabled:opacity-50 transition-opacity"
            >
              {loading ? 'QUERYING...' : 'QUERY'}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 mb-4"
            >
              {error}
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="text-lg font-bold mb-4 text-purple-400">Results</h3>
              <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm text-gray-300 border border-white/5">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
