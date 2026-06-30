import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const upstream = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    })
    const text = await upstream.text()
    res.setHeader('Content-Type', 'text/plain')
    res.status(upstream.status).send(text)
  } catch (e) {
    res.status(500).send('upstream error')
  }
}
