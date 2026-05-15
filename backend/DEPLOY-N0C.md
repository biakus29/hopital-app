# Déploiement N0C / Passenger

Guide pas-à-pas pour mettre le backend en ligne sur `api.hopitalsaintetheresenomayos.com`.

## 1. Pré-requis côté hébergeur

- Domaine `api.hopitalsaintetheresenomayos.com` créé et pointé vers ton compte N0C
- App Node.js créée dans le panneau N0C → **Node.js App** :

  | Champ | Valeur |
  |---|---|
  | **App root** | `/home/jwpmkcdy/apps/backendhopital/backend` |
  | **Startup file** | `app.js` |
  | **Node version** | `22` |
  | **Mode** | `production` |
  | **Domain** | `api.hopitalsaintetheresenomayos.com` |

> Ne PAS hardcoder le port — Passenger l'injecte via `process.env.PORT`, ce que `src/server.js` lit déjà.

## 2. Uploader le code

Via Git (recommandé) ou FTP :

```bash
# Sur le serveur, en SSH
cd /home/jwpmkcdy/apps/backendhopital/backend
git clone <ton-repo> .   # ou rsync depuis ta machine
```

Vérifie que ces fichiers sont bien là :
- `app.js` (entrypoint Passenger)
- `package.json`
- `.npmrc` (skip Chromium download)
- `prisma/schema.prisma`
- `prisma/seed.js`
- `src/`

## 3. Installer les dépendances

```bash
# Activer l'environnement Node 22 du compte
source /home/jwpmkcdy/nodevenv/<nom-app>/22/bin/activate

cd /home/jwpmkcdy/apps/backendhopital/backend

# Le .npmrc empêche puppeteer de télécharger Chromium (~150 Mo + libs absentes)
npm install --omit=dev --no-audit --no-fund
```

> ⚠️ Si `npm install` traîne ou échoue sur Puppeteer, vérifie que `.npmrc` est présent. Sans lui, `whatsapp-web.js` tentera de télécharger Chromium et cassera l'install.

## 4. Configurer `.env`

```bash
cp .env.production.example .env
nano .env
```

À remplir impérativement :
- `JWT_SECRET` → générer avec `openssl rand -hex 32`
- `ADMIN_EMAIL` et `ADMIN_PASSWORD`
- `SMTP_USER` / `SMTP_PASS` si tu veux envoyer des emails
- `CORS_ORIGINS` → URL du frontend de prod

Laisser tel quel :
- `DISABLE_WHATSAPP=true` (impossible sur mutualisé — voir section 7)
- `DATABASE_URL="file:./data/hospital.db"` (SQLite local)

## 5. Initialiser la base SQLite

```bash
mkdir -p prisma/data
npx prisma migrate deploy
npm run seed
```

Tu devrais voir :
```
✅ Admin ready: admin@hopitalsaintetheresenomayos.com
✅ 5 subscriber tags ready
✅ 2 sample posts ready
✅ 2 sample events ready
```

## 6. Démarrer (et redémarrer)

Dans le panneau N0C → **Restart App**, ou via SSH :

```bash
mkdir -p tmp
touch tmp/restart.txt
```

Passenger relance le process. Test :

```bash
curl https://api.hopitalsaintetheresenomayos.com/api/status/health
# → {"ok":true,"uptime":...,"env":"production"}
```

## 7. WhatsApp en production : non disponible sur N0C mutualisé

`whatsapp-web.js` utilise Puppeteer/Chromium qui nécessite des libs système (`libnss3`, `libx11`, `libxcomposite`…) absentes en mutualisé. C'est pour ça que `DISABLE_WHATSAPP=true` est forcé.

**Options pour activer WhatsApp plus tard** :

1. **Meta WhatsApp Cloud API** (officielle, gratuite jusqu'à 1000 conv/mois) — remplace `src/services/whatsapp.js` par un client HTTP. Pas de Chromium nécessaire, marche partout.
2. **VPS dédié** — déployer une 2e instance backend (juste le service WhatsApp) sur un VPS pas cher (~3€/mois) avec Chrome installé. Le service écoute un endpoint privé, le backend principal l'appelle pour envoyer.
3. **Container Docker** — si N0C propose un plan Cloud avec Docker, on package whatsapp-web.js + dépendances Chromium dans une image.

Le code [src/services/messenger.js](src/services/messenger.js) est déjà conçu pour fallback gracieusement : si WhatsApp est désactivé, l'email et le SMS continuent de marcher.

## 8. Routage frontend → backend

Dans le frontend de prod, le client API doit pointer vers le nouveau sous-domaine :

```env
# frontend/.env.production
VITE_API_URL=https://api.hopitalsaintetheresenomayos.com/api
```

Rebuild le frontend :
```bash
cd frontend
npm run build
# upload dist/ vers /home/jwpmkcdy/st_therese_node (ou ton dossier public_html)
```

## 9. Logs et debug

```bash
# Logs Passenger
tail -f /home/jwpmkcdy/logs/passenger.log

# Logs applicatifs (stdout du process)
tail -f /home/jwpmkcdy/logs/error.log
```

Si l'app crashe au démarrage, Passenger affiche l'erreur sur la page d'accueil du sous-domaine.

## 10. Restart rapide

```bash
cd /home/jwpmkcdy/apps/backendhopital/backend && mkdir -p tmp && touch tmp/restart.txt
```

ou bouton **Restart** dans N0C.
