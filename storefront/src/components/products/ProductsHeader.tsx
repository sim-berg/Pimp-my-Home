'use client'

import { useLanguage } from '@/lib/language-context'

export function ProductsHeader() {
  const { t } = useLanguage()

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        <span className="text-gradient">{t.products.title}</span>
      </h1>
      <p className="text-gray-400 max-w-2xl mx-auto">
        {t.hero.description}
      </p>
    </div>
  )
}

interface ProductsEmptyStateProps {
  count: number
}

export function ProductsEmptyState() {
  const { t } = useLanguage()

  return (
    <div className="text-center py-16">
      <p className="text-gray-400 text-lg">{t.products.noProducts}</p>
      <p className="text-gray-500 mt-2">{t.products.checkBack}</p>
    </div>
  )
}

export function ProductsCount({ count }: ProductsEmptyStateProps) {
  const { t } = useLanguage()

  return (
    <p className="text-center text-gray-500 mt-8">
      {t.products.showing} {count} {count === 1 ? 'Produkt' : 'Produkte'}
    </p>
  )
}
