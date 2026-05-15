import { Router } from 'express'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { prisma } from '../db.js'
import { signAdminToken, requireAdmin } from '../middleware/auth.js'
import { loginSchema } from '../utils/validators.js'
import { HttpError } from '../middleware/error.js'

export const authRouter = Router()

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) throw new HttpError(401, 'Invalid credentials')
    const ok = await bcrypt.compare(password, admin.password)
    if (!ok) throw new HttpError(401, 'Invalid credentials')

    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() }
    })

    const token = signAdminToken(admin)
    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        mustChangePassword: admin.mustChangePassword
      }
    })
  } catch (err) { next(err) }
})

authRouter.get('/me', requireAdmin, async (req, res, next) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.sub },
      select: { id: true, email: true, name: true, mustChangePassword: true, lastLoginAt: true, createdAt: true }
    })
    res.json(admin)
  } catch (err) { next(err) }
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).max(100)
})

authRouter.post('/change-password', requireAdmin, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body)
    const admin = await prisma.admin.findUnique({ where: { id: req.admin.sub } })
    if (!admin) throw new HttpError(404, 'Admin not found')

    const ok = await bcrypt.compare(currentPassword, admin.password)
    if (!ok) throw new HttpError(401, 'Current password is incorrect')

    if (newPassword === currentPassword) {
      throw new HttpError(400, 'New password must differ from the current one')
    }
    if (newPassword.toLowerCase() === 'admin') {
      throw new HttpError(400, 'Pick a stronger password than "admin"')
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashed, mustChangePassword: false }
    })

    res.json({ ok: true })
  } catch (err) { next(err) }
})

const profileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  email: z.string().email().optional()
})

authRouter.put('/me', requireAdmin, async (req, res, next) => {
  try {
    const data = profileSchema.parse(req.body)
    const admin = await prisma.admin.update({
      where: { id: req.admin.sub },
      data,
      select: { id: true, email: true, name: true, mustChangePassword: true }
    })
    res.json(admin)
  } catch (err) { next(err) }
})
