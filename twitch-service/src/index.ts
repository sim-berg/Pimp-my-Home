import express, { Request, Response } from 'express'
import cors from 'cors'
import crypto from 'crypto'
import Redis from 'ioredis'

const app = express()
const PORT = process.env.PORT || 4000

// Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

// Twitch webhook verification constants
const TWITCH_MESSAGE_SIGNATURE = 'twitch-eventsub-message-signature'
const TWITCH_MESSAGE_ID = 'twitch-eventsub-message-id'
const TWITCH_MESSAGE_TIMESTAMP = 'twitch-eventsub-message-timestamp'
const TWITCH_MESSAGE_TYPE = 'twitch-eventsub-message-type'

// Middleware
app.use(cors())

// Raw body parser for webhook signature verification
app.use('/webhooks/twitch', express.raw({ type: 'application/json' }))
app.use(express.json())

// Verify Twitch webhook signature
function verifyTwitchSignature(
  messageId: string,
  timestamp: string,
  body: string,
  signature: string
): boolean {
  const secret = process.env.TWITCH_WEBHOOK_SECRET
  if (!secret) {
    console.warn('TWITCH_WEBHOOK_SECRET not configured')
    return false
  }

  const message = messageId + timestamp + body
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    )
  } catch {
    return false
  }
}

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'twitch-service' })
})

// Get stream status
app.get('/stream/status', async (_req: Request, res: Response) => {
  try {
    const isLive = await redis.get('stream:live')
    res.json({ live: isLive === 'true' })
  } catch (error) {
    console.error('Failed to get stream status:', error)
    res.json({ live: false })
  }
})

// Set stream status (for testing/manual control)
app.post('/stream/status', async (req: Request, res: Response) => {
  try {
    const { live } = req.body
    await redis.set('stream:live', live ? 'true' : 'false')
    await redis.publish('stream:status', JSON.stringify({ live }))
    res.json({ success: true, live })
  } catch (error) {
    console.error('Failed to set stream status:', error)
    res.status(500).json({ error: 'Failed to update status' })
  }
})

// Twitch EventSub webhook handler
app.post('/webhooks/twitch', async (req: Request, res: Response) => {
  const messageType = req.headers[TWITCH_MESSAGE_TYPE] as string
  const messageId = req.headers[TWITCH_MESSAGE_ID] as string
  const timestamp = req.headers[TWITCH_MESSAGE_TIMESTAMP] as string
  const signature = req.headers[TWITCH_MESSAGE_SIGNATURE] as string

  const body = req.body.toString()

  // Verify signature
  if (!verifyTwitchSignature(messageId, timestamp, body, signature)) {
    console.error('Invalid Twitch webhook signature')
    return res.status(403).send('Forbidden')
  }

  const payload = JSON.parse(body)

  // Handle verification challenge
  if (messageType === 'webhook_callback_verification') {
    console.log('Twitch webhook verification challenge received')
    return res.status(200).send(payload.challenge)
  }

  // Handle revocation
  if (messageType === 'revocation') {
    console.log('Twitch subscription revoked:', payload.subscription.type)
    return res.status(200).send('OK')
  }

  // Handle notifications
  if (messageType === 'notification') {
    const eventType = payload.subscription.type

    console.log('Twitch event received:', eventType)

    switch (eventType) {
      case 'stream.online':
        console.log('Stream went online!')
        await redis.set('stream:live', 'true')
        await redis.publish('stream:status', JSON.stringify({
          live: true,
          startedAt: payload.event.started_at,
        }))
        break

      case 'stream.offline':
        console.log('Stream went offline')
        await redis.set('stream:live', 'false')
        await redis.publish('stream:status', JSON.stringify({
          live: false,
        }))
        break

      default:
        console.log('Unhandled Twitch event:', eventType)
    }
  }

  res.status(200).send('OK')
})

// Purchase alert endpoint (called from storefront webhook)
app.post('/alerts/purchase', async (req: Request, res: Response) => {
  try {
    const { orderId, customerName, product, amount } = req.body

    console.log('Purchase alert received:', { orderId, customerName, product, amount })

    // Publish to Redis for stream alerts
    const alert = {
      type: 'purchase',
      orderId,
      customerName: customerName || 'Anonymous',
      product: product || 'Crystal Item',
      amount,
      timestamp: new Date().toISOString(),
    }

    await redis.publish('alerts:purchase', JSON.stringify(alert))

    // Store recent purchases for display
    await redis.lpush('recent:purchases', JSON.stringify(alert))
    await redis.ltrim('recent:purchases', 0, 9) // Keep last 10

    res.json({ success: true, alert })
  } catch (error) {
    console.error('Failed to process purchase alert:', error)
    res.status(500).json({ error: 'Failed to process alert' })
  }
})

// Get recent purchases (for stream overlay)
app.get('/alerts/recent', async (_req: Request, res: Response) => {
  try {
    const purchases = await redis.lrange('recent:purchases', 0, 9)
    res.json({
      purchases: purchases.map((p) => JSON.parse(p)),
    })
  } catch (error) {
    console.error('Failed to get recent purchases:', error)
    res.json({ purchases: [] })
  }
})

// SSE endpoint for real-time alerts (for stream overlay)
app.get('/alerts/stream', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // Subscribe to Redis channels
  const subscriber = redis.duplicate()

  await subscriber.subscribe('alerts:purchase', 'stream:status')

  subscriber.on('message', (channel, message) => {
    res.write(`event: ${channel}\n`)
    res.write(`data: ${message}\n\n`)
  })

  // Cleanup on disconnect
  req.on('close', () => {
    subscriber.unsubscribe()
    subscriber.quit()
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🎮 Twitch service running on port ${PORT}`)
  console.log(`📺 Stream status: http://localhost:${PORT}/stream/status`)
  console.log(`🔔 Alerts endpoint: http://localhost:${PORT}/alerts/purchase`)
})
