const DEFAULT_CC = process.env.DEFAULT_COUNTRY_CODE || '237'

/**
 * Normalizes a phone number to E.164 (without the leading +, since whatsapp-web.js
 * expects the form `<countrycode><number>@c.us`).
 *
 *   "678 06 11 26"   -> "237678061126"
 *   "+237 678061126" -> "237678061126"
 *   "00237678061126" -> "237678061126"
 *
 * Returns null if the result has fewer than 9 digits (invalid).
 */
export function normalizePhone (input, defaultCountryCode = DEFAULT_CC) {
  if (!input) return null
  let digits = String(input).replace(/\D/g, '')
  if (!digits) return null

  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.startsWith(defaultCountryCode)) {
    // already has country code
  } else if (digits.length <= 9) {
    digits = defaultCountryCode + digits
  }

  return digits.length >= 11 && digits.length <= 15 ? digits : null
}

export function toE164 (normalized) {
  return normalized ? `+${normalized}` : null
}

export function toWhatsAppId (normalized) {
  return normalized ? `${normalized}@c.us` : null
}
