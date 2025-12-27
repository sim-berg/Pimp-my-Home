'use client'

import Image from 'next/image'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '@/lib/store'
import { MedusaLineItem, formatPrice } from '@/lib/medusa'

interface CartItemProps {
  item: MedusaLineItem
}

export function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem, isLoading } = useCartStore()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(item.id)
    } else {
      updateItem(item.id, newQuantity)
    }
  }

  return (
    <div className="flex gap-4 p-4 rounded-lg bg-cave-medium/50">
      {/* Image */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-cave-deep flex-shrink-0">
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl">💎</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-white truncate">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-gray-500 truncate">{item.description}</p>
        )}
        <p className="text-sm text-crystal-teal mt-1">
          {formatPrice(item.unit_price)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1 bg-cave-light rounded-lg">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isLoading}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              -
            </button>
            <span className="w-6 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isLoading}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            aria-label="Remove item"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Item total */}
      <div className="text-right flex-shrink-0">
        <span className="font-semibold text-white">
          {formatPrice(item.total)}
        </span>
      </div>
    </div>
  )
}
