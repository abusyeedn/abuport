import posthog from 'posthog-js'

const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined
const host = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || 'https://us.i.posthog.com'

if (key && typeof window !== 'undefined') {
  posthog.init(key, {
    api_host: host,
    defaults: '2026-05-30',
    person_profiles: 'always',
    // SPA routing means the browser never does a full page load between routes,
    // so autocapture's pageview only fires once. We capture $pageview manually
    // on route change in main.tsx instead.
    capture_pageview: false,
  })
} else if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn('[posthog] VITE_POSTHOG_KEY is not set — analytics disabled.')
}

export default posthog
