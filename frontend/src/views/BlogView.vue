<template>
  <main class="bg-slate-50 pb-24">
    <section class="relative overflow-hidden bg-slate-950 text-white">
      <div class="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-teal-600/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"></div>
      <div class="mx-auto max-w-6xl px-4 py-20">
        <p class="text-xs font-bold uppercase tracking-[0.22em] text-teal-300">Health Journal</p>
        <h1 class="mt-3 text-4xl font-black md:text-5xl">Advice, News & Updates</h1>
        <p class="mt-4 max-w-3xl text-slate-300">
          Read hospital updates and discover upcoming events in one place.
        </p>
        <div class="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-slate-200">
          <span class="rounded-full border border-white/20 bg-white/10 px-3 py-1">Live from admin content</span>
          <span class="rounded-full border border-white/20 bg-white/10 px-3 py-1">Auto fallback enabled</span>
          <span class="rounded-full border border-white/20 bg-white/10 px-3 py-1">Events highlighted</span>
        </div>
      </div>
    </section>

    <section class="mx-auto mt-12 max-w-6xl px-4">
      <div v-if="loading" class="rounded-3xl border border-slate-200 bg-white p-8">
        <div class="h-5 w-40 animate-pulse rounded bg-slate-200"></div>
        <div class="mt-4 h-10 w-3/4 animate-pulse rounded bg-slate-200"></div>
        <div class="mt-3 h-4 w-full animate-pulse rounded bg-slate-100"></div>
        <div class="mt-2 h-4 w-5/6 animate-pulse rounded bg-slate-100"></div>
      </div>
      <div v-else-if="error" class="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
        {{ error }} Showing fallback content.
      </div>
      <article v-if="featuredPost && !loading" class="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div class="grid gap-0 lg:grid-cols-2">
          <img :src="resolveImage(featuredPost.coverImage)" :alt="featuredPost.title" class="h-72 w-full object-cover lg:h-full" />
          <div class="p-8 md:p-10">
            <span class="inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-teal-800">
              {{ featuredPost.category || 'News' }}
            </span>
            <h2 class="mt-4 text-3xl font-black text-slate-900">{{ featuredPost.title }}</h2>
            <p class="mt-4 text-slate-600">{{ featuredPost.excerpt || preview(featuredPost.content) }}</p>
            <div class="mt-6 flex items-center justify-between gap-4">
              <p class="text-sm text-slate-500">{{ formatDate(featuredPost.publishedAt) }}</p>
              <RouterLink :to="`/blog/${featuredPost.slug}`" class="btn-primary !py-2">Read Article</RouterLink>
            </div>
          </div>
        </div>
      </article>
    </section>

    <section class="mx-auto mt-12 max-w-6xl px-4">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 class="text-2xl font-black text-slate-900">Latest Articles</h3>
        <div class="flex items-center gap-2">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            class="rounded-full px-3 py-1 text-xs font-bold transition"
            :class="activeCategory === category ? 'bg-teal-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
          <button type="button" class="ml-1 text-sm font-semibold text-teal-700 hover:text-teal-800" @click="loadPosts">Refresh</button>
        </div>
      </div>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article v-for="post in filteredPosts" :key="post.id" class="overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
          <img :src="resolveImage(post.coverImage)" :alt="post.title" class="h-48 w-full object-cover" />
          <div class="p-6">
            <p class="text-xs font-black uppercase tracking-widest text-teal-700">{{ post.category || 'General' }}</p>
            <h4 class="mt-2 text-xl font-black text-slate-900">{{ post.title }}</h4>
            <p class="mt-3 text-sm text-slate-600">{{ post.excerpt || preview(post.content, 120) }}</p>
            <div class="mt-5 flex items-center justify-between">
              <span class="text-xs text-slate-500">{{ formatDate(post.publishedAt) }}</span>
              <RouterLink :to="`/blog/${post.slug}`" class="text-sm font-bold text-teal-700 hover:text-teal-800">Continue Reading</RouterLink>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="mx-auto mt-14 max-w-6xl px-4">
      <div class="mb-6 flex items-center justify-between">
        <h3 class="text-2xl font-black text-slate-900">Events In Focus</h3>
        <RouterLink to="/contact" class="text-sm font-semibold text-teal-700 hover:text-teal-800">Need help registering?</RouterLink>
      </div>
      <div v-if="events.length" class="grid gap-5 md:grid-cols-2">
        <article v-for="event in events" :key="event.id" class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p class="text-xs font-black uppercase tracking-widest text-amber-700">Upcoming Event</p>
          <h4 class="mt-2 text-xl font-black text-slate-900">{{ event.title }}</h4>
          <p class="mt-3 text-sm text-slate-600">{{ event.description }}</p>
          <div class="mt-4 text-sm text-slate-500">
            <p>{{ formatDateTime(event.startsAt) }}</p>
            <p v-if="event.location">{{ event.location }}</p>
          </div>
          <div class="mt-5 flex gap-3">
            <RouterLink to="/book" class="rounded-full bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800">Book Now</RouterLink>
            <RouterLink to="/contact" class="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Contact Team</RouterLink>
          </div>
        </article>
      </div>
      <div v-else class="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500">No upcoming events at the moment.</div>
    </section>

  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const loading = ref(false)
const error = ref('')
const posts = ref([])
const events = ref([])
const activeCategory = ref('All')

const fallbackFeaturedPost = {
  id: 'fallback-featured',
  slug: 'partnership-to-increase-covid-19-testing-capacity',
  title: 'Partnership to Increase COVID-19 Testing Capacity',
  excerpt: 'With 200 access points across the country and a comprehensive logistics network, we are a major partner in the pandemic response.',
  content: 'With 200 access points across the country and a comprehensive logistics network, we are a major partner in the pandemic response.',
  category: 'News',
  author: 'Martin King',
  publishedAt: '2023-01-27T00:00:00.000Z',
  coverImage: '/assets/images/blog/grid/1.jpg'
}

const fallbackPosts = [
  {
    id: 'fallback-1',
    slug: 'pathogen-passage-prevention',
    title: 'Pathogen Passage Prevention',
    excerpt: 'Taking precautions against the pandemic of the century and protecting our vulnerable communities.',
    content: 'Taking precautions against the pandemic of the century and protecting our vulnerable communities.',
    category: 'Prevention',
    publishedAt: '2022-01-27T00:00:00.000Z',
    coverImage: '/assets/images/blog/grid/2.jpg'
  },
  {
    id: 'fallback-2',
    slug: 'genetic-mutations-and-viral-spread',
    title: 'Genetic Mutations and Viral Spread',
    excerpt: 'Analysis of gene evolution and how mutations affect transmission.',
    content: 'Analysis of gene evolution and how mutations affect transmission.',
    category: 'Research',
    publishedAt: '2022-01-27T00:00:00.000Z',
    coverImage: '/assets/images/blog/grid/3.jpg'
  },
  {
    id: 'fallback-3',
    slug: 'no-cough-no-problem-covid-19-symptoms',
    title: 'No Cough, No Problem? COVID-19 Symptoms',
    excerpt: 'Understanding medication concerns and atypical symptoms of the virus.',
    content: 'Understanding medication concerns and atypical symptoms of the virus.',
    category: 'Health',
    publishedAt: '2022-01-27T00:00:00.000Z',
    coverImage: '/assets/images/blog/grid/4.jpg'
  },
  {
    id: 'fallback-4',
    slug: 'christmas-celebration-at-st-therese',
    title: 'Christmas Celebration at St. Therese',
    excerpt: 'A moment of joy shared between children, patients and hospital staff.',
    content: 'A moment of joy shared between children, patients and hospital staff.',
    category: 'Community',
    publishedAt: '2025-12-25T00:00:00.000Z',
    coverImage: '/assets/images/gallery/chrismas/1.jpeg'
  },
  {
    id: 'fallback-5',
    slug: 'understanding-your-lab-results',
    title: 'Understanding Your Lab Results',
    excerpt: 'How to read your analysis report and when to consult a doctor immediately.',
    content: 'How to read your analysis report and when to consult a doctor immediately.',
    category: 'Education',
    publishedAt: '2026-01-12T00:00:00.000Z',
    coverImage: '/assets/images/blog/grid/5.jpg'
  },
  {
    id: 'fallback-6',
    slug: 'maternal-health-and-pediatric-care',
    title: 'Maternal Health and Pediatric Care',
    excerpt: 'New programs dedicated to mothers and children of the Nomayos district.',
    content: 'New programs dedicated to mothers and children of the Nomayos district.',
    category: 'Programs',
    publishedAt: '2026-02-05T00:00:00.000Z',
    coverImage: '/assets/images/blog/grid/6.jpg'
  }
]

const effectivePosts = computed(() => {
  if (posts.value.length > 0) return posts.value
  return [fallbackFeaturedPost, ...fallbackPosts]
})

const featuredPost = computed(() => effectivePosts.value[0] || null)
const regularPosts = computed(() => effectivePosts.value.slice(1))
const categories = computed(() => {
  const set = new Set(['All'])
  for (const post of regularPosts.value) set.add(post.category || 'General')
  return [...set]
})
const filteredPosts = computed(() => {
  if (activeCategory.value === 'All') return regularPosts.value
  return regularPosts.value.filter(p => (p.category || 'General') === activeCategory.value)
})

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { dateStyle: 'medium' })
}

function formatDateTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

function preview(text, max = 160) {
  if (!text) return ''
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length <= max ? clean : `${clean.slice(0, max)}...`
}

function resolveImage(path) {
  return path || '/assets/images/blog/grid/1.jpg'
}

async function loadPosts() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/posts?limit=20')
    if (!res.ok) throw new Error('Failed to load blog posts')
    const data = await res.json()
    posts.value = Array.isArray(data.items) ? data.items : []
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unexpected error while loading posts.'
  } finally {
    loading.value = false
  }
}

async function loadEvents() {
  try {
    const res = await fetch('/api/events?scope=upcoming')
    if (!res.ok) return
    const data = await res.json()
    events.value = Array.isArray(data) ? data.slice(0, 4) : []
  } catch {
    events.value = []
  }
}

onMounted(async () => {
  await Promise.all([loadPosts(), loadEvents()])
})

</script>
