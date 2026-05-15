import { z } from 'zod'
import slugify from 'slugify'

export const phoneSchema = z.string().min(6).max(20)

export const subscribeSchema = z.object({
  phone: phoneSchema.optional(),
  email: z.string().email().optional(),
  name: z.string().min(1).max(120).optional(),
  tags: z.array(z.string()).optional(),
  source: z.string().max(60).optional(),
  channels: z.array(z.enum(['WHATSAPP', 'SMS', 'EMAIL'])).optional()
}).refine(d => d.phone || d.email, {
  message: 'Either phone or email is required',
  path: ['phone']
})

export const postSchema = z.object({
  title: z.string().min(3).max(200),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(1),
  category: z.string().max(60).optional().nullable(),
  coverImage: z.string().url().or(z.string().startsWith('/')).optional().nullable(),
  author: z.string().max(120).optional().nullable(),
  published: z.boolean().optional()
})

export const eventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(1),
  location: z.string().max(200).optional().nullable(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  status: z.enum(['SCHEDULED', 'ONGOING', 'ENDED', 'CANCELLED']).optional(),
  rsvpEnabled: z.boolean().optional()
})

export const broadcastSchema = z.object({
  title: z.string().max(120).optional().nullable(),
  channel: z.enum(['WHATSAPP', 'EMAIL', 'SMS', 'MULTI']).default('WHATSAPP'),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().min(1).max(4096),
  mediaUrl: z.string().url().optional().nullable(),
  filterTag: z.string().optional().nullable(),
  filterStatus: z.enum(['ACTIVE', 'UNSUBSCRIBED', 'ALL']).optional(),
  eventId: z.number().int().positive().optional().nullable(),
  scheduledAt: z.coerce.date().optional().nullable()
}).refine(d => d.channel !== 'EMAIL' || (d.subject && d.subject.length > 0), {
  message: 'subject is required when channel is EMAIL',
  path: ['subject']
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const rsvpSchema = z.object({
  phone: phoneSchema,
  name: z.string().min(1).max(120).optional()
})

export function makeSlug (text) {
  return slugify(text, { lower: true, strict: true, trim: true }).slice(0, 80)
}
