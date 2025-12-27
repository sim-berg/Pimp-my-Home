import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const WEBHOOK_SECRET = process.env.POLAR_WEBHOOK_SECRET!

function verifyWebhookSignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('x-polar-signature') || ''

    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(payload)
    console.log('Received Polar webhook:', event.type)

    switch (event.type) {
      case 'checkout.created':
        console.log('Checkout created:', event.data.id)
        break

      case 'checkout.updated':
        const checkoutData = event.data
        if (checkoutData.status === 'succeeded') {
          console.log('Checkout succeeded:', checkoutData.id)

          // Extract metadata
          const metadata = checkoutData.metadata || {}
          const cartId = metadata.cart_id
          const shippingAddress = metadata.shipping_address
            ? JSON.parse(metadata.shipping_address)
            : null

          // TODO: Complete the order in Medusa
          // 1. Fetch the cart
          // 2. Create the order
          // 3. Clear the cart
          // 4. Send confirmation email
          // 5. Trigger Twitch alert (Phase 2)

          // Trigger Twitch purchase alert (Phase 2)
          if (process.env.TWITCH_SERVICE_URL) {
            try {
              await fetch(`${process.env.TWITCH_SERVICE_URL}/alerts/purchase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: checkoutData.id,
                  customerName: checkoutData.customer_email?.split('@')[0] || 'Anonymous',
                  product: 'Crystal Item', // Would come from cart
                  amount: checkoutData.amount,
                }),
              })
            } catch (error) {
              console.error('Failed to trigger Twitch alert:', error)
            }
          }
        }
        break

      case 'order.created':
        console.log('Order created:', event.data.id)
        break

      default:
        console.log('Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
