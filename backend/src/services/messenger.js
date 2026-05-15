import { sendText as sendWhatsApp, sendMedia as sendWhatsAppMedia, whatsAppStatus } from './whatsapp.js'
import { sendEmail, emailStatus } from './email.js'
import { sendSms, smsStatus } from './sms.js'

export const CHANNELS = Object.freeze({
  WHATSAPP: 'WHATSAPP',
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  MULTI: 'MULTI'
})

/**
 * High-level dispatcher. Sends a payload through one (or all) channels for a
 * given subscriber, honoring the subscriber's per-channel opt-in flags.
 *
 * @returns Array of { channel, ok, error?, messageId? } — one entry per channel
 *   actually attempted. Empty array means the subscriber had nothing to receive.
 */
export async function dispatch ({ subscriber, channel, subject, message, mediaUrl }) {
  const attempts = []
  const channels = channel === CHANNELS.MULTI
    ? [CHANNELS.WHATSAPP, CHANNELS.EMAIL, CHANNELS.SMS]
    : [channel]

  for (const ch of channels) {
    if (!canDeliver(subscriber, ch)) continue
    const result = await deliver(ch, subscriber, { subject, message, mediaUrl })
    attempts.push({ channel: ch, ...result })
  }
  return attempts
}

function canDeliver (subscriber, channel) {
  if (channel === CHANNELS.WHATSAPP) return Boolean(subscriber.phone && subscriber.optInWhatsapp)
  if (channel === CHANNELS.SMS)      return Boolean(subscriber.phone && subscriber.optInSms)
  if (channel === CHANNELS.EMAIL)    return Boolean(subscriber.email && subscriber.optInEmail)
  return false
}

async function deliver (channel, subscriber, { subject, message, mediaUrl }) {
  if (channel === CHANNELS.WHATSAPP) {
    return mediaUrl
      ? sendWhatsAppMedia(subscriber.phone, mediaUrl, message)
      : sendWhatsApp(subscriber.phone, message)
  }
  if (channel === CHANNELS.SMS) {
    return sendSms(subscriber.phone, message)
  }
  if (channel === CHANNELS.EMAIL) {
    return sendEmail({
      to: subscriber.email,
      subject: subject || 'Update from St. Therese Hospital',
      text: message
    })
  }
  return { ok: false, error: `Unknown channel ${channel}` }
}

export function messengerStatus () {
  return {
    whatsapp: whatsAppStatus(),
    email: emailStatus(),
    sms: smsStatus()
  }
}
