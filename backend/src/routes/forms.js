import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { normalizePhone, toE164 } from '../utils/phone.js'

export const formsRouter = Router()

const dataDir = path.resolve(process.cwd(), 'data')
const files = {
  contact: path.join(dataDir, 'contact-messages.json'),
  appointments: path.join(dataDir, 'appointments.json'),
  satisfaction: path.join(dataDir, 'satisfaction.json')
}

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { success: false, error: 'Too many requests, please try again later.' }
})

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(5).max(5000)
})

const appointmentSchema = z.object({
  service: z.string().trim().min(2).max(120),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().min(6).max(30),
  date: z.string().trim().min(6).max(40),
  time: z.string().trim().min(2).max(40),
  notes: z.string().trim().max(2000).optional().default('')
})

const satisfactionSchema = z.object({
  phone: z.string().trim().min(6).max(30),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(4).max(2000),
  consentToPublish: z.boolean().optional().default(false)
})

async function ensureFile(filePath) {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(filePath)
  } catch {
    await fs.writeFile(filePath, '[]', 'utf8')
  }
}

async function appendRecord(filePath, record) {
  await ensureFile(filePath)
  const raw = await fs.readFile(filePath, 'utf8')
  const items = JSON.parse(raw)
  items.push(record)
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), 'utf8')
}

async function upsertRecordById(filePath, record) {
  await ensureFile(filePath)
  const raw = await fs.readFile(filePath, 'utf8')
  const items = JSON.parse(raw)
  const idx = items.findIndex(item => item.id === record.id)
  if (idx >= 0) items[idx] = record
  else items.push(record)
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), 'utf8')
}

async function readRecords(filePath) {
  await ensureFile(filePath)
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

formsRouter.post('/contact', submitLimiter, async (req, res, next) => {
  try {
    const payload = contactSchema.parse(req.body)
    const record = {
      id: randomUUID(),
      ...payload,
      createdAt: new Date().toISOString()
    }
    await appendRecord(files.contact, record)
    res.status(201).json({ success: true, id: record.id })
  } catch (err) { next(err) }
})

formsRouter.post('/appointments', submitLimiter, async (req, res, next) => {
  try {
    const payload = appointmentSchema.parse(req.body)
    const normalizedPhone = normalizePhone(payload.phone)
    if (!normalizedPhone) {
      return res.status(400).json({ success: false, error: 'Invalid phone number.' })
    }
    const { phone, ...rest } = payload
    const record = {
      id: normalizedPhone,
      phone: toE164(normalizedPhone),
      ...rest,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    }
    await upsertRecordById(files.appointments, record)
    res.status(201).json({ success: true, id: record.id })
  } catch (err) { next(err) }
})

formsRouter.post('/satisfaction', submitLimiter, async (req, res, next) => {
  try {
    const payload = satisfactionSchema.parse(req.body)
    const normalizedPhone = normalizePhone(payload.phone)
    if (!normalizedPhone) {
      return res.status(400).json({ success: false, error: 'Invalid phone number.' })
    }
    const { phone, ...rest } = payload
    const record = {
      id: normalizedPhone,
      phone: toE164(normalizedPhone),
      ...rest,
      createdAt: new Date().toISOString()
    }
    await upsertRecordById(files.satisfaction, record)
    res.status(201).json({ success: true, id: record.id })
  } catch (err) { next(err) }
})

formsRouter.get('/satisfaction', async (req, res, next) => {
  try {
    const rows = await readRecords(files.satisfaction)
    const visible = rows
      .filter(r => r.consentToPublish === true)
      .map(r => ({
        id: r.id,
        name: r.name,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    res.json({ items: visible })
  } catch (err) { next(err) }
})
