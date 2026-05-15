import { ZodError } from 'zod'
import { logger } from '../utils/logger.js'

export function notFound (req, res) {
  res.status(404).json({ error: 'Not found', path: req.originalUrl })
}

export function errorHandler (err, req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      issues: err.issues.map(i => ({ path: i.path.join('.'), message: i.message }))
    })
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Unique constraint violation', field: err.meta?.target })
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' })
  }

  const status = err.status || err.statusCode || 500
  if (status >= 500) logger.error({ err, path: req.path }, 'Unhandled error')
  res.status(status).json({ error: err.message || 'Internal server error' })
}

export class HttpError extends Error {
  constructor (status, message) {
    super(message)
    this.status = status
  }
}
