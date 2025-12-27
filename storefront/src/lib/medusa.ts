import Medusa from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: PUBLISHABLE_KEY,
})

// Helper to get the SDK for server components
export function getMedusaClient() {
  return sdk
}

// Types for Medusa responses
export interface MedusaProduct {
  id: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  images: { url: string }[]
  variants: MedusaProductVariant[]
  options: MedusaProductOption[]
  created_at: string
  updated_at: string
}

export interface MedusaProductVariant {
  id: string
  title: string
  sku: string | null
  prices: MedusaPrice[]
  options: Record<string, string>
  inventory_quantity?: number
}

export interface MedusaProductOption {
  id: string
  title: string
  values: string[]
}

export interface MedusaPrice {
  id: string
  amount: number
  currency_code: string
}

export interface MedusaCart {
  id: string
  items: MedusaLineItem[]
  total: number
  subtotal: number
  tax_total: number
  shipping_total: number
  region_id: string
}

export interface MedusaLineItem {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  quantity: number
  unit_price: number
  total: number
  variant_id: string
  variant: MedusaProductVariant
}

export interface MedusaRegion {
  id: string
  name: string
  currency_code: string
  countries: { iso_2: string }[]
}

// Format price helper
export function formatPrice(amount: number, currencyCode: string = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100)
}

// Get the cheapest price from a product's variants
export function getCheapestPrice(product: MedusaProduct, currencyCode: string = "usd"): number | null {
  let cheapest: number | null = null

  for (const variant of product.variants) {
    const price = variant.prices.find(p => p.currency_code === currencyCode)
    if (price && (cheapest === null || price.amount < cheapest)) {
      cheapest = price.amount
    }
  }

  return cheapest
}
