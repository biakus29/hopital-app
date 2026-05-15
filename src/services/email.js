import nodemailer from 'nodemailer'
import { logger } from '../utils/logger.js'

/**
 * Email service via Nodemailer.
 *
 * Supports any SMTP provider. Typical setups:
 *   - Gmail SMTP            (free, ~500/day, requires App Password)
 *   - Brevo / Sendinblue    (free 300/day)
 *   - Mailjet               (free 200/day)
 *   - Resend / Postmark     (transactional)
 *
 * Configure via .env:
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587
 *   SMTP_USER=your@gmail.com
 *   SMTP_PASS=app-password
 *   SMTP_FROM="St. Therese Hospital <no-reply@st-therese-hospital.cm>"
 */

let transporter = null

function getTransporter () {
  if (transporter) return transporter
  if (!process.env.SMTP_HOST) {
    logger.warn('SMTP not configured (SMTP_HOST missing) — email sends will fail.')
    return null
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined
  })
  return transporter
}

export function emailStatus () {
  return {
    enabled: process.env.DISABLE_EMAIL !== 'true' && Boolean(process.env.SMTP_HOST),
    host: process.env.SMTP_HOST || null,
    from: process.env.SMTP_FROM || null
  }
}

export async function sendEmail ({ to, subject, text, html }) {
  if (process.env.DISABLE_EMAIL === 'true') return { ok: false, error: 'Email disabled' }
  const t = getTransporter()
  if (!t) return { ok: false, error: 'SMTP not configured' }
  if (!to) return { ok: false, error: 'No recipient' }
  try {
    const info = await t.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@st-therese-hospital.cm',
      to,
      subject: subject || 'Update from St. Therese Hospital',
      text: text || stripHtml(html),
      html: html || textToHtml(text)
    })
    return { ok: true, messageId: info.messageId }
  } catch (err) {
    return { ok: false, error: err.message || 'sendMail failed' }
  }
}

function stripHtml (html) {
  return (html || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function textToHtml (text) {
  if (!text) return ''
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return `<div style="font-family:system-ui,sans-serif;line-height:1.6;color:#0f172a">
    ${escaped.split('\n').map(line => `<p style="margin:0 0 12px">${line || '&nbsp;'}</p>`).join('')}
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
    <p style="font-size:12px;color:#64748b">
      St. Therese Catholic Hospital — Nomayos, Cameroon<br>
      To unsubscribe, reply with "UNSUBSCRIBE" or contact us.
    </p>
  </div>`
}
