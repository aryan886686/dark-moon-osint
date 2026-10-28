'use client'

export async function getDeviceFingerprint(): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx?.fillText('Dark Moon OSINT', 10, 10)
  const canvasHash = canvas.toDataURL().slice(-50)

  const screenInfo = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const lang = navigator.language
  const platform = navigator.platform
  const cores = (navigator as any).hardwareConcurrency || 0

  const raw = `${canvasHash}|${screenInfo}|${timezone}|${lang}|${platform}|${cores}`

  let hash = 0
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}
