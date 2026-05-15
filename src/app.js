import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import { authRouter } from './routes/auth.js'
import { postsRouter } from './routes/posts.js'
import { eventsRouter } from './routes/events.js'
import { subscribersRouter } from './routes/subscribers.js'
import { broadcastsRouter } from './routes/broadcasts.js'
import { statusRouter } from './routes/status.js'
import { formsRouter } from './routes/forms.js'
import { errorHandler, notFound } from './middleware/error.js'

export function createApp () {
  const app = express()

  app.use(helmet())
  app.use(cors({
    origin: (process.env.CORS_ORIGINS || '*').split(',').map(s => s.trim()),
    credentials: true
  }))
  app.use(express.json({ limit: '2mb' }))

  app.use('/api', rateLimit({
    windowMs: 60_000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
  }))

  app.use('/api/auth', authRouter)
  app.use('/api/posts', postsRouter)
  app.use('/api/events', eventsRouter)
  app.use('/api/subscribers', subscribersRouter)
  app.use('/api/broadcasts', broadcastsRouter)
  app.use('/api/status', statusRouter)
  app.use('/api', formsRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
