import 'dotenv/config'

export const config = {
  DAV_URL: process.env.DAV_URL || 'http://localhost:8088',
  DAV_USERNAME: process.env.DAV_USERNAME || 'admin',
  DAV_PASSWORD: process.env.DAV_PASSWORD || 'admin',
}

// Sicherheitsnetz: Seeding/Bootstrap nur gegen eine lokale Instanz erlauben.
export function assertLocalEnv(): void {
  const url = config.DAV_URL
  const local = /(^https?:\/\/)?(localhost|127\.0\.0\.1|baikal)(:|\/|$)/.test(url)
  if (!local) {
    console.error(`[guard] DAV_URL="${url}" sieht nicht lokal aus — Abbruch.`)
    console.error('[guard] Seeding/Bootstrap ist nur gegen localhost/baikal erlaubt.')
    process.exit(1)
  }
}

export const davAuthHeader =
  'Basic ' + Buffer.from(`${config.DAV_USERNAME}:${config.DAV_PASSWORD}`).toString('base64')

export const calendarsBase = `${config.DAV_URL.replace(/\/+$/, '')}/dav.php/calendars/${config.DAV_USERNAME}`
