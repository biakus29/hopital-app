// Load .env via an absolute path computed from this file's location, so it
// works regardless of the process cwd (Passenger sometimes spawns Node from
// the venv lib directory instead of the app root).
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

import { createApp } from './app.js'
import { logger } from './utils/logger.js'
import { startWhatsApp, stopWhatsApp } from './services/whatsapp.js'
import { startSchedulerLoop } from './services/broadcast.js'
import { shutdownDb } from './db.js'

// Fail fast on missing required configuration. Passenger logs this clearly.
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  // eslint-disable-next-line no-console
  console.error('FATAL: JWT_SECRET is missing or too short. Set it in .env (>= 16 chars).')
  process.exit(1)
}

const PORT = parseInt(process.env.PORT || '21000', 10)

async function main () {
  const app = createApp()
  const server = app.listen(PORT, () => {
    logger.info(`HTTP server listening on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || 'development'})`)
  })

  // On EADDRINUSE (port collision with another local service like nginx on N0C),
  // pick a free random port instead of crashing. Passenger introspects the
  // actually-bound port via the listening callback.
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.warn(`Port ${PORT} busy — retrying on a random free port`)
      app.listen(0, () => {
        logger.info(`HTTP server listening on fallback port ${server.address().port}`)
      })
    } else {
      throw err
    }
  })

  // Start WhatsApp client in the background; the API stays usable while it boots.
  // On shared hosting (no Chromium libs), set DISABLE_WHATSAPP=true to skip.
  startWhatsApp().catch(err => logger.error({ err }, 'WhatsApp failed to start (continuing without it)'))

  // Periodic scheduler for scheduled broadcasts
  startSchedulerLoop()

  // Don't let an unhandled rejection kill the process — log and continue.
  process.on('unhandledRejection', (reason) => {
    logger.error({ reason }, 'Unhandled rejection')
  })

  const shutdown = async signal => {
    logger.info({ signal }, 'Shutting down')
    server.close()
    await Promise.allSettled([stopWhatsApp(), shutdownDb()])
    process.exit(0)
  }
  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

main().catch(err => {
  logger.error({ err }, 'Fatal startup error')
  process.exit(1)
})
