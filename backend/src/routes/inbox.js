import { Router } from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import { prisma } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'

export const inboxRouter = Router()

const dataDir = path.resolve(process.cwd(), 'data')
const files = {
  contact: path.join(dataDir, 'contact-messages.json'),
  appointments: path.join(dataDir, 'appointments.json'),
  satisfaction: path.join(dataDir, 'satisfaction.json')
}

async function readJsonSafe (filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch { return [] }
}

async function writeJson (filePath, data) {
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

inboxRouter.use(requireAdmin)

// Counters for the dashboard
inboxRouter.get('/summary', async (req, res, next) => {
  try {
    const [contacts, appointments, satisfaction, rsvps] = await Promise.all([
      readJsonSafe(files.contact),
      readJsonSafe(files.appointments),
      readJsonSafe(files.satisfaction),
      prisma.eventRsvp.findMany({ orderBy: { createdAt: 'desc' }, take: 1 })
    ])
    res.json({
      contacts: contacts.length,
      appointments: appointments.length,
      satisfaction: satisfaction.length,
      lastRsvpAt: rsvps[0]?.createdAt || null
    })
  } catch (err) { next(err) }
})

inboxRouter.get('/contacts', async (req, res, next) => {
  try {
    const items = await readJsonSafe(files.contact)
    res.json(items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')))
  } catch (err) { next(err) }
})

inboxRouter.get('/appointments', async (req, res, next) => {
  try {
    const items = await readJsonSafe(files.appointments)
    res.json(items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')))
  } catch (err) { next(err) }
})

inboxRouter.put('/appointments/:id/status', async (req, res, next) => {
  try {
    const items = await readJsonSafe(files.appointments)
    const idx = items.findIndex(x => x.id === req.params.id)
    if (idx < 0) return res.status(404).json({ error: 'Not found' })
    items[idx].status = req.body?.status || items[idx].status
    items[idx].updatedAt = new Date().toISOString()
    await writeJson(files.appointments, items)
    res.json(items[idx])
  } catch (err) { next(err) }
})

inboxRouter.get('/satisfaction', async (req, res, next) => {
  try {
    const items = await readJsonSafe(files.satisfaction)
    res.json(items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')))
  } catch (err) { next(err) }
})

inboxRouter.delete('/contacts/:id', async (req, res, next) => {
  try {
    const items = await readJsonSafe(files.contact)
    await writeJson(files.contact, items.filter(x => x.id !== req.params.id))
    res.status(204).end()
  } catch (err) { next(err) }
})

inboxRouter.delete('/appointments/:id', async (req, res, next) => {
  try {
    const items = await readJsonSafe(files.appointments)
    await writeJson(files.appointments, items.filter(x => x.id !== req.params.id))
    res.status(204).end()
  } catch (err) { next(err) }
})

inboxRouter.delete('/satisfaction/:id', async (req, res, next) => {
  try {
    const items = await readJsonSafe(files.satisfaction)
    await writeJson(files.satisfaction, items.filter(x => x.id !== req.params.id))
    res.status(204).end()
  } catch (err) { next(err) }
})

// All event RSVPs across events
inboxRouter.get('/rsvps', async (req, res, next) => {
  try {
    const rsvps = await prisma.eventRsvp.findMany({
      orderBy: { createdAt: 'desc' },
      include: { event: { select: { id: true, title: true, slug: true, startsAt: true } } },
      take: 200
    })
    res.json(rsvps)
  } catch (err) { next(err) }
})
