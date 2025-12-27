import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // In Phase 2, this will connect to the Twitch service
    const twitchServiceUrl = process.env.TWITCH_SERVICE_URL

    if (twitchServiceUrl) {
      const response = await fetch(`${twitchServiceUrl}/stream/status`, {
        cache: 'no-store',
      })
      const data = await response.json()
      return NextResponse.json(data)
    }

    // Default to offline if service not configured
    return NextResponse.json({ live: false })
  } catch (error) {
    console.error('Failed to check stream status:', error)
    return NextResponse.json({ live: false })
  }
}
