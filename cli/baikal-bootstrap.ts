import { execSync } from 'node:child_process'

import { assertLocalEnv, config } from './tools/config'

assertLocalEnv()

const baseUrl = config.DAV_URL.replace(/\/+$/, '')

// Baikal liefert vor der Schema-Initialisierung HTTP 500 — jede Antwort (200/401/500)
// beweist aber, dass der Container läuft und wir per docker exec rein können.
async function waitForBaikal(timeoutMs = 30_000): Promise<void> {
  const deadline = Date.now() + timeoutMs
  let lastErr: unknown = null
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${baseUrl}/`, { method: 'GET' })
      if (res.status > 0) return
    } catch (err) {
      lastErr = err
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`Baikal nicht erreichbar unter ${baseUrl} innerhalb ${timeoutMs}ms: ${String(lastErr)}`)
}

console.warn(`[baikal-bootstrap] warte auf Baikal unter ${baseUrl} ...`)
await waitForBaikal()
console.warn('[baikal-bootstrap] Baikal ist da; provisioniere DAV-User via docker compose exec')

try {
  // Frisch kopieren — ein Bind-Mount würde beim Container-Create snapshotten.
  execSync('docker compose cp infra/baikal/provision-dav-user.php baikal:/tmp/provision-dav-user.php', {
    stdio: 'inherit',
    shell: '/bin/sh',
  })
  // AS nginx ausführen — das ist der php-fpm-User in ckulka/baikal. Sonst gehört
  // die SQLite-Datei dem falschen User und Baikal no-opt PUTs still (200 OK + HTML).
  execSync(
    `docker compose exec -T --user nginx baikal php /tmp/provision-dav-user.php ${config.DAV_USERNAME} ${config.DAV_PASSWORD} admin@example.com Admin`,
    { stdio: 'inherit', shell: '/bin/sh' },
  )
} catch (err) {
  console.error('[baikal-bootstrap] docker compose exec fehlgeschlagen:', (err as Error).message)
  console.error('Prüfe `docker compose ps` — der baikal-Service muss laufen.')
  process.exit(1)
}

console.warn('[baikal-bootstrap] fertig')
process.exit(0)
