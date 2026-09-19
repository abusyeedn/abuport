// Shared "share this page" fallback for routes that don't have a mobile-native
// layout yet (deep case studies still assume the desktop 1440px canvas) - a
// phone can't open a second window, so tapping copies the desktop URL instead
// of navigating into a broken layout.
export async function copyPathToClipboard(path: string) {
  const url = `${window.location.origin}${path}`
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    const el = document.createElement('textarea')
    el.value = url
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
}
