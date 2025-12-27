'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBagIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '@/lib/store'
import { clsx } from 'clsx'

interface AddToCartButtonProps {
  variantId: string
  disabled?: boolean
  className?: string
}

export function AddToCartButton({
  variantId,
  disabled = false,
  className,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const { addItem, isLoading } = useCartStore()

  const handleAddToCart = async () => {
    if (!variantId || disabled || isLoading) return

    try {
      await addItem(variantId, quantity)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    } catch (error) {
      console.error('Failed to add item to cart:', error)
    }
  }

  return (
    <div className={clsx('flex gap-4', className)}>
      {/* Quantity selector */}
      <div className="flex items-center gap-2 glass rounded-lg px-2">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="w-8 text-center font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          +
        </button>
      </div>

      {/* Add to cart button */}
      <motion.button
        onClick={handleAddToCart}
        disabled={disabled || isLoading}
        className={clsx(
          'flex-1 btn-crystal inline-flex items-center justify-center gap-2',
          (disabled || isLoading) && 'opacity-50 cursor-not-allowed'
        )}
        whileTap={{ scale: 0.95 }}
      >
        {isLoading ? (
          <>
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Adding...</span>
          </>
        ) : isAdded ? (
          <>
            <CheckIcon className="w-5 h-5" />
            <span>Added!</span>
          </>
        ) : (
          <>
            <ShoppingBagIcon className="w-5 h-5" />
            <span>Add to Cart</span>
          </>
        )}
      </motion.button>
    </div>
  )
}
