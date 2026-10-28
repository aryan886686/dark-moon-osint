'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-6 text-7xl">🌑</div>
          <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-4 tracking-tight">
            DARK MOON
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 font-light tracking-widest">
            OSINT INTELLIGENCE PLATFORM
          </p>
          
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 glass rounded-full glow text-lg font-medium hover:bg-white/10 transition-all"
            >
              ACCESS TERMINAL →
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
