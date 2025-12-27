'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'

interface Category {
  id: string
  name: string
  handle: string
  description?: string
}

interface CategorySectionProps {
  categories: Category[]
}

const categoryData: Record<string, { emoji: string; gradient: string }> = {
  crystals: { emoji: '💎', gradient: 'from-crystal-purple to-violet-600' },
  lamps: { emoji: '✨', gradient: 'from-amber-500 to-orange-600' },
  figurines: { emoji: '🐉', gradient: 'from-crystal-teal to-cyan-600' },
  'home-decor': { emoji: '🏠', gradient: 'from-crystal-pink to-rose-600' },
}

export function CategorySection({ categories }: CategorySectionProps) {
  const { t } = useLanguage()

  return (
    <section className="py-24 px-4 relative">
      {/* Section background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cave-deep/50 to-transparent pointer-events-none" />

      <div className="container mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{t.categories.title}</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            {t.categories.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const data = categoryData[category.handle] || { emoji: '✨', gradient: 'from-crystal-purple to-crystal-teal' }

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/products?category=${category.handle}`}>
                  <motion.div
                    className="group relative card-crystal text-center h-full overflow-hidden"
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${data.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${data.gradient} opacity-20 blur-xl`} />
                    </div>

                    {/* Icon */}
                    <motion.div
                      className={`relative w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${data.gradient} flex items-center justify-center text-4xl shadow-lg`}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {data.emoji}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${data.gradient} opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-500`} />
                    </motion.div>

                    {/* Name */}
                    <h3 className="relative font-semibold text-white group-hover:text-gradient transition-all duration-300 text-lg">
                      {category.name}
                    </h3>

                    {/* Arrow indicator */}
                    <motion.div
                      className="mt-3 text-gray-500 group-hover:text-crystal-purple transition-colors"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                    >
                      →
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
