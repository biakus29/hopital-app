/**
 * Centralized API client.
 *
 * Reads VITE_API_URL from .env if set, otherwise falls back to "/api"
 * (which works through the Vite dev proxy and same-origin production hosting).
 *
 * Usage:
 *   import { api } from '@/lib/api'
 *   const posts = await api.get('/posts', { limit: 10 })
 *   await api.post('/contact', { name, email, subject, message })
 */

const BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

function buildUrl(path, params) {
  const url = path.startsWith('http') ? path : `${BASE}${path.startsWith('/') ? '' : '/'}${path}`
  if (!params || !Object.keys(params).length) return url
  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue
    usp.set(k, String(v))
  }
  const qs = usp.toString()
  return qs ? `${url}?${qs}` : url
}

async function request(method, path, { params, body, token, signal } = {}) {
  const headers = { 'Accept': 'application/json' }
  let payload
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  let res
  try {
    res = await fetch(buildUrl(path, params), { method, headers, body: payload, signal })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiError(0, 'Cannot reach the backend. Is it running on port 4000?', null)
  }

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json().catch(() => null) : null

  if (!res.ok) {
    // Vite dev proxy returns 500/504 with a plain-text body when the upstream
    // backend is down. Treat that as a connectivity issue, not a server error.
    if (!isJson && (res.status === 500 || res.status === 502 || res.status === 503 || res.status === 504)) {
      throw new ApiError(0, 'Backend is offline. Run `cd backend && npm run dev` in a separate terminal.', null)
    }
    const message = data?.error || `Request failed (HTTP ${res.status})`
    throw new ApiError(res.status, message, data)
  }
  return data
}

export class ApiError extends Error {
  constructor(status, message, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export const api = {
  baseUrl: BASE,
  get:    (path, params, opts) => request('GET',    path, { ...opts, params }),
  post:   (path, body, opts)   => request('POST',   path, { ...opts, body }),
  put:    (path, body, opts)   => request('PUT',    path, { ...opts, body }),
  delete: (path, opts)         => request('DELETE', path, opts)
}
