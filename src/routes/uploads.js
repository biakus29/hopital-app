import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { promises as fs } from 'fs'
import { randomUUID } from 'crypto'
import { requireAdmin } from '../middleware/auth.js'
import { HttpError } from '../middleware/error.js'

export const uploadsRouter = Router()

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads')

// Ensure dir exists at module load
await fs.mkdir(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true })
      cb(null, UPLOAD_DIR)
    } catch (err) { cb(err) }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(0, 6) || '.bin'
    cb(null, `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new HttpError(415, `Unsupported image type: ${file.mimetype}`))
  }
})

uploadsRouter.post('/image', requireAdmin, upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) throw new HttpError(400, 'No file uploaded (field name must be "file")')
    const url = `/uploads/${req.file.filename}`
    res.status(201).json({
      ok: true,
      url,
      size: req.file.size,
      mimetype: req.file.mimetype,
      filename: req.file.filename
    })
  } catch (err) { next(err) }
})

// List uploaded files (for a future media library)
uploadsRouter.get('/', requireAdmin, async (req, res, next) => {
  try {
    const entries = await fs.readdir(UPLOAD_DIR).catch(() => [])
    const items = await Promise.all(entries.map(async (name) => {
      const stat = await fs.stat(path.join(UPLOAD_DIR, name)).catch(() => null)
      if (!stat || !stat.isFile()) return null
      return {
        filename: name,
        url: `/uploads/${name}`,
        size: stat.size,
        uploadedAt: stat.mtime
      }
    }))
    res.json(items.filter(Boolean).sort((a, b) => b.uploadedAt - a.uploadedAt))
  } catch (err) { next(err) }
})

uploadsRouter.delete('/:filename', requireAdmin, async (req, res, next) => {
  try {
    const safeName = path.basename(req.params.filename)
    await fs.unlink(path.join(UPLOAD_DIR, safeName)).catch(() => {})
    res.status(204).end()
  } catch (err) { next(err) }
})
