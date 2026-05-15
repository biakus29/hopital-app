import { prisma } from '../db.js'
import { logger } from '../utils/logger.js'
import { dispatch, CHANNELS } from './messenger.js'
import { whenReady as whenWhatsAppReady, whatsAppStatus } from './whatsapp.js'

const DELAY = parseInt(process.env.BROADCAST_DELAY_MS || '3500', 10)

const queue = []
let processing = false

/**
 * Enqueue a broadcast for asynchronous delivery.
 * The worker fetches subscribers matching the broadcast's filters, then
 * delivers via the broadcast's channel (or every opted-in channel for MULTI),
 * throttled by BROADCAST_DELAY_MS.
 */
export function enqueueBroadcast (broadcastId) {
  queue.push(broadcastId)
  setImmediate(processNext)
}

async function processNext () {
  if (processing) return
  const id = queue.shift()
  if (!id) return
  processing = true
  try {
    await runBroadcast(id)
  } catch (err) {
    logger.error({ err, broadcastId: id }, 'Broadcast run failed')
  } finally {
    processing = false
    if (queue.length) setImmediate(processNext)
  }
}

async function runBroadcast (id) {
  const broadcast = await prisma.broadcast.findUnique({ where: { id } })
  if (!broadcast) {
    logger.warn({ id }, 'Broadcast not found, skipping')
    return
  }
  if (broadcast.status === 'SENT' || broadcast.status === 'SENDING') {
    logger.warn({ id, status: broadcast.status }, 'Broadcast already processed, skipping')
    return
  }

  // For WhatsApp-bound broadcasts, wait for the client (best-effort, 60s budget).
  // Email/SMS are stateless HTTP calls so no wait needed.
  const needsWhatsApp = broadcast.channel === CHANNELS.WHATSAPP || broadcast.channel === CHANNELS.MULTI
  if (needsWhatsApp && !whatsAppStatus().ready && whatsAppStatus().enabled) {
    try { await whenWhatsAppReady(60_000) } catch {
      logger.warn({ id }, 'WhatsApp not ready — continuing; deliveries on that channel will fail')
    }
  }

  // Build subscriber filter, scoped by channel opt-in to avoid contacting people
  // who never opted into the chosen channel.
  const where = buildSubscriberFilter(broadcast)
  const subscribers = await prisma.subscriber.findMany({ where })

  await prisma.broadcast.update({
    where: { id },
    data: { status: 'SENDING', totalCount: subscribers.length, startedAt: new Date() }
  })

  logger.info({ id, channel: broadcast.channel, count: subscribers.length }, 'Broadcasting started')

  let sent = 0
  let failed = 0

  for (const sub of subscribers) {
    const attempts = await dispatch({
      subscriber: sub,
      channel: broadcast.channel,
      subject: broadcast.subject,
      message: broadcast.message,
      mediaUrl: broadcast.mediaUrl
    })

    if (!attempts.length) {
      // Subscriber matched the filter but had no usable channel/contact info.
      await recordDelivery(id, sub.id, broadcast.channel, false, 'No usable channel for subscriber')
      failed++
    } else {
      for (const a of attempts) {
        await recordDelivery(id, sub.id, a.channel, a.ok, a.ok ? null : a.error)
      }
      const anySuccess = attempts.some(a => a.ok)
      if (anySuccess) sent++; else failed++
    }

    if ((sent + failed) % 5 === 0) {
      await prisma.broadcast.update({
        where: { id },
        data: { sentCount: sent, failedCount: failed }
      }).catch(() => {})
    }

    await sleep(DELAY)
  }

  await prisma.broadcast.update({
    where: { id },
    data: {
      status: failed === subscribers.length && subscribers.length > 0 ? 'FAILED' : 'SENT',
      sentCount: sent,
      failedCount: failed,
      finishedAt: new Date()
    }
  })

  if (broadcast.eventId) {
    await prisma.event.update({
      where: { id: broadcast.eventId },
      data: { broadcastSent: true }
    }).catch(() => {})
  }

  logger.info({ id, sent, failed }, 'Broadcast finished')
}

function buildSubscriberFilter (broadcast) {
  const where = {}
  if (broadcast.filterStatus !== 'ALL') {
    where.status = broadcast.filterStatus || 'ACTIVE'
  }
  if (broadcast.filterTag) {
    where.tags = { some: { name: broadcast.filterTag } }
  }

  // Channel-aware filtering: only include subscribers who have the required
  // contact info AND have opted into at least one of the requested channels.
  if (broadcast.channel === CHANNELS.WHATSAPP) {
    where.optInWhatsapp = true
    where.phone = { not: null }
  } else if (broadcast.channel === CHANNELS.SMS) {
    where.optInSms = true
    where.phone = { not: null }
  } else if (broadcast.channel === CHANNELS.EMAIL) {
    where.optInEmail = true
    where.email = { not: null }
  } else if (broadcast.channel === CHANNELS.MULTI) {
    where.OR = [
      { AND: [{ optInWhatsapp: true }, { phone: { not: null } }] },
      { AND: [{ optInSms: true },      { phone: { not: null } }] },
      { AND: [{ optInEmail: true },    { email: { not: null } }] }
    ]
  }
  return where
}

async function recordDelivery (broadcastId, subscriberId, channel, ok, error) {
  await prisma.broadcastDelivery.upsert({
    where: { broadcastId_subscriberId_channel: { broadcastId, subscriberId, channel } },
    update: {
      status: ok ? 'SENT' : 'FAILED',
      error: ok ? null : error,
      sentAt: ok ? new Date() : null
    },
    create: {
      broadcastId, subscriberId, channel,
      status: ok ? 'SENT' : 'FAILED',
      error: ok ? null : error,
      sentAt: ok ? new Date() : null
    }
  }).catch(err => logger.warn({ err }, 'recordDelivery failed'))
}

function sleep (ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

export function startSchedulerLoop () {
  setInterval(async () => {
    try {
      const due = await prisma.broadcast.findMany({
        where: { status: 'PENDING', scheduledAt: { not: null, lte: new Date() } }
      })
      for (const b of due) enqueueBroadcast(b.id)
    } catch (err) {
      logger.error({ err }, 'Scheduler tick failed')
    }
  }, 30_000)
}
