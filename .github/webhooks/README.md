# Webhook Deployment

Automatisches Deployment via GitHub Webhook auf einem Alpine-Linux-Server.
Der Hook lauscht auf **Pushes auf `master`** und deployt nach jedem Push
den aktuellen Stand von `origin/master`.

## Inhalt

| Datei                  | Zweck                                                          |
|------------------------|----------------------------------------------------------------|
| `hooks.json.template`  | Konfiguration für [`webhook`](https://github.com/adnanh/webhook) -- prüft HMAC-SHA256-Signatur und `ref == "refs/heads/master"`, ruft dann `deploy.sh` auf |
| `deploy.sh`            | `git reset --hard origin/master`, Build (`npm ci && npm run build`) und (Re-)Start des pm2-Services |
| `ecosystem.config.js`  | pm2-Service-Definition: startet `.output/server/index.mjs` auf `127.0.0.1:3000` |
| `webhook.template`     | OpenRC-Init-Skript für den `webhook`-Daemon                    |
| `.gitignore`           | Hält die ausgefüllte `hooks.json` (Secret!) aus dem Repo       |

## Variablen

Vor dem Deployment in `hooks.json` und im OpenRC-Skript ersetzen:

| Variable                  | Bedeutung                                                |
|---------------------------|----------------------------------------------------------|
| `$PROJECT_ROOT`           | Absoluter Pfad zum Projekt-Checkout auf dem Server       |
| `$WEBHOOK_GITHUB_SECRET`  | Shared Secret, identisch zur Konfiguration in GitHub     |

## Setup auf Alpine

```sh
apk add webhook git nodejs npm
npm install -g pm2

# Repo auf den Server klonen (Beispielpfad)
git clone https://github.com/<owner>/<repo>.git /var/www/eventapp
cd /var/www/eventapp

# 1. Hook-Konfiguration erstellen und Variablen ersetzen
cp .github/webhooks/hooks.json.template .github/webhooks/hooks.json
vi .github/webhooks/hooks.json

# 2. OpenRC-Service einrichten
cp .github/webhooks/webhook.template /etc/init.d/webhook
vi /etc/init.d/webhook            # $PROJECT_ROOT ersetzen
chmod +x /etc/init.d/webhook

service webhook start
rc-update add webhook boot

# 3. pm2 nach Reboot automatisch starten
pm2 startup openrc
# -> der ausgegebene Befehl muss als root ausgeführt werden
```

Manuelles erstes Deployment (gleichzeitig Test, dass alles funktioniert):

```sh
sh .github/webhooks/deploy.sh
```

## Nginx (Reverse Proxy)

`webhook` lauscht auf Port 9000, der Nuxt-Server auf 3000.
Beispiel-Snippet für `/etc/nginx/http.d/default.conf`:

```nginx
server {
    listen 80;
    server_name <host>;

    # Nuxt-Frontend
    location / {
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host $host;
        proxy_pass         http://127.0.0.1:3000;
    }

    # GitHub-Webhook
    location /hooks/ {
        proxy_http_version 1.1;
        proxy_set_header   X-Forwarded-For $remote_addr;
        proxy_set_header   X-Real-IP  $remote_addr;
        proxy_set_header   Host $host;
        proxy_pass         http://127.0.0.1:9000/hooks/;
        proxy_redirect     off;
    }

    # GitHub-Payloads können groß werden -- verhindert 413-Fehler
    client_body_buffer_size 10M;
    client_max_body_size    10M;
}
```

## GitHub-Konfiguration

Repository → **Settings → Webhooks → Add webhook**:

| Feld              | Wert                                       |
|-------------------|--------------------------------------------|
| Payload URL       | `https://<host>/hooks/github`              |
| Content type      | `application/json`                         |
| Secret            | identisch zu `$WEBHOOK_GITHUB_SECRET`      |
| SSL verification  | enabled                                    |
| Events            | **Just the push event**                    |
| Active            | [x]                                        |

## Ablauf

1. Push auf `master` landet auf GitHub.
2. GitHub schickt einen signierten `push`-Payload an `/hooks/github`.
3. `webhook` validiert die HMAC-SHA256-Signatur und prüft `ref == "refs/heads/master"`. Pushes auf andere Branches werden ignoriert.
4. `deploy.sh` synchronisiert das Arbeitsverzeichnis mit `origin/master` (`git reset --hard`), baut das Projekt (`npm ci && npm run build`) und reloadet den pm2-Service.

`deploy.sh` lässt sich jederzeit auch ohne Webhook auf dem Server ausführen
-- für ein manuelles Deployment oder zum Debuggen.
