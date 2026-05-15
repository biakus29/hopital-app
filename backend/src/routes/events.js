import { Router } from 'express'
import { prisma } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { eventSchema, rsvpSchema, makeSlug } from '../utils/validators.js'
import { normalizePhone } from '../utils/phone.js'
import { sendText } from '../services/whatsapp.js'

export const eventsRouter = Router()

// Public: upcoming events
eventsRouter.get('/', async (req, res, next) => {
  try {
    const scope = req.query.scope || 'upcoming' // upcoming | past | all
    const where = scope === 'upcoming'
      ? { startsAt: { gte: new Date() }, status: { in: ['SCHEDULED', 'ONGOING'] } }
      : scope === 'past'
        ? { startsAt: { lt: new Date() } }
        : {}

    const events = await prisma.event.findMany({
      where,
      orderBy: { startsAt: scope === 'past' ? 'desc' : 'asc' },
      take: 50
    })
    res.json(events)
  } catch (err) { next(err) }
})

eventsRouter.get('/:slug', async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({ where: { slug: req.params.slug } })
    if (!event) return res.status(404).json({ error: 'Event not found' })
    res.json(event)
  } catch (err) { next(err) }
})

// Public: RSVP for an event (the visitor leaves a phone number)
eventsRouter.post('/:id/rsvp', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const { phone, name } = rsvpSchema.parse(req.body)
    const event = await prisma.event.findUnique({ where: { id } })
    if (!event || !event.rsvpEnabled) {
      return res.status(404).json({ error: 'Event not found or RSVP closed' })
    }
    const normalized = normalizePhone(phone)
    if (!normalized) return res.status(400).json({ error: 'Invalid phone number' })

    await prisma.eventRsvp.upsert({
      where: { eventId_phone: { eventId: id, phone: normalized } },
      update: { name: name || undefined },
      create: { eventId: id, phone: normalized, name }
    })
    const count = await prisma.eventRsvp.count({ where: { eventId: id } })
    await prisma.event.update({ where: { id }, data: { rsvpCount: count } })

    // Auto-subscribe the RSVP phone so they receive event reminders
    await prisma.subscriber.upsert({
      where: { phone: normalized },
      update: { status: 'ACTIVE' },
      create: { phone: normalized, name, status: 'ACTIVE', source: `event-rsvp:${event.slug}` }
    })

    // Fire-and-forget confirmation message
    const date = new Date(event.startsAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    sendText(normalized,
      `✅ Your RSVP is confirmed for *${event.title}*\n📅 ${date}${event.location ? `\n📍 ${event.location}` : ''}\n\n` +
      `We will send a reminder before the event. Reply STOP at any time to unsubscribe.`
    ).catch(() => {})

    res.status(201).json({ ok: true, rsvpCount: count })
  } catch (err) { next(err) }
})

// Admin CRUD
eventsRouter.post('/', requireAdmin, async (req, res, next) => {
  try {
    const data = eventSchema.parse(req.body)
    const slug = await uniqueSlug(makeSlug(data.title))
    const event = await prisma.event.create({ data: { ...data, slug } })
    res.status(201).json(event)
  } catch (err) { next(err) }
})

eventsRouter.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const data = eventSchema.parse(req.body)
    const existing = await prisma.event.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Event not found' })

    let slug = existing.slug
    if (data.title !== existing.title) slug = await uniqueSlug(makeSlug(data.title), id)

    const event = await prisma.event.update({ where: { id }, data: { ...data, slug } })
    res.json(event)
  } catch (err) { next(err) }
})

eventsRouter.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await prisma.event.delete({ where: { id: parseInt(req.params.id) } })
    res.status(204).end()
  } catch (err) { next(err) }
})

eventsRouter.get('/:id/rsvps', requireAdmin, async (req, res, next) => {
  try {
    const rsvps = await prisma.eventRsvp.findMany({
      where: { eventId: parseInt(req.params.id) },
      orderBy: { createdAt: 'desc' }
    })
    res.json(rsvps)
  } catch (err) { next(err) }
})

async function uniqueSlug (base, ignoreId) {
  let slug = base
  let i = 1
  while (true) {
    const found = await prisma.event.findUnique({ where: { slug } })
    if (!found || (ignoreId && found.id === ignoreId)) return slug
    slug = `${base}-${++i}`
  }
}
