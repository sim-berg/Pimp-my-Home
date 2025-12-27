'use client'

import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/store'
import { useLanguage } from '@/lib/language-context'

function OrderConfirmationContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCartStore()

  // Clear cart after successful order
  useEffect(() => {
    if (sessionId) {
      clearCart()
    }
  }, [sessionId, clearCart])

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto text-center"
      >
        <div className="card-crystal py-12">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-crystal-teal to-crystal-teal-dark flex items-center justify-center shadow-glow-teal">
              <CheckCircleIcon className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-gradient">{t.order.confirmed}</span>
          </h1>

          {/* Order ID */}
          {sessionId && (
            <p className="text-gray-500 mb-6">
              {t.order.orderId}: <span className="text-gray-300">{sessionId}</span>
            </p>
          )}

          {/* Message */}
          <p className="text-gray-400 mb-8">
            {t.order.thankYou}
          </p>

          {/* Magic message */}
          <div className="p-4 rounded-lg bg-cave-light/50 border border-crystal-purple/20 mb-8">
            <p className="text-sm text-crystal-purple-light">
              ✨ {t.order.crystalEnergy}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-crystal">
              <span>{t.order.continueShopping}</span>
            </Link>
            <Link href="/" className="btn-crystal-outline">
              <span>{t.order.backHome}</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="card-crystal py-12 animate-pulse">
          <div className="w-20 h-20 mx-auto rounded-full bg-cave-light mb-6" />
          <div className="h-8 bg-cave-light rounded w-3/4 mx-auto mb-6" />
          <div className="h-4 bg-cave-light rounded w-1/2 mx-auto mb-8" />
          <div className="h-20 bg-cave-light rounded mb-8" />
          <div className="flex gap-4 justify-center">
            <div className="h-12 w-32 bg-cave-light rounded" />
            <div className="h-12 w-32 bg-cave-light rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-crystal-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-crystal-purple/10 rounded-full blur-3xl" />
      </div>

      <Suspense fallback={<LoadingFallback />}>
        <OrderConfirmationContent />
      </Suspense>
    </div>
  )
}
