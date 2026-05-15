import jwt from 'jsonwebtoken'

export function signAdminToken (admin) {
  return jwt.sign(
    { sub: admin.id, email: admin.email, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

export function requireAdmin (req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET)
    req.admin = payload
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
