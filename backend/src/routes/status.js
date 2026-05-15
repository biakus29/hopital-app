import { Router } from 'express'
import { messengerStatus } from '../services/messenger.js'
import { whatsAppStatus } from '../services/whatsapp.js'
import { requireAdmin } from '../middleware/auth.js'
import { prisma } from '../db.js'

export const statusRouter = Router()

statusRouter.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime(), env: process.env.NODE_ENV })
})

statusRouter.get('/channels', requireAdmin, (req, res) => {
  res.json(messengerStatus())
})

statusRouter.get('/whatsapp', requireAdmin, (req, res) => {
  res.json(whatsAppStatus())
})

statusRouter.get('/dashboard', requireAdmin, async (req, res, next) => {
  try {
    const [subs, posts, events, broadcasts] = await Promise.all([
      prisma.subscriber.count({ where: { status: 'ACTIVE' } }),
      prisma.post.count({ where: { published: true } }),
      prisma.event.count({ where: { status: 'SCHEDULED', startsAt: { gte: new Date() } } }),
      prisma.broadcast.count({ where: { status: { in: ['SENT', 'SENDING'] } } })
    ])
    const recentBroadcasts = await prisma.broadcast.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, status: true, sentCount: true, failedCount: true, totalCount: true, createdAt: true }
    })
    res.json({
      stats: { activeSubscribers: subs, publishedPosts: posts, upcomingEvents: events, broadcastsSent: broadcasts },
      recentBroadcasts,
      channels: messengerStatus()
    })
  } catch (err) { next(err) }
})
