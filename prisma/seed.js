import 'dotenv/config'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main () {
  const email = process.env.ADMIN_EMAIL || 'admin@st-therese-hospital.cm'
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe!2026'
  const name = process.env.ADMIN_NAME || 'Administrator'

  const hashed = await bcrypt.hash(password, 10)
  const admin = await prisma.admin.upsert({
    where: { email },
    update: { name },
    create: { email, password: hashed, name }
  })
  console.log(`✅ Admin ready: ${admin.email}`)

  const tagNames = ['general', 'events', 'health-tips', 'maternity', 'pediatrics']
  for (const n of tagNames) {
    await prisma.subscriberTag.upsert({ where: { name: n }, update: {}, create: { name: n } })
  }
  console.log(`✅ ${tagNames.length} subscriber tags ready`)

  const samplePosts = [
    {
      title: 'Welcome to Our Health Journal',
      excerpt: 'A new editorial space for advice, news and community updates.',
      content: 'We are excited to launch the St. Therese Health Journal — a place where you can find practical health advice, learn about new programs, and stay up to date on hospital events.',
      category: 'News',
      author: 'St. Therese Team',
      published: true,
      coverImage: '/images/blog/grid/1.jpg'
    },
    {
      title: 'Understanding Your Lab Results',
      excerpt: 'How to read your analysis report and when to consult a doctor.',
      content: 'Lab results can feel intimidating. This guide walks you through the most common values, what is considered normal, and which findings deserve immediate medical attention.',
      category: 'Education',
      author: 'Dr. Ngwa',
      published: true,
      coverImage: '/images/blog/grid/5.jpg'
    }
  ]
  for (const p of samplePosts) {
    await prisma.post.upsert({
      where: { slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') },
      update: {},
      create: {
        ...p,
        slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        publishedAt: new Date()
      }
    })
  }
  console.log(`✅ ${samplePosts.length} sample posts ready`)

  const inOneMonth = new Date(); inOneMonth.setMonth(inOneMonth.getMonth() + 1)
  const sampleEvents = [
    {
      title: 'Free Diabetes Screening Day',
      description: 'Open to all residents of Nomayos and surrounding areas. Free blood-glucose tests, nutrition advice, and consultations with our endocrinology team.',
      location: 'St. Therese Hospital — Main Hall',
      startsAt: inOneMonth,
      rsvpEnabled: true,
      coverImage: '/images/banners/1.jpg'
    }
  ]
  for (const e of sampleEvents) {
    await prisma.event.upsert({
      where: { slug: e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') },
      update: {},
      create: { ...e, slug: e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
    })
  }
  console.log(`✅ ${sampleEvents.length} sample events ready`)

  console.log('\n--- Login credentials ---')
  console.log(`Email:    ${email}`)
  console.log(`Password: ${password}`)
  console.log('-------------------------\n')
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(() => prisma.$disconnect())
