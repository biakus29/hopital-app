import 'dotenv/config'
import { createApp } from './app.js'
import { logger } from './utils/logger.js'
import { startWhatsApp, stopWhatsApp } from './services/whatsapp.js'
import { startSchedulerLoop } from './services/broadcast.js'
import { shutdownDb } from './db.js'

const PORT = parseInt(process.env.PORT || '4000', 10)

async function main () {
  const app = createApp()
  const server = app.listen(PORT, () => {
    logger.info(`HTTP server listening on http://localhost:${PORT}`)
  })

  // Start WhatsApp client in the background; the API stays usable while it boots
  startWhatsApp().catch(err => logger.error({ err }, 'WhatsApp failed to start'))

  // Periodic scheduler for scheduled broadcasts
  startSchedulerLoop()

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
