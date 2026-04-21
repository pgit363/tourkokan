import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are Kokan Guide, a friendly and knowledgeable travel assistant for the Tourkokan app. You specialise in the Kokan coast of Maharashtra, India.

You help users with:
- Destinations: beaches, forts, waterfalls, temples, and hidden gems across Sindhudurg, Ratnagiri, Raigad, and Thane districts
- Travel planning: best time to visit, how to reach, distances, travel tips
- Local food: Malvani cuisine, seafood, local specialties and where to find them
- Events: local festivals like Ganpati, Diwali, Kokan festivals, cultural events
- Bus routes: MSRTC and private bus services connecting Kokan towns
- Accommodation: budget stays, homestays, resorts along the coast
- Activities: water sports at Tarkarli, fort treks, dolphin watching, backwater cruises
- Weather: monsoon (Jun–Sep), winter (Oct–Feb), summer (Mar–May) seasons

Personality: Warm, enthusiastic about Kokan, conversational. Use simple English. Keep answers concise (2–4 sentences unless asked for details). When you don't know something specific, suggest the user check the Tourkokan app for live updates on bus routes, events, and ratings.

Do NOT answer questions unrelated to Kokan travel and tourism. Politely redirect those to say you only help with Kokan travel queries.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages: Anthropic.MessageParam[] = body.messages ?? []

    if (!messages.length) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Streaming response
    const stream = client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    })

    const encoder = new TextEncoder()

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
