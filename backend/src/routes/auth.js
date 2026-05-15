import { Router } from 'express'
import bcrypt from 'bcrypt'
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
    const token = signAdminToken(admin)
    res.json({
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name }
    })
  } catch (err) { next(err) }
})

authRouter.get('/me', requireAdmin, async (req, res, next) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.sub },
      select: { id: true, email: true, name: true, createdAt: true }
    })
    res.json(admin)
  } catch (err) { next(err) }
})
