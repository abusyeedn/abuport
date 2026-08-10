/**
 * companyEnrichment.ts
 *
 * Resolves the visitor's IP to the organisation that owns it and attaches that
 * to PostHog, so the Persons/Events views can answer "which company looked at
 * the portfolio, and when".
 *
 * What this can and can't do - worth being clear about:
 *  - It resolves the NETWORK the visitor is on, not the individual. Someone on
 *    an office network resolves to their employer; someone on home wifi or
 *    mobile data resolves to their ISP (Jio, Airtel, Comcast …), which tells
 *    you nothing useful. `is_likely_company` flags which of the two it looks
 *    like so consumer ISPs can be filtered out in PostHog.
 *  - It cannot identify a person. Person-level de-anonymisation needs a paid
 *    B2B identity vendor and carries real consent/GDPR obligations.
 *  - "At what time" needs nothing extra: PostHog timestamps every event.
 *
 * Lookup uses ipwho.is - no API key, no signup, CORS-enabled, free tier. The
 * call is fire-and-forget behind a timeout and fails silently: analytics must
 * never delay or break a page render.
 */
import type { PostHog } from 'posthog-js'

const LOOKUP_URL = 'https://ipwho.is/'
const TIMEOUT_MS = 4000
/** Once per tab - the network can't meaningfully change mid-session. */
const SESSION_FLAG = 'company_enriched'

/**
 * Consumer ISPs / mobile carriers / clouds resolve to an org name too, but they
 * mean "a person at home" or "a bot", not "a company visited". Matching is on
 * substrings because the same carrier appears under many legal-entity names.
 */
const CONSUMER_NETWORK_HINTS = [
  'jio', 'airtel', 'vodafone', 'idea cellular', 'bsnl', 'mtnl', 'act fibernet',
  'hathway', 'excitel', 'tikona', 'you broadband', 'railtel',
  'comcast', 'verizon', 'at&t', 'spectrum', 'charter', 'cox communications',
  't-mobile', 'sprint', 'centurylink', 'frontier', 'virgin media', 'bt group',
  'sky broadband', 'talktalk', 'orange', 'telefonica', 'deutsche telekom',
  'telecom', 'telus', 'rogers', 'bell canada', 'shaw',
  'broadband', 'cellular', 'wireless', 'mobile', 'isp', 'internet services',
  // hosting / cloud / VPN - usually bots, scrapers or proxied traffic
  'amazon', 'aws', 'google cloud', 'microsoft azure', 'digitalocean', 'linode',
  'hetzner', 'ovh', 'cloudflare', 'akamai', 'fastly', 'oracle cloud', 'vultr',
  'nordvpn', 'expressvpn', 'private internet', 'm247', 'datacamp',
]

function looksLikeCompany(org: string, type?: string): boolean {
  if (!org) return false
  const o = org.toLowerCase()
  if (type && type.toLowerCase() === 'hosting') return false
  return !CONSUMER_NETWORK_HINTS.some(hint => o.includes(hint))
}

interface IpWhoIs {
  success?: boolean
  ip?: string
  city?: string
  region?: string
  country?: string
  country_code?: string
  connection?: { asn?: number; org?: string; isp?: string; domain?: string }
  type?: string
}

export async function enrichWithCompany(posthog: PostHog): Promise<void> {
  if (typeof window === 'undefined') return
  try {
    if (sessionStorage.getItem(SESSION_FLAG)) return
  } catch { /* private mode - just run the lookup */ }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(LOOKUP_URL, { signal: controller.signal })
    if (!res.ok) return
    const data = (await res.json()) as IpWhoIs
    if (data.success === false) return

    const org = data.connection?.org || data.connection?.isp || ''
    const isCompany = looksLikeCompany(org, data.type)

    const props = {
      company_name: org || 'Unknown',
      company_domain: data.connection?.domain || null,
      company_isp: data.connection?.isp || null,
      company_asn: data.connection?.asn ?? null,
      // The one to filter on in PostHog - screens out home/mobile/cloud traffic
      is_likely_company: isCompany,
      visitor_city: data.city || null,
      visitor_region: data.region || null,
      visitor_country: data.country || null,
      visitor_country_code: data.country_code || null,
    }

    // Super properties: every subsequent event in this session carries these,
    // so any event can be broken down by company.
    posthog.register(props)

    // Person properties: makes the company show up on the person record itself.
    // `$set_once` on first_seen keeps the original visit date from being
    // overwritten on every return visit.
    posthog.setPersonProperties(props, {
      first_seen_at: new Date().toISOString(),
    })

    // An explicit event gives a clean, timestamped "this company viewed the
    // portfolio" row to build an insight on, rather than inferring from pageviews.
    posthog.capture('portfolio_visit_identified', {
      ...props,
      viewed_at: new Date().toISOString(),
      entry_path: window.location.pathname,
      referrer: document.referrer || null,
    })

    try { sessionStorage.setItem(SESSION_FLAG, '1') } catch { /* ignore */ }
  } catch {
    // Offline, blocked by an ad blocker, rate limited, timed out - all fine.
    // Enrichment is strictly best-effort.
  } finally {
    clearTimeout(timer)
  }
}
