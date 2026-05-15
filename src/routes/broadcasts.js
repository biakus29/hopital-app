import { Router } from 'express'
import { prisma } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { broadcastSchema } from '../utils/validators.js'
import { enqueueBroadcast } from '../services/broadcast.js'

export const broadcastsRouter = Router()

broadcastsRouter.use(requireAdmin)

// List broadcasts
broadcastsRouter.get('/', async (req, res, next) => {
  try {
    const items = await prisma.broadcast.findMany({
      orderBy: { createdAt: 'desc' },
      include: { event: { select: { id: true, title: true, slug: true } } },
      take: 100
    })
    res.json(items)
  } catch (err) { next(err) }
})

broadcastsRouter.get('/:id', async (req, res, next) => {
  try {
    const broadcast = await prisma.broadcast.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        event: true,
        deliveries: {
          take: 100,
          orderBy: { id: 'desc' },
          include: { subscriber: { select: { id: true, phone: true, name: true } } }
        }
      }
    })
    if (!broadcast) return res.status(404).json({ error: 'Broadcast not found' })
    res.json(broadcast)
  } catch (err) { next(err) }
})

// Create and immediately enqueue a broadcast.
// Use `scheduledAt` in the body to delay; otherwise it sends right away.
broadcastsRouter.post('/', async (req, res, next) => {
  try {
    const data = broadcastSchema.parse(req.body)
    const broadcast = await prisma.broadcast.create({
      data: {
        title: data.title,
        channel: data.channel,
        subject: data.subject,
        message: data.message,
        mediaUrl: data.mediaUrl,
        filterTag: data.filterTag,
        filterStatus: data.filterStatus || 'ACTIVE',
        eventId: data.eventId,
        scheduledAt: data.scheduledAt,
        status: 'PENDING'
      }
    })

    if (!data.scheduledAt) enqueueBroadcast(broadcast.id)

    res.status(201).json(broadcast)
  } catch (err) { next(err) }
})

// Dry-run: estimate how many subscribers would be targeted
broadcastsRouter.post('/preview', async (req, res, next) => {
  try {
    const data = broadcastSchema.parse(req.body)
    const where = {}
    if (data.filterStatus !== 'ALL') where.status = data.filterStatus || 'ACTIVE'
    if (data.filterTag) where.tags = { some: { name: data.filterTag } }
    if (data.channel === 'WHATSAPP') { where.optInWhatsapp = true; where.phone = { not: null } }
    else if (data.channel === 'SMS') { where.optInSms = true;      where.phone = { not: null } }
    else if (data.channel === 'EMAIL') { where.optInEmail = true;  where.email = { not: null } }
    else if (data.channel === 'MULTI') {
      where.OR = [
        { AND: [{ optInWhatsapp: true }, { phone: { not: null } }] },
        { AND: [{ optInSms: true },      { phone: { not: null } }] },
        { AND: [{ optInEmail: true },    { email: { not: null } }] }
      ]
    }
    const count = await prisma.subscriber.count({ where })
    res.json({ recipientCount: count, channel: data.channel })
  } catch (err) { next(err) }
})

// Manually re-run a broadcast (re-enqueue if it failed or was cancelled)
broadcastsRouter.post('/:id/run', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const b = await prisma.broadcast.findUnique({ where: { id } })
    if (!b) return res.status(404).json({ error: 'Broadcast not found' })
    await prisma.broadcast.update({
      where: { id },
      data: { status: 'PENDING', startedAt: null, finishedAt: null, sentCount: 0, failedCount: 0 }
    })
    enqueueBroadcast(id)
    res.json({ ok: true })
  } catch (err) { next(err) }
})

broadcastsRouter.delete('/:id', async (req, res, next) => {
  try {
    await prisma.broadcast.delete({ where: { id: parseInt(req.params.id) } })
    res.status(204).end()
  } catch (err) { next(err) }
})
