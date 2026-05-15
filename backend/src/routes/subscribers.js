import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { prisma } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { subscribeSchema, phoneSchema } from '../utils/validators.js'
import { normalizePhone } from '../utils/phone.js'
import { dispatch, CHANNELS } from '../services/messenger.js'

export const subscribersRouter = Router()

const subscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many subscribe attempts, try again later' }
})

// Public: subscribe (phone and/or email + chosen channels)
subscribersRouter.post('/subscribe', subscribeLimiter, async (req, res, next) => {
  try {
    const { phone, email, name, tags, source, channels } = subscribeSchema.parse(req.body)
    const normalized = phone ? normalizePhone(phone) : null
    if (phone && !normalized) return res.status(400).json({ error: 'Invalid phone number' })

    // Channel opt-ins: default to whatsapp if a phone was given and channels not specified
    const wanted = new Set(channels && channels.length ? channels : (normalized ? ['WHATSAPP'] : ['EMAIL']))
    const optInWhatsapp = wanted.has('WHATSAPP') && Boolean(normalized)
    const optInSms      = wanted.has('SMS')      && Boolean(normalized)
    const optInEmail    = wanted.has('EMAIL')    && Boolean(email)

    if (!optInWhatsapp && !optInSms && !optInEmail) {
      return res.status(400).json({ error: 'Provide a phone (for WhatsApp/SMS) or email, and pick at least one channel.' })
    }

    const tagIds = []
    if (tags?.length) {
      for (const t of tags) {
        const row = await prisma.subscriberTag.upsert({ where: { name: t }, update: {}, create: { name: t } })
        tagIds.push({ id: row.id })
      }
    }

    const lookup = normalized
      ? { phone: normalized }
      : { email }

    const existing = await prisma.subscriber.findUnique({ where: lookup })

    const subscriber = await prisma.subscriber.upsert({
      where: lookup,
      update: {
        phone: normalized ?? existing?.phone,
        email: email ?? existing?.email,
        name: name ?? undefined,
        status: 'ACTIVE',
        unsubscribedAt: null,
        source: source ?? existing?.source ?? undefined,
        optInWhatsapp: optInWhatsapp || existing?.optInWhatsapp || false,
        optInSms:      optInSms      || existing?.optInSms      || false,
        optInEmail:    optInEmail    || existing?.optInEmail    || false,
        ...(tagIds.length ? { tags: { connect: tagIds } } : {})
      },
      create: {
        phone: normalized,
        email,
        name,
        status: 'ACTIVE',
        source: source || 'website',
        optInWhatsapp, optInSms, optInEmail,
        ...(tagIds.length ? { tags: { connect: tagIds } } : {})
      }
    })

    // Fire-and-forget welcome message on every opted-in channel
    const welcome =
      `🏥 Welcome to St. Therese Catholic Hospital\n\n` +
      `Thank you${name ? ` ${name}` : ''} for subscribing. You will receive health tips, event invitations and important announcements from our hospital.\n\n` +
      `Reply STOP (WhatsApp/SMS) or contact us by email to unsubscribe at any time.`
    dispatch({
      subscriber,
      channel: CHANNELS.MULTI,
      subject: 'Welcome to St. Therese Hospital',
      message: welcome
    }).catch(() => {})

    res.status(201).json({
      ok: true,
      subscriber: {
        id: subscriber.id, phone: subscriber.phone, email: subscriber.email,
        status: subscriber.status,
        channels: {
          whatsapp: subscriber.optInWhatsapp,
          sms: subscriber.optInSms,
          email: subscriber.optInEmail
        }
      }
    })
  } catch (err) { next(err) }
})

// Public: unsubscribe by phone
subscribersRouter.post('/unsubscribe', async (req, res, next) => {
  try {
    const phone = phoneSchema.parse(req.body.phone)
    const normalized = normalizePhone(phone)
    if (!normalized) return res.status(400).json({ error: 'Invalid phone number' })

    const updated = await prisma.subscriber.updateMany({
      where: { phone: normalized },
      data: { status: 'UNSUBSCRIBED', unsubscribedAt: new Date() }
    })
    res.json({ ok: true, affected: updated.count })
  } catch (err) { next(err) }
})

// Admin: list / search subscribers
subscribersRouter.get('/', requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(200, parseInt(req.query.limit) || 50)
    const status = req.query.status
    const search = req.query.search

    const where = {
      ...(status ? { status } : {}),
      ...(search
        ? { OR: [
            { phone: { contains: search } },
            { name: { contains: search } }
          ] }
        : {})
    }

    const [items, total] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        include: { tags: true },
        orderBy: { joinedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.subscriber.count({ where })
    ])

    res.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (err) { next(err) }
})

subscribersRouter.get('/stats', requireAdmin, async (req, res, next) => {
  try {
    const [total, active, unsub] = await Promise.all([
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: { status: 'ACTIVE' } }),
      prisma.subscriber.count({ where: { status: 'UNSUBSCRIBED' } })
    ])
    res.json({ total, active, unsubscribed: unsub })
  } catch (err) { next(err) }
})

subscribersRouter.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await prisma.subscriber.delete({ where: { id: parseInt(req.params.id) } })
    res.status(204).end()
  } catch (err) { next(err) }
})

// Tag management
subscribersRouter.get('/tags', requireAdmin, async (req, res, next) => {
  try {
    const tags = await prisma.subscriberTag.findMany({
      include: { _count: { select: { subscribers: true } } },
      orderBy: { name: 'asc' }
    })
    res.json(tags)
  } catch (err) { next(err) }
})

subscribersRouter.post('/tags', requireAdmin, async (req, res, next) => {
  try {
    const { name, description } = req.body
    const tag = await prisma.subscriberTag.create({ data: { name, description } })
    res.status(201).json(tag)
  } catch (err) { next(err) }
})
