import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'

import { authRouter } from './routes/auth.js'
import { postsRouter } from './routes/posts.js'
import { eventsRouter } from './routes/events.js'
import { subscribersRouter } from './routes/subscribers.js'
import { broadcastsRouter } from './routes/broadcasts.js'
import { statusRouter } from './routes/status.js'
import { formsRouter } from './routes/forms.js'
import { uploadsRouter } from './routes/uploads.js'
import { inboxRouter } from './routes/inbox.js'
import { errorHandler, notFound } from './middleware/error.js'

export function createApp () {
  const app = express()

  // Behind Passenger/Nginx the real client IP is in X-Forwarded-For.
  // Trust the first proxy hop so express-rate-limit and req.ip work correctly.
  app.set('trust proxy', 1)

  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }   // allow images to load on the frontend domain
  }))
  app.use(cors({
    origin: (process.env.CORS_ORIGINS || '*').split(',').map(s => s.trim()),
    credentials: true
  }))
  app.use(express.json({ limit: '6mb' }))

  // Serve uploaded media (admin image uploads). Cached aggressively for 7 days.
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads'), {
    maxAge: '7d',
    immutable: false,
    fallthrough: true
  }))

  app.use('/api', rateLimit({
    windowMs: 60_000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  }))

  app.use('/api/auth',        authRouter)
  app.use('/api/posts',       postsRouter)
  app.use('/api/events',      eventsRouter)
  app.use('/api/subscribers', subscribersRouter)
  app.use('/api/broadcasts',  broadcastsRouter)
  app.use('/api/status',      statusRouter)
  app.use('/api/uploads',     uploadsRouter)
  app.use('/api/inbox',       inboxRouter)
  app.use('/api',             formsRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
