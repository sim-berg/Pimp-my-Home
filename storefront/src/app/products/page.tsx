import { Suspense } from 'react'
import { sdk, MedusaProduct } from '@/lib/medusa'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductsFilter } from '@/components/products/ProductsFilter'
import { ProductsHeader, ProductsEmptyState, ProductsCount } from '@/components/products/ProductsHeader'

export const revalidate = 60

interface ProductsPageProps {
  searchParams: { category?: string; sort?: string }
}

interface Category {
  id: string
  name: string
  handle: string
}

async function getProducts(category?: string): Promise<MedusaProduct[]> {
  try {
    const { products } = await sdk.store.product.list({
      limit: 50,
      // category_id: category ? [category] : undefined,
    })
    return (products || []) as MedusaProduct[]
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const { product_categories } = await sdk.store.category.list({
      limit: 20,
    })
    return (product_categories || []) as Category[]
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card-crystal animate-pulse">
          <div className="aspect-square bg-cave-light rounded-lg mb-4" />
          <div className="h-4 bg-cave-light rounded mb-2" />
          <div className="h-3 bg-cave-light rounded w-2/3" />
        </div>
      ))}
    </div>
  )
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams.category),
    getCategories(),
  ])

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-crystal-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-crystal-teal/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <ProductsHeader />

        {/* Filters */}
        <div className="mb-8">
          <ProductsFilter categories={categories} />
        </div>

        {/* Products grid */}
        <Suspense fallback={<ProductsSkeleton />}>
          {products.length === 0 ? (
            <ProductsEmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Suspense>

        {/* Results count */}
        {products.length > 0 && (
          <ProductsCount count={products.length} />
        )}
      </div>
    </div>
  )
}
