'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

interface TwitchEmbedProps {
  channel: string
}

export function TwitchEmbed({ channel }: TwitchEmbedProps) {
  const [isLive, setIsLive] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)

    // Check stream status periodically
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/twitch/status')
        const data = await response.json()
        setIsLive(data.live)
      } catch {
        // API not available, show stream anyway
        setIsLive(false)
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  if (!isClient) {
    return (
      <div className="aspect-video bg-cave-medium rounded-xl animate-pulse flex items-center justify-center">
        <span className="text-gray-500">Loading stream...</span>
      </div>
    )
  }

  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost'

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-xl overflow-hidden border border-crystal-purple/30 shadow-glow-purple"
    >
      {/* Live indicator */}
      {isLive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full"
        >
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-sm font-medium">LIVE</span>
        </motion.div>
      )}

      {/* Twitch Player */}
      <div className="aspect-video bg-cave-deep">
        <iframe
          src={`https://player.twitch.tv/?channel=${channel}&parent=${hostname}&muted=true`}
          height="100%"
          width="100%"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          title={`${channel} Twitch Stream`}
        />
      </div>

      {/* Offline overlay (shown when not live) */}
      {!isLive && (
        <div className="absolute inset-0 bg-cave-dark/80 flex flex-col items-center justify-center text-center p-8">
          <div className="text-6xl mb-4">🔮</div>
          <h3 className="text-xl font-bold text-white mb-2">Stream Offline</h3>
          <p className="text-gray-400 max-w-sm">
            We're not live right now, but check back soon for more crystal crafting magic!
          </p>
          <a
            href={`https://twitch.tv/${channel}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 btn-crystal-outline"
          >
            <span>Follow on Twitch</span>
          </a>
        </div>
      )}
    </motion.div>
  )
}
