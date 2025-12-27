'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MedusaCart } from '@/lib/medusa'
import { useCartStore } from '@/lib/store'
import { useLanguage } from '@/lib/language-context'

interface CheckoutFormProps {
  cart: MedusaCart
}

interface FormData {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  country: string
  phone: string
}

export function CheckoutForm({ cart }: CheckoutFormProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const { clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'polar' | 'paypal'>('polar')
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'DE',
    phone: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (paymentMethod === 'polar') {
        // Redirect to Polar checkout
        const response = await fetch('/api/checkout/polar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartId: cart.id,
            email: formData.email,
            shippingAddress: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              address_1: formData.address,
              city: formData.city,
              postal_code: formData.postalCode,
              country_code: formData.country,
              phone: formData.phone,
            },
          }),
        })

        const data = await response.json()

        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
        } else {
          throw new Error('Failed to create checkout session')
        }
      } else {
        // PayPal flow (Phase 2)
        alert('PayPal checkout coming soon!')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Information */}
      <div className="card-crystal">
        <h2 className="text-lg font-semibold mb-4">{t.checkout.contact}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
              {t.checkout.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-cave-light border border-white/10 text-white placeholder-gray-500 focus:border-crystal-purple focus:outline-none focus:ring-1 focus:ring-crystal-purple"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm text-gray-400 mb-1">
              {t.checkout.phone}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-cave-light border border-white/10 text-white placeholder-gray-500 focus:border-crystal-purple focus:outline-none focus:ring-1 focus:ring-crystal-purple"
              placeholder="+49 123 456789"
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="card-crystal">
        <h2 className="text-lg font-semibold mb-4">{t.checkout.shipping}</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm text-gray-400 mb-1">
                {t.checkout.firstName}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-cave-light border border-white/10 text-white placeholder-gray-500 focus:border-crystal-purple focus:outline-none focus:ring-1 focus:ring-crystal-purple"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm text-gray-400 mb-1">
                {t.checkout.lastName}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-cave-light border border-white/10 text-white placeholder-gray-500 focus:border-crystal-purple focus:outline-none focus:ring-1 focus:ring-crystal-purple"
              />
            </div>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm text-gray-400 mb-1">
              {t.checkout.address}
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-cave-light border border-white/10 text-white placeholder-gray-500 focus:border-crystal-purple focus:outline-none focus:ring-1 focus:ring-crystal-purple"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm text-gray-400 mb-1">
                {t.checkout.city}
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-cave-light border border-white/10 text-white placeholder-gray-500 focus:border-crystal-purple focus:outline-none focus:ring-1 focus:ring-crystal-purple"
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm text-gray-400 mb-1">
                {t.checkout.postalCode}
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                required
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-cave-light border border-white/10 text-white placeholder-gray-500 focus:border-crystal-purple focus:outline-none focus:ring-1 focus:ring-crystal-purple"
              />
            </div>
          </div>
          <div>
            <label htmlFor="country" className="block text-sm text-gray-400 mb-1">
              {t.checkout.country}
            </label>
            <select
              id="country"
              name="country"
              required
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-cave-light border border-white/10 text-white focus:border-crystal-purple focus:outline-none focus:ring-1 focus:ring-crystal-purple"
            >
              <option value="DE">Deutschland</option>
              <option value="AT">Österreich</option>
              <option value="CH">Schweiz</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="FR">France</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="card-crystal">
        <h2 className="text-lg font-semibold mb-4">{t.checkout.payment}</h2>
        <div className="space-y-3">
          <label className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            paymentMethod === 'polar'
              ? 'border-crystal-purple bg-crystal-purple/10'
              : 'border-white/10 hover:border-crystal-purple/50'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="polar"
              checked={paymentMethod === 'polar'}
              onChange={(e) => setPaymentMethod(e.target.value as 'polar')}
              className="sr-only"
            />
            <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-sm font-bold text-black">
              Polar
            </div>
            <div>
              <p className="font-medium">{t.checkout.payWithPolar}</p>
              <p className="text-sm text-gray-500">{t.checkout.securePayment}</p>
            </div>
          </label>

          <label className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            paymentMethod === 'paypal'
              ? 'border-crystal-purple bg-crystal-purple/10'
              : 'border-white/10 hover:border-crystal-purple/50'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
              className="sr-only"
            />
            <div className="w-12 h-8 bg-[#FFC439] rounded flex items-center justify-center text-sm font-bold text-[#003087]">
              PP
            </div>
            <div>
              <p className="font-medium">{t.checkout.paypal}</p>
              <p className="text-sm text-gray-500">{t.checkout.comingSoon}</p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || paymentMethod === 'paypal'}
        className="w-full btn-crystal py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>
          {isSubmitting ? t.checkout.processing : t.checkout.completeOrder}
        </span>
      </button>
    </form>
  )
}
