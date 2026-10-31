export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Byparr!': 0,
  API: 1,
  'The API is ready': 2,
  'The API is not ready': 3,

  // interfaces.ts
  'The FlareSolverr-compatible API that Prowlarr and other apps send requests to': 4,

  // actions/configureProxy.ts
  'Proxy Server': 5,
  "The proxy Byparr's browser connects through, as protocol://host:port. Leave empty to connect directly.": 6,
  'Must be http://, https:// or socks5:// followed by host:port': 7,
  Username: 8,
  Password: 9,
  'Leave empty if the proxy needs no authentication.': 10,
  'Configure Residential Proxy': 11,
  "Send Byparr's browser through an HTTP or SOCKS proxy, such as a residential proxy service. Saving restarts Byparr.": 12,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
