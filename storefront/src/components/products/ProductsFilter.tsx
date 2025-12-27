'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { clsx } from 'clsx'

interface Category {
  id: string
  name: string
  handle: string
}

interface ProductsFilterProps {
  categories: Category[]
}

export function ProductsFilter({ categories }: ProductsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')

  const handleCategoryChange = (categoryHandle: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (categoryHandle) {
      params.set('category', categoryHandle)
    } else {
      params.delete('category')
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => handleCategoryChange(null)}
        className={clsx(
          'px-4 py-2 rounded-lg transition-all',
          !currentCategory
            ? 'bg-crystal-purple text-white shadow-glow-sm'
            : 'glass glass-hover text-gray-300'
        )}
      >
        All Products
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.handle)}
          className={clsx(
            'px-4 py-2 rounded-lg transition-all',
            currentCategory === category.handle
              ? 'bg-crystal-purple text-white shadow-glow-sm'
              : 'glass glass-hover text-gray-300'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
