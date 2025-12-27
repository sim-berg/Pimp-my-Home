import { NextRequest, NextResponse } from 'next/server'
import { Polar } from '@polar-sh/sdk'

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: (process.env.NEXT_PUBLIC_POLAR_SERVER as 'sandbox' | 'production') || 'sandbox',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartId, email, shippingAddress } = body

    // In a real implementation, you would:
    // 1. Fetch the cart from Medusa
    // 2. Create the order in Medusa
    // 3. Create a Polar checkout session

    // For now, we'll create a mock checkout
    // You'll need to configure Polar products in your Polar dashboard

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Create Polar checkout session
    // Note: You need to create a product in Polar first and use its price ID
    const checkout = await polar.checkouts.custom.create({
      // Use your actual Polar product price ID
      productPriceId: process.env.POLAR_PRODUCT_PRICE_ID || 'price_xxx',
      successUrl: `${baseUrl}/order/confirmation?session_id={CHECKOUT_ID}`,
      customerEmail: email,
      metadata: {
        cart_id: cartId,
        shipping_address: JSON.stringify(shippingAddress),
      },
    })

    return NextResponse.json({
      checkoutUrl: checkout.url,
      checkoutId: checkout.id,
    })
  } catch (error) {
    console.error('Polar checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
