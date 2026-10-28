'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Dashboard() {
  const [features, setFeatures] = useState<any[]>([])
  
  useEffect(() => {
    fetch('/api/admin/features').then(r => r.json()).then(setFeatures).catch(() => {})
  }, [])
  
  return (
    <div className="min-h-screen p-6 md:p-10">
      <header className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold gradient-text">🌑 Dark Moon OSINT</h1>
          <p className="text-gray-400 mt-2">Select a module to begin intelligence gathering</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/dashboard/${feature.slug}`}>
              <div className="glass rounded-xl p-6 hover:glow transition-all cursor-pointer group h-full">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                  {feature.name}
                </h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
        
        {features.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-500">
            No features configured yet
          </div>
        )}
      </div>
    </div>
  )
}
