import pkg from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import { logger } from '../utils/logger.js'
import { prisma } from '../db.js'
import { normalizePhone, toWhatsAppId } from '../utils/phone.js'

const { Client, LocalAuth, MessageMedia } = pkg

/**
 * WhatsApp service singleton.
 *
 * - Uses whatsapp-web.js (Puppeteer wrapping WhatsApp Web). Free, no payment.
 * - Persists session on disk so the QR scan is needed only once.
 * - Listens for incoming messages and handles user commands (STOP / START / INFO / EVENTS).
 * - Exposes `sendText(phone, body)` and `sendMedia(phone, url, caption)` for the broadcast worker.
 */

let client = null
let ready = false
let lastQr = null
const readyWaiters = []

function flushReady (ok, err) {
  while (readyWaiters.length) {
    const { resolve, reject } = readyWaiters.shift()
    if (ok) resolve(client)
    else reject(err)
  }
}

export function whatsAppStatus () {
  return {
    enabled: process.env.DISABLE_WHATSAPP !== 'true',
    ready,
    hasQr: Boolean(lastQr),
    qr: lastQr
  }
}

export async function whenReady (timeoutMs = 0) {
  if (ready) return client
  return new Promise((resolve, reject) => {
    readyWaiters.push({ resolve, reject })
    if (timeoutMs > 0) {
      setTimeout(() => reject(new Error('WhatsApp not ready (timeout)')), timeoutMs)
    }
  })
}

export async function startWhatsApp () {
  if (process.env.DISABLE_WHATSAPP === 'true') {
    logger.warn('WhatsApp disabled by env (DISABLE_WHATSAPP=true). All sends will be no-ops.')
    return null
  }
  if (client) return client

  client = new Client({
    authStrategy: new LocalAuth({ dataPath: process.env.WWEBJS_SESSION_PATH || '.wwebjs_auth' }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
  })

  client.on('qr', qr => {
    lastQr = qr
    logger.info('Scan this QR code in WhatsApp > Linked devices to connect the hospital number:')
    qrcode.generate(qr, { small: true })
  })

  client.on('authenticated', () => {
    logger.info('WhatsApp authenticated. Session saved.')
  })

  client.on('auth_failure', msg => {
    logger.error({ msg }, 'WhatsApp auth failed')
    flushReady(false, new Error(msg))
  })

  client.on('ready', () => {
    ready = true
    lastQr = null
    logger.info('WhatsApp client is ready. Number connected: %s', client.info?.wid?.user)
    flushReady(true)
  })

  client.on('disconnected', reason => {
    ready = false
    logger.warn({ reason }, 'WhatsApp disconnected')
  })

  client.on('message', handleIncoming)

  await client.initialize()
  return client
}

export async function stopWhatsApp () {
  if (!client) return
  try { await client.destroy() } catch (err) { logger.warn({ err }, 'Error destroying WhatsApp client') }
  client = null
  ready = false
}

/**
 * Send a text message.
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function sendText (phone, body) {
  if (!ready) return { ok: false, error: 'WhatsApp not ready' }
  const normalized = normalizePhone(phone)
  if (!normalized) return { ok: false, error: 'Invalid phone number' }
  try {
    const id = toWhatsAppId(normalized)
    const registered = await client.isRegisteredUser(id)
    if (!registered) return { ok: false, error: 'Number is not on WhatsApp' }
    await client.sendMessage(id, body)
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err.message || 'Send failed' }
  }
}

export async function sendMedia (phone, mediaUrl, caption) {
  if (!ready) return { ok: false, error: 'WhatsApp not ready' }
  const normalized = normalizePhone(phone)
  if (!normalized) return { ok: false, error: 'Invalid phone number' }
  try {
    const media = await MessageMedia.fromUrl(mediaUrl, { unsafeMime: true })
    await client.sendMessage(toWhatsAppId(normalized), media, { caption })
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err.message || 'Send media failed' }
  }
}

// ---- Incoming command handler --------------------------------------------

const COMMANDS = {
  STOP: handleStop,
  UNSUBSCRIBE: handleStop,
  ARRET: handleStop,
  START: handleStart,
  SUBSCRIBE: handleStart,
  INFO: handleInfo,
  HELP: handleInfo,
  EVENTS: handleEvents,
  AIDE: handleInfo
}

async function handleIncoming (msg) {
  try {
    if (msg.fromMe) return
    const from = msg.from
    if (!from?.endsWith('@c.us')) return // ignore groups
    const phone = from.replace('@c.us', '')
    const body = (msg.body || '').trim()
    const command = body.toUpperCase().split(/\s+/)[0]

    await prisma.subscriber.updateMany({
      where: { phone },
      data: { lastMessageAt: new Date() }
    })

    await prisma.incomingMessage.create({
      data: { fromPhone: phone, body, command: COMMANDS[command] ? command : null }
    })

    const handler = COMMANDS[command]
    if (handler) {
      await handler(phone, msg, body)
    }
  } catch (err) {
    logger.error({ err }, 'handleIncoming failed')
  }
}

async function handleStop (phone, msg) {
  const sub = await prisma.subscriber.findUnique({ where: { phone } })
  if (!sub) {
    return msg.reply('You are not subscribed to our updates.')
  }
  await prisma.subscriber.update({
    where: { phone },
    data: { status: 'UNSUBSCRIBED', unsubscribedAt: new Date() }
  })
  return msg.reply(
    'You have been unsubscribed from St. Therese Hospital updates. ' +
    'Reply START at any time to subscribe again.'
  )
}

async function handleStart (phone, msg) {
  const existing = await prisma.subscriber.findUnique({ where: { phone } })
  if (existing && existing.status === 'ACTIVE') {
    return msg.reply('You are already subscribed. Reply STOP to opt out, INFO for help.')
  }
  if (existing) {
    await prisma.subscriber.update({
      where: { phone },
      data: { status: 'ACTIVE', unsubscribedAt: null }
    })
  } else {
    await prisma.subscriber.create({
      data: { phone, status: 'ACTIVE', source: 'whatsapp-keyword' }
    })
  }
  return msg.reply(
    'Welcome to St. Therese Catholic Hospital! 🏥\n' +
    'You will now receive health tips, event announcements and important updates.\n\n' +
    'Reply STOP to unsubscribe at any time, EVENTS to see upcoming events.'
  )
}

async function handleInfo (phone, msg) {
  return msg.reply(
    '*St. Therese Catholic Hospital — Nomayos*\n' +
    '📞 (+237) 678 06 11 26 (24/7 emergency)\n' +
    '📍 Route de Mbankomo, St. Odile Catholic Parish\n' +
    '🕒 Mon–Fri 6:00–20:00 · Sat 8:00–16:00\n\n' +
    'Commands:\n' +
    '• EVENTS — see upcoming events\n' +
    '• STOP — unsubscribe from notifications\n' +
    '• START — subscribe again'
  )
}

async function handleEvents (phone, msg) {
  const events = await prisma.event.findMany({
    where: { startsAt: { gte: new Date() }, status: { in: ['SCHEDULED', 'ONGOING'] } },
    orderBy: { startsAt: 'asc' },
    take: 5
  })
  if (!events.length) {
    return msg.reply('No upcoming events at the moment. We will notify you when new ones are scheduled!')
  }
  const list = events.map(e => {
    const date = new Date(e.startsAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    return `📅 *${e.title}*\n   ${date}${e.location ? ` · ${e.location}` : ''}`
  }).join('\n\n')
  return msg.reply(`*Upcoming Events at St. Therese:*\n\n${list}\n\nReply STOP to unsubscribe.`)
}
