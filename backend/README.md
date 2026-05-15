# St. Therese Hospital — Backend

Backend Express.js pour le site de l'Hôpital Catholique St. Therese (Nomayos). Gère le **blog**, les **événements**, les **abonnés** et l'envoi de **notifications multi-canal** : **WhatsApp**, **Email** et **SMS**.

Tous les canaux peuvent fonctionner gratuitement :
- **WhatsApp** via [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) (scan QR une fois)
- **Email** via n'importe quel SMTP (Gmail App Password, Brevo 300/jour, etc.)
- **SMS** via Africa's Talking (sandbox + crédit gratuit, couvre le Cameroun) ou Textbelt (1/jour gratuit)

## Stack

- **Express 4** — serveur HTTP
- **Prisma + SQLite** — base de données (fichier unique, pas de serveur DB à gérer)
- **JWT + bcrypt** — auth admin
- **whatsapp-web.js** — client WhatsApp basé sur WhatsApp Web (gratuit, scan QR une fois)
- **Zod** — validation des payloads
- **Pino** — logs structurés

## Démarrage rapide

```bash
cd backend
cp .env.example .env       # configure JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npx prisma migrate dev --name init
npm run seed               # crée l'admin par défaut + sample data
npm run dev
```

Au premier démarrage, **un QR code apparaît dans le terminal**. Scanne-le depuis le téléphone WhatsApp de l'hôpital :

> WhatsApp → Settings → Linked devices → Link a device

La session est sauvegardée dans `.wwebjs_auth/` — tu ne refais ce scan qu'en cas de déconnexion.

Le backend tourne sur `http://localhost:4000`. Test rapide :

```bash
curl http://localhost:4000/api/status/health
```

## Variables d'environnement

| Variable | Valeur par défaut | Rôle |
|---|---|---|
| `PORT` | `4000` | Port HTTP |
| `DATABASE_URL` | `file:./data/hospital.db` | Fichier SQLite |
| `JWT_SECRET` | — *(à définir !)* | Clé de signature JWT |
| `JWT_EXPIRES_IN` | `7d` | Durée de vie du token admin |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | — | Identifiants seed (à changer) |
| `DEFAULT_COUNTRY_CODE` | `237` | Code pays utilisé pour normaliser les numéros (237 = Cameroun) |
| `BROADCAST_DELAY_MS` | `3500` | Délai entre deux envois WhatsApp (anti-ban) |
| `DISABLE_WHATSAPP` | `false` | Mettre à `true` pour dev local sans téléphone |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:4173` | Origines autorisées (frontend Vue) |

## Endpoints

### Public

| Méthode | URL | Description |
|---|---|---|
| `GET` | `/api/posts?page=1&limit=10&category=News` | Liste des articles publiés |
| `GET` | `/api/posts/:slug` | Détail d'un article |
| `GET` | `/api/events?scope=upcoming` | Événements à venir (`upcoming` / `past` / `all`) |
| `GET` | `/api/events/:slug` | Détail d'un événement |
| `POST` | `/api/events/:id/rsvp` | S'inscrire à un événement (`{phone, name}`) — déclenche un WhatsApp de confirmation |
| `POST` | `/api/subscribers/subscribe` | S'abonner (`{phone, name?, tags?}`) — déclenche un WhatsApp de bienvenue |
| `POST` | `/api/subscribers/unsubscribe` | Se désabonner (`{phone}`) |
| `GET` | `/api/status/health` | Healthcheck |

### Admin (header `Authorization: Bearer <token>`)

| Méthode | URL | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login admin (`{email, password}`) |
| `GET` | `/api/auth/me` | Infos admin connecté |
| `GET` | `/api/status/dashboard` | Stats d'accueil |
| `GET` | `/api/status/whatsapp` | État du client WhatsApp (ready, QR pending, …) |
| `GET` | `/api/posts/admin/all` | Tous les articles (brouillons inclus) |
| `POST/PUT/DELETE` | `/api/posts[/:id]` | CRUD articles |
| `POST/PUT/DELETE` | `/api/events[/:id]` | CRUD événements |
| `GET` | `/api/events/:id/rsvps` | Liste des RSVPs |
| `GET` | `/api/subscribers?status=ACTIVE&search=…` | Liste paginée |
| `GET` | `/api/subscribers/stats` | Stats abonnés |
| `GET/POST` | `/api/subscribers/tags` | Tags de segmentation |
| `GET` | `/api/broadcasts` | Liste des broadcasts |
| `POST` | `/api/broadcasts` | Créer + envoyer (ou planifier via `scheduledAt`) |
| `POST` | `/api/broadcasts/preview` | Estimer le nombre de destinataires |
| `POST` | `/api/broadcasts/:id/run` | Relancer un broadcast |
| `GET` | `/api/broadcasts/:id` | Détail + 100 dernières deliveries |

## Commandes WhatsApp côté utilisateur

Le service écoute les messages entrants au numéro de l'hôpital. Mots-clés reconnus :

| Commande | Effet |
|---|---|
| `START` / `SUBSCRIBE` | Souscrire à nouveau aux notifications |
| `STOP` / `UNSUBSCRIBE` / `ARRET` | Se désabonner |
| `INFO` / `HELP` / `AIDE` | Infos de contact + liste des commandes |
| `EVENTS` | Prochains événements |

Toutes les réponses sont en anglais — adapte le service [`src/services/whatsapp.js`](src/services/whatsapp.js) pour ajouter le français ou d'autres langues.

## Exemple : créer un broadcast multi-canal

```bash
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@st-therese-hospital.cm","password":"ChangeMe!2026"}' | jq -r .token)

# WhatsApp uniquement
curl -X POST http://localhost:4000/api/broadcasts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "WHATSAPP",
    "title": "Diabetes Screening Day",
    "message": "🏥 Reminder: Free screening tomorrow at 9am.",
    "filterStatus": "ACTIVE"
  }'

# Email avec sujet obligatoire
curl -X POST http://localhost:4000/api/broadcasts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "EMAIL",
    "subject": "St. Therese - Diabetes Screening Day reminder",
    "message": "Dear patient,\n\nFree diabetes screening tomorrow...",
    "filterStatus": "ACTIVE"
  }'

# MULTI : envoie sur chaque canal où l'abonné a opté
curl -X POST http://localhost:4000/api/broadcasts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "MULTI",
    "subject": "Diabetes Screening Day",
    "message": "Free screening tomorrow at 9am.",
    "filterTag": "events"
  }'
```

Le canal `MULTI` envoie sur tous les canaux où le subscriber a opté-in (par exemple WhatsApp **et** email). Chaque tentative est enregistrée séparément dans `BroadcastDelivery`.

Le broadcast est traité en arrière-plan par un worker en file d'attente, avec un délai de 3.5s entre chaque envoi (anti-ban WhatsApp). Le statut passe de `PENDING` → `SENDING` → `SENT` (ou `FAILED`).

## Opt-in par canal

À l'inscription d'un abonné, on peut spécifier les canaux souhaités :

```bash
curl -X POST http://localhost:4000/api/subscribers/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+237678061126",
    "email": "patient@example.com",
    "name": "Marie Atangana",
    "channels": ["WHATSAPP", "EMAIL"]
  }'
```

Les canaux disponibles : `WHATSAPP`, `SMS`, `EMAIL`. Si non spécifiés, par défaut WhatsApp si un téléphone est fourni, sinon Email.

## Avertissement WhatsApp

`whatsapp-web.js` n'est pas une API officielle. Pour minimiser le risque de bannissement :

- N'envoie qu'à des numéros qui ont **explicitement opté pour** recevoir tes messages.
- Respecte le délai entre envois (`BROADCAST_DELAY_MS`).
- Ne dépasse pas ~500 messages/jour au début, monte progressivement.
- Inclus toujours un moyen de se désabonner.

Pour passer en production lourde, migre vers l'**API officielle Meta WhatsApp Business** (gratuite jusqu'à 1000 conversations/mois). Le service `src/services/whatsapp.js` peut être remplacé sans toucher au reste.
