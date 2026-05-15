import { logger } from '../utils/logger.js'
import { toE164 } from '../utils/phone.js'

/**
 * SMS service with a pluggable provider.
 *
 * Default provider: Africa's Talking — covers Cameroon and most of Africa,
 * has a sandbox/free-credit tier, simple HTTP API (no SDK required).
 *
 * Configure via .env (one of):
 *
 *   SMS_PROVIDER=africastalking
 *   AT_USERNAME=sandbox
 *   AT_API_KEY=xxxxx
 *   AT_SENDER_ID=ST-THERESE
 *
 * or
 *
 *   SMS_PROVIDER=textbelt           # free tier: 1 sms/day with key "textbelt"
 *   TEXTBELT_KEY=textbelt
 *
 * Switch to a real provider in production by changing SMS_PROVIDER.
 */

const PROVIDER = (process.env.SMS_PROVIDER || 'africastalking').toLowerCase()

export function smsStatus () {
  return {
    enabled: process.env.DISABLE_SMS !== 'true',
    provider: PROVIDER,
    configured: isConfigured()
  }
}

function isConfigured () {
  if (PROVIDER === 'africastalking') {
    return Boolean(process.env.AT_USERNAME && process.env.AT_API_KEY)
  }
  if (PROVIDER === 'textbelt') {
    return true
  }
  return false
}

export async function sendSms (phone, body) {
  if (process.env.DISABLE_SMS === 'true') return { ok: false, error: 'SMS disabled' }
  if (!phone) return { ok: false, error: 'No recipient phone' }
  if (!body) return { ok: false, error: 'Empty body' }

  try {
    if (PROVIDER === 'africastalking') return await sendViaAfricasTalking(phone, body)
    if (PROVIDER === 'textbelt')        return await sendViaTextbelt(phone, body)
    return { ok: false, error: `Unknown SMS_PROVIDER: ${PROVIDER}` }
  } catch (err) {
    logger.error({ err, provider: PROVIDER }, 'SMS send failed')
    return { ok: false, error: err.message || 'SMS send failed' }
  }
}

async function sendViaAfricasTalking (phone, body) {
  const username = process.env.AT_USERNAME
  const apiKey = process.env.AT_API_KEY
  if (!username || !apiKey) return { ok: false, error: 'Africas Talking not configured' }

  const params = new URLSearchParams({
    username,
    to: toE164(phone),
    message: body,
    ...(process.env.AT_SENDER_ID ? { from: process.env.AT_SENDER_ID } : {})
  })

  const endpoint = username === 'sandbox'
    ? 'https://api.sandbox.africastalking.com/version1/messaging'
    : 'https://api.africastalking.com/version1/messaging'

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'apiKey': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: params.toString()
  })
  const json = await res.json().catch(() => ({}))
  const recipient = json?.SMSMessageData?.Recipients?.[0]
  if (recipient?.status === 'Success' || recipient?.statusCode === 101 || recipient?.statusCode === 102) {
    return { ok: true, messageId: recipient.messageId }
  }
  return { ok: false, error: recipient?.status || json?.SMSMessageData?.Message || `HTTP ${res.status}` }
}

async function sendViaTextbelt (phone, body) {
  const res = await fetch('https://textbelt.com/text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: toE164(phone),
      message: body,
      key: process.env.TEXTBELT_KEY || 'textbelt'
    })
  })
  const json = await res.json().catch(() => ({}))
  if (json.success) return { ok: true, messageId: json.textId }
  return { ok: false, error: json.error || `HTTP ${res.status}` }
}
