import { Router } from 'express'
import { prisma } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { postSchema, makeSlug } from '../utils/validators.js'

export const postsRouter = Router()

// Public: list published posts
postsRouter.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(50, parseInt(req.query.limit) || 10)
    const category = req.query.category

    const where = { published: true, ...(category ? { category } : {}) }

    const [items, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.post.count({ where })
    ])

    res.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (err) { next(err) }
})

// Admin CRUD
postsRouter.get('/admin/all', requireAdmin, async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(posts)
  } catch (err) { next(err) }
})

postsRouter.get('/:slug', async (req, res, next) => {
  try {
    const post = await prisma.post.findFirst({
      where: { slug: req.params.slug, published: true }
    })
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch (err) { next(err) }
})

postsRouter.post('/', requireAdmin, async (req, res, next) => {
  try {
    const data = postSchema.parse(req.body)
    const slug = await uniqueSlug(makeSlug(data.title))
    const post = await prisma.post.create({
      data: {
        ...data,
        slug,
        publishedAt: data.published ? new Date() : null
      }
    })
    res.status(201).json(post)
  } catch (err) { next(err) }
})

postsRouter.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const data = postSchema.parse(req.body)
    const existing = await prisma.post.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Post not found' })

    let slug = existing.slug
    if (data.title !== existing.title) slug = await uniqueSlug(makeSlug(data.title), id)

    let publishedAt = existing.publishedAt
    if (data.published && !existing.published) publishedAt = new Date()
    if (data.published === false) publishedAt = null

    const post = await prisma.post.update({
      where: { id },
      data: { ...data, slug, publishedAt }
    })
    res.json(post)
  } catch (err) { next(err) }
})

postsRouter.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await prisma.post.delete({ where: { id: parseInt(req.params.id) } })
    res.status(204).end()
  } catch (err) { next(err) }
})

async function uniqueSlug (base, ignoreId) {
  let slug = base
  let i = 1
  while (true) {
    const found = await prisma.post.findUnique({ where: { slug } })
    if (!found || (ignoreId && found.id === ignoreId)) return slug
    slug = `${base}-${++i}`
  }
}
