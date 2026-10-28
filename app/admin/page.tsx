'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Admin() {
  const [tab, setTab] = useState<'features' | 'users'>('features')
  const [features, setFeatures] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [newFeature, setNewFeature] = useState({ name: '', slug: '', description: '', apiUrl: '', apiKey: '', icon: '🔍' })
  const [newUser, setNewUser] = useState({ username: '', role: 'user' as 'admin' | 'user' })
  const [generatedCreds, setGeneratedCreds] = useState<any>(null)
  
  const loadFeatures = () => fetch('/api/admin/features').then(r => r.json()).then(setFeatures).catch(() => {})
  const loadUsers = () => fetch('/api/admin/credentials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list' }) }).then(r => r.json()).then(setUsers).catch(() => {})
  
  useEffect(() => { loadFeatures(); loadUsers() }, [])
  
  const addFeature = async () => {
    await fetch('/api/admin/features', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFeature)
    })
    setNewFeature({ name: '', slug: '', description: '', apiUrl: '', apiKey: '', icon: '🔍' })
    loadFeatures()
  }
  
  const deleteFeature = async (slug: string) => {
    await fetch('/api/admin/features', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug })
    })
    loadFeatures()
  }
  
  const createUser = async () => {
    const res = await fetch('/api/admin/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', ...newUser })
    })
    const creds = await res.json()
    setGeneratedCreds(creds)
    setNewUser({ username: '', role: 'user' })
    loadUsers()
  }
  
  const unbindUser = async (username: string) => {
    await fetch('/api/admin/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'unbind', username })
    })
    loadUsers()
  }
  
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard" className="text-gray-400 hover:text-white mb-2 inline-block">← Dashboard</Link>
          <h1 className="text-4xl font-bold gradient-text">⚙️ Admin Control</h1>
        </div>
      </div>
      
      <div className="flex gap-2 mb-8">
        {(['features', 'users'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-lg transition-colors ${tab === t ? 'bg-purple-600' : 'glass hover:bg-white/10'}`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>
      
      {tab === 'features' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Add New Feature</h3>
            <div className="space-y-3">
              <input placeholder="Name" value={newFeature.name} onChange={e => setNewFeature({...newFeature, name: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none" />
              <input placeholder="Slug (url-safe)" value={newFeature.slug} onChange={e => setNewFeature({...newFeature, slug: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none" />
              <input placeholder="Description" value={newFeature.description} onChange={e => setNewFeature({...newFeature, description: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none" />
              <input placeholder="API URL (use {input} for param)" value={newFeature.apiUrl} onChange={e => setNewFeature({...newFeature, apiUrl: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none" />
              <input placeholder="API Key (optional)" value={newFeature.apiKey} onChange={e => setNewFeature({...newFeature, apiKey: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none" />
              <input placeholder="Icon emoji" value={newFeature.icon} onChange={e => setNewFeature({...newFeature, icon: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none" />
              <button onClick={addFeature} className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium">ADD FEATURE</button>
            </div>
          </div>
          
          <div className="glass rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Existing Features</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {features.map(f => (
                <div key={f.slug} className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                  <div>
                    <div className="font-medium">{f.icon} {f.name}</div>
                    <div className="text-xs text-gray-400">/{f.slug}</div>
                  </div>
                  <button onClick={() => deleteFeature(f.slug)} className="text-red-400 hover:text-red-300">Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {tab === 'users' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Generate New User</h3>
            <div className="space-y-3">
              <input placeholder="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none" />
              <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button onClick={createUser} className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium">GENERATE</button>
            </div>
            
            {generatedCreds && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="text-xs text-gray-400 mb-2">Save these credentials - shown only once:</div>
                <div><strong>Username:</strong> {generatedCreds.username}</div>
                <div><strong>Password:</strong> {generatedCreds.password}</div>
              </motion.div>
            )}
          </div>
          
          <div className="glass rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Active Users</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {users.map((u: any) => (
                <div key={u.username} className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                  <div>
                    <div className="font-medium">{u.username} <span className="text-xs px-2 py-0.5 bg-purple-600/30 rounded">{u.role}</span></div>
                    <div className="text-xs text-gray-400">{u.deviceFingerprint ? `🔒 Device Bound` : '⚠️ Not Bound'}</div>
                  </div>
                  <button onClick={() => unbindUser(u.username)} className="text-yellow-400 hover:text-yellow-300 text-sm">Unbind Device</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
