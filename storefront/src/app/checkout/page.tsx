'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/medusa'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { useLanguage } from '@/lib/language-context'

export default function CheckoutPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { cart, isLoading } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect to cart if empty
  useEffect(() => {
    if (mounted && !isLoading && (!cart?.items || cart.items.length === 0)) {
      router.push('/products')
    }
  }, [mounted, cart, isLoading, router])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-cave-medium rounded w-1/3 mb-8" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-12 bg-cave-medium rounded" />
                <div className="h-12 bg-cave-medium rounded" />
                <div className="h-12 bg-cave-medium rounded" />
              </div>
              <div className="h-64 bg-cave-medium rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cart?.items || cart.items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-crystal-purple/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">
            <span className="text-gradient">{t.checkout.title}</span>
          </h1>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Checkout Form */}
            <div className="md:col-span-3">
              <CheckoutForm cart={cart} />
            </div>

            {/* Order Summary */}
            <div className="md:col-span-2">
              <div className="card-crystal sticky top-24">
                <h2 className="text-lg font-semibold mb-4">{t.checkout.orderSummary}</h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-cave-deep flex-shrink-0">
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span>💎</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.total)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t.cart.subtotal}</span>
                    <span>{formatPrice(cart.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t.cart.shipping}</span>
                    <span>{cart.shipping_total ? formatPrice(cart.shipping_total) : t.cart.calculatedNext}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t.cart.tax}</span>
                    <span>{cart.tax_total ? formatPrice(cart.tax_total) : t.cart.calculatedNext}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-white/10">
                    <span>{t.cart.total}</span>
                    <span className="text-gradient">{formatPrice(cart.total || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
