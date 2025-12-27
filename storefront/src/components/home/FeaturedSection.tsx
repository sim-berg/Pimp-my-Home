'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { ProductCard } from '@/components/products/ProductCard'
import { MedusaProduct } from '@/lib/medusa'
import { useLanguage } from '@/lib/language-context'

interface FeaturedSectionProps {
  products: MedusaProduct[]
}

export function FeaturedSection({ products }: FeaturedSectionProps) {
  const { t } = useLanguage()

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-24 px-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-crystal-purple/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-crystal-teal/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="container mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block text-crystal-purple text-sm font-medium tracking-wider uppercase mb-2"
            >
              {t.products.collection}
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-gradient">{t.products.featured}</span>
            </h2>
          </div>

          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 text-gray-400 hover:text-crystal-purple transition-colors"
            >
              {t.products.viewAll}
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-crystal-outline"
            >
              <span className="flex items-center gap-2">
                {t.products.viewAllProducts}
                <ArrowRightIcon className="w-5 h-5" />
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
