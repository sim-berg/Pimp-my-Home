'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { sdk, MedusaProduct, formatPrice } from '@/lib/medusa'
import { ProductGallery } from '@/components/products/ProductGallery'
import { VariantSelector } from '@/components/products/VariantSelector'
import { AddToCartButton } from '@/components/products/AddToCartButton'

interface ProductPageProps {
  params: { handle: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<MedusaProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [selectedVariant, setSelectedVariant] = useState<MedusaProduct['variants'][0] | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { products } = await sdk.store.product.list({
          handle: params.handle,
        })

        const foundProduct = products?.[0] as unknown as MedusaProduct
        if (!foundProduct) {
          notFound()
          return
        }

        setProduct(foundProduct)

        // Set default options to first values
        const defaultOptions: Record<string, string> = {}
        foundProduct.options.forEach((option) => {
          if (option.values.length > 0) {
            defaultOptions[option.title] = option.values[0]
          }
        })
        setSelectedOptions(defaultOptions)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.handle])

  // Find matching variant when options change
  useEffect(() => {
    if (!product) return

    const variant = product.variants.find((v) =>
      Object.entries(selectedOptions).every(
        ([key, value]) => v.options[key] === value
      )
    )
    setSelectedVariant(variant || null)
  }, [product, selectedOptions])

  const handleOptionChange = (optionTitle: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionTitle]: value,
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-cave-medium rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 bg-cave-medium rounded w-3/4" />
              <div className="h-4 bg-cave-medium rounded w-1/4" />
              <div className="h-20 bg-cave-medium rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return notFound()
  }

  const currentPrice = selectedVariant?.prices.find(
    (p) => p.currency_code === 'usd'
  )

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-crystal-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-crystal-teal/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Gallery */}
          <ProductGallery
            images={product.images || []}
            title={product.title}
          />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {product.title}
              </h1>
              {selectedVariant?.sku && (
                <p className="text-sm text-gray-500">SKU: {selectedVariant.sku}</p>
              )}
            </div>

            {/* Price */}
            {currentPrice && (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gradient">
                  {formatPrice(currentPrice.amount, currentPrice.currency_code)}
                </span>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-gray-400 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Variant selector */}
            <VariantSelector
              options={product.options}
              variants={product.variants}
              selectedOptions={selectedOptions}
              onOptionChange={handleOptionChange}
            />

            {/* Add to cart */}
            <AddToCartButton
              variantId={selectedVariant?.id || ''}
              disabled={!selectedVariant}
            />

            {/* Product features */}
            <div className="border-t border-white/10 pt-6 space-y-4">
              <h3 className="font-semibold text-white">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-crystal-teal">✓</span>
                  Premium 3D printed quality
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-crystal-teal">✓</span>
                  Eco-friendly materials
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-crystal-teal">✓</span>
                  Handcrafted with care
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-crystal-teal">✓</span>
                  Worldwide shipping available
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
