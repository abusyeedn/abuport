import type { VercelRequest, VercelResponse } from '@vercel/node'
import { put } from '@vercel/blob'
import { randomUUID } from 'crypto'

// Best-effort in-memory rate limit — resets on cold start, but still blocks
// rapid-fire spam within a warm serverless instance. Not a substitute for a
// real rate limiter (e.g. Upstash) if this ever sees meaningful traffic.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const RATE_LIMIT_MAX = 3
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE_LIMIT_MAX
}

function getClientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for']
  const ip = Array.isArray(fwd) ? fwd[0] : fwd?.split(',')[0]
  return (ip || req.socket?.remoteAddress || 'unknown').trim()
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })

  const contentType = req.headers['content-type'] || ''
  if (!contentType.includes('application/json')) {
    return res.status(415).json({ error: 'Expected application/json.' })
  }

  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many messages sent — please try again later.' })
  }

  const { subject, body, website } = req.body as {
    subject?: string
    body?: string
    website?: string // honeypot — real users never fill this in
  }

  // Honeypot: bots fill every field, including ones hidden from real users.
  if (website) {
    return res.status(200).json({ ok: true }) // pretend success, drop silently
  }

  if (!body) {
    return res.status(400).json({ error: 'A message is required.' })
  }
  if (typeof body !== 'string' || (subject && typeof subject !== 'string')) {
    return res.status(400).json({ error: 'Invalid field types.' })
  }
  if (body.length > 5000) {
    return res.status(400).json({ error: 'Message is too long (max 5000 characters).' })
  }
  if (subject && subject.length > 200) {
    return res.status(400).json({ error: 'Subject is too long (max 200 characters).' })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ error: 'Storage is not configured yet (missing BLOB_READ_WRITE_TOKEN).' })
  }

  const record = {
    subject: (subject || '').trim().slice(0, 200),
    body: body.trim().slice(0, 5000),
    submittedAt: new Date().toISOString(),
  }

  try {
    await put(`contact/${Date.now()}-${randomUUID()}.json`, JSON.stringify(record, null, 2), {
      access: 'private',
      addRandomSuffix: false,
      contentType: 'application/json',
    })
    return res.status(200).json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to store your message. Please try again.' })
  }
}
