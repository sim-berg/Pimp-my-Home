'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TwitchEmbed } from '@/components/twitch/TwitchEmbed'
import { ProductCard } from '@/components/products/ProductCard'
import { sdk, MedusaProduct } from '@/lib/medusa'
import { useLanguage } from '@/lib/language-context'

export default function LivePage() {
  const { t } = useLanguage()
  const [isLive, setIsLive] = useState(false)
  const [products, setProducts] = useState<MedusaProduct[]>([])

  useEffect(() => {
    // Fetch featured products to show alongside stream
    async function fetchProducts() {
      try {
        const { products } = await sdk.store.product.list({ limit: 4 })
        setProducts(products || [])
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }
    fetchProducts()

    // Check stream status (Phase 2: connect to actual service)
    // For now, we'll simulate it
    const checkStreamStatus = async () => {
      try {
        const response = await fetch('/api/twitch/status')
        const data = await response.json()
        setIsLive(data.live)
      } catch {
        // Stream status service not available
        setIsLive(false)
      }
    }

    checkStreamStatus()
    const interval = setInterval(checkStreamStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const twitchChannel = process.env.NEXT_PUBLIC_TWITCH_CHANNEL || 'your_channel'

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-crystal-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-crystal-teal/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            {isLive ? (
              <span className="badge badge-live">
                {t.live.liveNow}
              </span>
            ) : (
              <span className="badge">
                {t.live.offline}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{t.live.title}</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t.live.description}
          </p>
        </motion.div>

        {/* Stream Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Stream Player */}
          <div className="lg:col-span-2">
            <TwitchEmbed channel={twitchChannel} />
          </div>

          {/* Stream Info */}
          <div className="space-y-6">
            {/* Live discount banner */}
            {isLive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-crystal bg-gradient-to-br from-crystal-purple/20 to-crystal-teal/20 border-crystal-purple/30"
              >
                <div className="text-center">
                  <span className="text-4xl mb-2 block">✨</span>
                  <h3 className="text-xl font-bold text-gradient mb-2">
                    {t.live.streamSpecial}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {t.live.useCode} <span className="font-mono bg-cave-light px-2 py-1 rounded">LIVE10</span> {t.live.forDiscount}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t.live.validWhileLive}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Stream schedule */}
            <div className="card-crystal">
              <h3 className="font-semibold mb-4">{t.live.schedule}</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex justify-between">
                  <span>{t.live.monday}</span>
                  <span className="text-crystal-teal">19:00 CET</span>
                </li>
                <li className="flex justify-between">
                  <span>{t.live.wednesday}</span>
                  <span className="text-crystal-teal">19:00 CET</span>
                </li>
                <li className="flex justify-between">
                  <span>{t.live.saturday}</span>
                  <span className="text-crystal-teal">14:00 CET</span>
                </li>
              </ul>
            </div>

            {/* Social links */}
            <div className="card-crystal">
              <h3 className="font-semibold mb-4">{t.live.followUs}</h3>
              <div className="flex gap-3">
                <a
                  href={`https://twitch.tv/${twitchChannel}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg bg-[#9146FF] text-white text-center text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Twitch
                </a>
                <a
                  href="#"
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="flex-1 py-2 rounded-lg bg-[#5865F2] text-white text-center text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Discord
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        {products.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">
              <span className="text-gradient">{t.live.featuredToday}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
