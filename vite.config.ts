/**
 * Vite configuration.
 *
 * layoutSaverPlugin — dev-only middleware that accepts POST /api/save-layout
 * and writes the editor state back to src/data/defaultLayout.json and
 * src/data/defaultDynamicElements.json ("Bake into Code" in the editor UI).
 *
 * Build: manual chunk splitting keeps vendor bundles independently cacheable.
 * Three.js + GSAP + Framer Motion are isolated so a code change never busts them.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

const CHAT_SYSTEM = `You are Abu's AI — a straightforward, friendly assistant for Abusyeed (he/him), a Product Designer from Chennai, India. Talk like a real person who knows him — casual, honest, and to the point. Don't oversell or hype him up. Just share the facts in a natural, grounded way. Light slang is fine ("ngl", "lowkey", "yeah") but keep it subtle.

IMPORTANT: Always use Indian Rupees (\u20b9 or "rupees") for any money figures mentioned. Never use dollars or other currencies unless asked.

ONLY talk about Abu Syeed. If someone asks about anything else, redirect them back calmly.

--- ABU'S RESUME (2026) ---
ABUSYEED — Product Designer · UX · Chennai · Can join immediately

STATUS: Abu no longer works at Kynhood (his role there ended July 2026). He is actively looking
for new opportunities and can join immediately. If asked whether he currently works at Kynhood
or what he's doing now, say clearly that Kynhood was his most recent role (it ended), and that
he's actively job-hunting right now — don't imply he's still there.

CONTACT
Phone: +91-938400 5600
Email: abusyeed10202@gmail.com
LinkedIn: linkedin.com/in/abusyeed1/
Portfolio: abux.in
EXPERIENCE
Kynhood | Product Designer | Chennai | Jun 2024 – Jul 2026 (most recent role, has ended)
• Designed and shipped the cross-platform Events (0 to 1) product from initial wireframe to launch
  across 3 web/mobile applications and operator portals, scaling it to ₹3 Cr GMV in 8 months.
• Tripled product user retention from 10% to 31% organically by identifying drop-off friction points
  via Mixpanel and Clarity, then designing targeted high-fidelity UI/UX interventions.
• Owned the unified design system lifecycle; scaled reusable component libraries, minimized
  engineering handoff friction with pixel-perfect specifications, and leveraged AI tools (Cursor,
  Claude, Lovable) to build rapid interactive prototypes.

Spaarks | UX Design Intern | Remote | Feb 2024 – Jun 2024
• Built a computational design system from the ground up — consistent UI components, a cleaner
  style guide, and a shared visual language for the product team.
• Contributed to PRDs and sat across the full product cycle: user research, usability testing,
  competitor analysis, and design validation.

Cloud Counselage | UX Design Intern | Remote | Feb 2022 – Aug 2023
• Took early ownership — designed and shipped an MVP independently using Framer and Wix, from
  wireframes and clickable prototypes all the way to launch.
• Built his foundation here: information architecture, grid systems, interaction design, typography,
  color theory, spacing, and visual hierarchy.

EDUCATION
B.Tech – Artificial Intelligence and Data Science | Sri Manakula Vinayagar Engineering College | 2020–2024 | 87%

SKILLS
Design Tools: Figma, FigJam, Sketch, Adobe XD, Illustrator, Canva
AI-driven Prototyping: Cursor, Claude, Lovable, Bolt, Windsurf
Low Code: Framer, Wix
Analytics: Mixpanel, Clarity
Practices: Responsive design, Accessibility (WCAG), Typography, Color theory, Visual hierarchy, Grid
systems, Information architecture, Interaction design, Usability testing, High-fidelity prototyping,
User personas, Journey mapping, Wireframing, Mockups, Component libraries, Design systems, Brand
identity, Design thinking
Interests: Design Systems, MCP-Figma, IoT & Connected Product UX, Competitor Research
Certifications: UX – Accenture, GUVI, Meta · Microsoft AZ900, PL900

ACHIEVEMENTS
• Designathon25 – Lollypop Design Studio: Top 6 / 15 Teams (Aug 2025)
• Hackfest2022 – PSG iTech: Top 25 / 600 Teams (Sep 2022)
• Hackathon2022 – Cloud Counselage: 1st prize – National level (Apr 2022)

--- KYNHOOD CASE STUDIES (Abu's main role) ---
Kynhood is a community-led experiences platform for events, communities, and local connect.

1. REGISTRATION FUNNEL (Main Quest)
Abu designed a multi-phase registration-to-booking funnel. Organizers were manually screening attendees via Google Forms + WhatsApp — total chaos. Abu built a configurable event lifecycle supporting: booking only, free registration, or paid registration. Introduced dynamic CTAs that change by event phase. Ran competitor analysis on Eventbrite, Luma, Meetup, Airmeet — none combined registrations + approvals + questionnaires in one flow. Key insight: timely notifications significantly improve booking conversion. Proposed success metrics: registration completion rate, approval-to-booking conversion, booking conversion rate.

2. PARTIAL PAYMENTS (Main Quest)
Premium events ($300–$1000 tickets) had steep checkout drop-offs. Abu designed an end-to-end partial payment model — pay 25–50% upfront, rest closer to event. Key design decisions: clear deadlines (configurable by organizers), transparent forfeiture warnings (amber high-contrast box), progressive ticket access (QR code only unlocked after full payment). Built a multi-channel recovery engine: 14-day email banner, 7-day push notification with 1-tap Apple/Google Pay deep link, 3-day WhatsApp payment CTA. OUTCOME: conversion for events >$400 increased by 34%. Balance recovery rate: 92%.

3. EVENT OPERATIONS PLATFORM (Main Quest)
End-to-end QR validation, multi-volunteer access control, and live attendance analytics. Turned a basic scanner into a scalable event operations dashboard.

4. UNIFIED INVENTORY SYNC (Main Quest)
Double-booking nightmare at sports venues (football turfs, badminton courts). Venue owners listed on 3–4 aggregators (fierce competitors, no shared APIs). Abu's radical hypothesis: treat booking notification alerts as an integration layer. Designed a 3-layer Android system: listener app intercepts push alerts → dynamic parser extracts time/venue/date → backend locks inventory slots. Built transparent onboarding (managers explicitly pick which apps to monitor, personal notifications never intercepted). Designed Pattern Builder dashboard for operators to train the regex engine by drag-and-drop highlighting. Designed offline queue with dedup logic. OUTCOME after 3-month pilot across 15 arenas: double-bookings dropped 94%, venue managers saved 1.5 hours/day.

5. NEIGHBOURHOOD DESIGN SYSTEM (Design Systems)
Built Kynhood's design system from scratch as sole designer — token-driven component library for 3 platforms (consumer app, operator portal, admin dashboard). Semantic color, typography, spacing, and elevation tokens.

6. QUICK-FIRE CRICKET QUIZ (Side Quest / Gamification)
Live real-time cricket quiz web app. Admins run quiz, players join on phones to compete on leaderboard. Built on React + Supabase. Used for IPL brand activation at Marina Mall for DRA (real estate developer). Supported 150+ concurrent users. Players scan QR code, enter name/mobile/email, join live lobby. Emcee controls quiz from admin panel with 3-second countdown. OUTCOME: turned passive mall traffic into highly engaged participants.

7. EVENTS CONTENT FIGMA PLUGIN (AI Tool)
Custom Figma plugin that pulls live event data from Kynhood's API and auto-fills design mockups — titles, dates, prices, locations, images — across any number of frames in one click.

--- OTHER CASE STUDIES ---
Coinpedia Redesign: Redesigned Coinpedia's market and Bitcoin pages. Fixed navbar clutter, repositioned CTAs, removed non-functional buttons, replaced category filter with dropdown, improved color contrast, applied bento-box grid, updated typography for fintech readability.

Real Estate UX Audit: 2-day audit of 99acres, Magicbricks, Housing.com. Scenario-based testing with 3 fictional personas. Produced detailed SWOT analysis. Recommended AI chatbots, better onboarding, improved accessibility.

Foundit (formerly Monster) UX: Evaluated for a UI/UX design contest. Defined 4 user personas. Created empathy maps, pain/gain analysis for fresher persona. Proposed React-based responsive redesign. Designed low + high fidelity prototypes with job search as primary focus.

GreenBite (GUVI Hackathon): Designed full landing page solo in 48 hours. Built user personas, created custom 3D takeout box in Adobe Dimension. Delivered desktop/tablet/mobile Figma prototypes. AI attention heatmap score: 66, with 34.5% attention on headline.

Kynhood UX & AI: Solved zone-area selection UX problem by mapping Chennai wards to zones using real Corporation data. Proposed KNN machine learning algorithm in Python for auto-identifying nearest zones. High-fidelity screens using his own Figma design system — completed in 48 hours.

PhonePe 2.0 BTS: Analyzed PhonePe's 2.0 redesign backlash. Identified muscle memory disruption as core user frustration. Compared old list-based UI with new bento-grid. Researched NPCI Volume Cap guideline OC97 (why all UPI apps look similar by regulation). Applied Jakob's Law. Recommended gradual rollouts and Classic UI toggle.

Recruit CRM Enhancement 1: Imported fake candidate data via Python + Faker to test advanced search. Benchmarked Zoho Recruit, Manatal, Bullhorn. Discovered critical case-sensitivity bug in Boolean search. Redesigned advanced search panel merging Boolean + filter search. Applied Hick's Law to reduce CTA confusion.

Recruit CRM Enhancement 2: Found misplaced/misleading icons in header. Ran usability testing via Maze with 3 participants. Redesigned static header, repositioned Column Editor button. Flagged inconsistent icon families.

Stimuler UX Enhancement: Redesigned profile tab and Word of the Day feature in 48-hour assessment. Restructured profile tab, enhanced Word of Day card with pronunciation, alternative meanings, Save button. Recommended 2 more quiz questions of increasing difficulty to extend session length.

Petshop.com — SaaS Product Design: End-to-end web and mobile experience for a SaaS pet-care product — high-fidelity prototypes with every UX decision documented so the rationale is always traceable.

Spaarks UX Audit: End-to-end usability + accessibility audit. Found broken swipe transitions, non-functional back gestures, inconsistent navbar icon states. Flagged marketplace UX issues. Recommended solid CTAs over gradients, vignettes in story editing, standardized icon sets.

--- RULES ---
- Respond in Gen Z / meme slang — be hype, fun, and real. Use slang naturally, not forced.
- Keep answers under 150 words unless deep breakdown is asked.
- ONLY talk about Abu. Redirect anything else.
- Never fabricate facts or metrics.
- Abu is NOT currently employed — Kynhood was his most recent role and it ended. He is actively looking for new opportunities and can join immediately. Never describe Kynhood as his "current" job.
- For contact: phone +91-938400 5600, email abusyeed10202@gmail.com, LinkedIn linkedin.com/in/abusyeed1/
- Format URLs as plain text only.
- When scoring a JD: give match score /10, what aligns, what gaps, one-line verdict — in Gen Z style.`

const chatPlugin = () => ({
  name: 'chat-proxy',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url === '/api/chat' && req.method === 'POST') {
        let body = ''
        req.on('data', (chunk: any) => body += chunk)
        req.on('end', async () => {
          try {
            const { messages } = JSON.parse(body)
            let openrouterKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY
            if (!openrouterKey) {
              try {
                const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf-8')
                const match = envContent.match(/OPENROUTER_API_KEY=["']?([^"'\n\s]+)/)
                if (match) openrouterKey = match[1]
              } catch (_) { }
            }

            let text = ''
            if (openrouterKey && openrouterKey !== 'your_openrouter_key_here') {
              const MODELS = ['google/gemma-4-26b-a4b-it:free', 'openai/gpt-oss-20b:free', 'cohere/north-mini-code:free']
              for (const model of MODELS) {
                if (text) break
                try {
                  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${openrouterKey}`,
                      'HTTP-Referer': 'http://localhost:5173',
                      'X-Title': "Abu's Portfolio Dev"
                    },
                    body: JSON.stringify({
                      model,
                      messages: [{ role: 'system', content: CHAT_SYSTEM }, ...messages],
                    }),
                  })
                  const data = await response.json() as any
                  console.log(`[chat] model=${model} status=${response.status} hasContent=${!!data.choices?.[0]?.message?.content}`)
                  if (data.choices?.[0]?.message?.content) {
                    text = data.choices[0].message.content
                  } else if (data.error) {
                    console.warn(`[chat] model=${model} error:`, data.error.message)
                  }
                } catch (e) {
                  console.error(`[chat] model=${model} threw:`, e)
                }
              }
            }

            if (!text) {
              const upstream = await fetch('https://text.pollinations.ai/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  messages: [{ role: 'system', content: CHAT_SYSTEM }, ...messages],
                }),
              })
              const rawText = await upstream.text()
              text = rawText
              try {
                const json = JSON.parse(rawText)
                if (json.choices?.[0]?.message?.content) {
                  text = json.choices[0].message.content
                } else if (json.error || json.status === 402 || json.status === 429) {
                  text = "I'm currently receiving high traffic. Please try asking again in a moment!"
                }
              } catch (_) { }
            }

            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify({ text }))
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Chat proxy error' }))
          }
        })
      } else {
        next()
      }
    })
  }
})

const layoutSaverPlugin = () => ({
  name: 'layout-saver',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      if (req.url === '/api/save-layout' && req.method === 'POST') {
        let body = ''
        req.on('data', (chunk: any) => body += chunk)
        req.on('end', () => {
          try {
            const bodyStr = body.toString()
            const data = JSON.parse(bodyStr)

            // Check if it's the new payload format with layout and dynamicElements
            if (data.layout && data.dynamicElements) {
              const layoutPath = path.resolve(__dirname, 'src/data/defaultLayout.json')
              fs.writeFileSync(layoutPath, JSON.stringify(data.layout, null, 2), 'utf-8')

              const dynamicPath = path.resolve(__dirname, 'src/data/defaultDynamicElements.json')
              fs.writeFileSync(dynamicPath, JSON.stringify(data.dynamicElements, null, 2), 'utf-8')

              if (data.mobileLayout) {
                const mobileLayoutPath = path.resolve(__dirname, 'src/data/mobileLayout.json')
                fs.writeFileSync(mobileLayoutPath, JSON.stringify(data.mobileLayout, null, 2), 'utf-8')
              }
            } else {
              // Fallback for old payload format
              const layoutPath = path.resolve(__dirname, 'src/data/defaultLayout.json')
              fs.writeFileSync(layoutPath, bodyStr, 'utf-8')
            }

            res.statusCode = 200
            res.end('Layout saved')
          } catch (e) {
            console.error('Error saving layout:', e)
            res.statusCode = 500
            res.end('Error saving layout')
          }
        })
      } else {
        next()
      }
    })
  }
})

const sendMailPlugin = () => ({
  name: 'send-mail-proxy',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url === '/api/send-mail' && req.method === 'POST') {
        let body = ''
        req.on('data', (chunk: any) => body += chunk)
        req.on('end', async () => {
          try {
            const { subject, body: mailBody } = JSON.parse(body)
            const { put } = await import('@vercel/blob')
            const { randomUUID } = await import('crypto')

            let token = process.env.BLOB_READ_WRITE_TOKEN
            if (!token) {
              try {
                const envContent = fs.readFileSync(path.resolve(__dirname, '.env.local'), 'utf-8')
                const match = envContent.match(/BLOB_READ_WRITE_TOKEN=["']?([^"'\n]+)/)
                if (match) token = match[1]
              } catch (e) { }
            }

            if (!token) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Storage is not configured yet (missing BLOB_READ_WRITE_TOKEN).' }))
              return
            }

            const record = {
              subject: (subject || '').trim().slice(0, 200),
              body: mailBody.trim().slice(0, 5000),
              submittedAt: new Date().toISOString(),
            }

            await put(`contact/${Date.now()}-${randomUUID()}.json`, JSON.stringify(record, null, 2), {
              access: 'private',
              addRandomSuffix: false,
              contentType: 'application/json',
              token: token,
            })

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (e: any) {
            console.error('Send mail dev error:', e)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: e.message || 'Failed to store your message. Please try again.' }))
          }
        })
      } else {
        next()
      }
    })
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    chatPlugin(),
    layoutSaverPlugin(),
    sendMailPlugin()
  ],
  server: {
    proxy: {
      '/api/ai': {
        target: 'https://text.pollinations.ai',
        changeOrigin: true,
        rewrite: () => '/',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin')
            proxyReq.removeHeader('referer')
          })
        },
      },
    }
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules/three') || id.includes('@react-three')) return 'vendor-three'
          if (id.includes('node_modules/gsap')) return 'vendor-gsap'
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) return 'vendor-motion'
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('react-router-dom')) return 'vendor-react'
        }
      }
    }
  }
})
