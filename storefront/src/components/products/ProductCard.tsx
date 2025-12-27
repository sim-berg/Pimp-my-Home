'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { EyeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { MedusaProduct, formatPrice, getCheapestPrice } from '@/lib/medusa'
import { useLanguage } from '@/lib/language-context'
import { useCartStore } from '@/lib/store'

interface ProductCardProps {
  product: MedusaProduct
  currencyCode?: string
  index?: number
}

export function ProductCard({ product, currencyCode = 'usd', index = 0 }: ProductCardProps) {
  const { t } = useLanguage()
  const { addItem, isLoading } = useCartStore()
  const cheapestPrice = getCheapestPrice(product, currencyCode)
  const thumbnail = product.thumbnail || product.images?.[0]?.url

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.variants.length === 1) {
      await addItem(product.variants[0].id, 1)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={`/products/${product.handle}`} className="group block">
        <motion.div
          className="card-crystal overflow-hidden p-0"
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-cave-deep">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={product.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cave-medium to-cave-deep">
                <span className="text-6xl">💎</span>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-cave-darkest via-transparent to-transparent opacity-60" />

            {/* Hover overlay with glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-crystal-purple/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Action buttons */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <motion.button
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-cave-dark hover:bg-white transition-colors shadow-lg"
              >
                <EyeIcon className="w-5 h-5" />
              </motion.button>
              {product.variants.length === 1 && (
                <motion.button
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  onClick={handleQuickAdd}
                  disabled={isLoading}
                  className="w-12 h-12 rounded-xl bg-crystal-purple backdrop-blur-sm flex items-center justify-center text-white hover:bg-crystal-purple-light transition-colors shadow-lg shadow-crystal-purple/30"
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                </motion.button>
              )}
            </div>

            {/* Quick view badge */}
            <div className="absolute bottom-4 left-4 right-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                className="glass rounded-lg py-2 px-4 text-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
              >
                {t.products.quickView}
              </motion.div>
            </div>

            {/* Variants count badge */}
            {product.variants.length > 1 && (
              <div className="absolute top-4 right-4">
                <span className="badge text-[10px]">
                  {product.variants.length} {t.products.variants}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <h3 className="font-semibold text-white group-hover:text-gradient transition-all duration-300 line-clamp-1 text-lg">
              {product.title}
            </h3>

            {product.description && (
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Price */}
            {cheapestPrice !== null && (
              <div className="flex items-baseline gap-2 pt-2">
                <span className="price-tag text-xl">
                  {formatPrice(cheapestPrice, currencyCode)}
                </span>
                {product.variants.length > 1 && (
                  <span className="text-xs text-gray-500">{t.products.from}</span>
                )}
              </div>
            )}
          </div>

          {/* Bottom gradient line on hover */}
          <div className="h-1 bg-gradient-to-r from-crystal-purple via-crystal-teal to-crystal-pink transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </motion.div>
      </Link>
    </motion.div>
  )
}
