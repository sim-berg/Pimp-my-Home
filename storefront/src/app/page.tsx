import { sdk } from '@/lib/medusa'
import { HeroSection } from '@/components/home/HeroSection'
import { CategorySection } from '@/components/home/CategorySection'
import { FeaturedSection } from '@/components/home/FeaturedSection'
import { CTASection } from '@/components/home/CTASection'

export const revalidate = 60

async function getProducts() {
  try {
    const { products } = await sdk.store.product.list({ limit: 8 })
    return products || []
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

async function getCategories() {
  try {
    const { product_categories } = await sdk.store.category.list({ limit: 10 })
    return product_categories || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  return (
    <div className="relative">
      <HeroSection />
      {categories.length > 0 && <CategorySection categories={categories} />}
      <FeaturedSection products={products} />
      <CTASection />
    </div>
  )
}
