<template>
  <main class="bg-slate-50 pb-24">
    <!-- HERO -->
    <section class="relative overflow-hidden bg-slate-950 text-white">
      <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-600/25 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl"></div>
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(20,184,166,0.15),transparent_60%)]"></div>

      <div class="relative mx-auto max-w-7xl px-4 py-20 lg:py-28">
        <div class="max-w-3xl">
          <p class="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-teal-200">
            <span class="h-1.5 w-1.5 rounded-full bg-teal-300 animate-pulse"></span>
            Health Journal
          </p>
          <h1 class="mt-5 text-4xl font-black leading-[1.05] md:text-6xl">
            Advice, News &amp; <span class="text-teal-400">Community Updates</span>
          </h1>
          <p class="mt-5 max-w-2xl text-base text-slate-300 md:text-lg">
            Stories, prevention tips and the latest from St. Therese. Updated live by our team — read, share, and subscribe for next ones.
          </p>

          <!-- Search -->
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <label class="relative flex-1">
              <span class="absolute inset-y-0 left-4 flex items-center text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </span>
              <input
                v-model="search"
                type="search"
                placeholder="Search articles, topics, authors…"
                class="w-full rounded-full border border-white/20 bg-white/10 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-400 outline-none ring-teal-300 focus:ring-2"
              />
            </label>
            <button
              type="button"
              class="rounded-full bg-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-500/20 transition hover:bg-teal-400"
              @click="loadPosts"
            >
              Refresh feed
            </button>
          </div>

          <!-- Quick stats -->
          <div class="mt-10 grid grid-cols-3 gap-4 text-sm md:max-w-md">
            <div>
              <p class="text-2xl font-black text-white">{{ stats.total }}</p>
              <p class="text-xs uppercase tracking-widest text-slate-400">Articles</p>
            </div>
            <div>
              <p class="text-2xl font-black text-white">{{ categories.length - 1 }}</p>
              <p class="text-xs uppercase tracking-widest text-slate-400">Topics</p>
            </div>
            <div>
              <p class="text-2xl font-black text-white">{{ events.length }}</p>
              <p class="text-xs uppercase tracking-widest text-slate-400">Upcoming events</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED EVENTS — front and center, before articles -->
    <EventsShowcase
      variant="compact"
      eyebrow="Highlighted events"
      title="What's happening at St. Therese"
      subtitle="Reserve your seat now and receive WhatsApp reminders."
    />

    <!-- Featured + Sidebar -->
    <section class="mx-auto mt-10 max-w-7xl px-4">
      <div v-if="error && !posts.length" class="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
        <p class="flex items-center gap-2 font-bold">
          <span class="inline-block h-2 w-2 rounded-full bg-amber-500"></span>
          Showing sample articles
        </p>
        <p class="mt-1 text-sm">{{ error }}</p>
        <p class="mt-2 text-xs text-amber-800">The blog will switch to real content as soon as the backend is reachable.</p>
      </div>

      <div v-if="loading && !posts.length" class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div class="h-72 w-full animate-pulse bg-slate-200"></div>
          <div class="p-8 space-y-3">
            <div class="h-5 w-24 animate-pulse rounded bg-slate-200"></div>
            <div class="h-10 w-3/4 animate-pulse rounded bg-slate-200"></div>
            <div class="h-4 w-full animate-pulse rounded bg-slate-100"></div>
            <div class="h-4 w-5/6 animate-pulse rounded bg-slate-100"></div>
          </div>
        </div>
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="rounded-2xl border border-slate-200 bg-white p-4">
            <div class="flex gap-4">
              <div class="h-20 w-20 flex-shrink-0 animate-pulse rounded-xl bg-slate-200"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 w-16 animate-pulse rounded bg-slate-200"></div>
                <div class="h-4 w-full animate-pulse rounded bg-slate-100"></div>
                <div class="h-4 w-2/3 animate-pulse rounded bg-slate-100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="featuredPost" class="grid gap-6 lg:grid-cols-3">
        <!-- Featured -->
        <RouterLink :to="`/blog/${featuredPost.slug}`" class="group lg:col-span-2 overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:shadow-2xl">
          <div class="relative overflow-hidden">
            <img
              :src="resolveImage(featuredPost.coverImage)"
              :alt="featuredPost.title"
              class="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <span class="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white">
              ★ Featured
            </span>
          </div>
          <div class="p-8 md:p-10">
            <p class="text-[11px] font-black uppercase tracking-widest text-teal-700">{{ featuredPost.category || 'News' }}</p>
            <h2 class="mt-2 text-3xl font-black leading-tight text-slate-900 group-hover:text-teal-700">
              {{ featuredPost.title }}
            </h2>
            <p class="mt-3 text-slate-600">{{ featuredPost.excerpt || preview(featuredPost.content, 220) }}</p>
            <div class="mt-6 flex items-center justify-between gap-3 text-sm">
              <div class="flex items-center gap-3 text-slate-500">
                <span v-if="featuredPost.author" class="flex items-center gap-2">
                  <span class="grid h-8 w-8 place-items-center rounded-full bg-teal-100 text-xs font-black text-teal-800">
                    {{ initials(featuredPost.author) }}
                  </span>
                  {{ featuredPost.author }}
                </span>
                <span v-if="featuredPost.publishedAt">· {{ formatDate(featuredPost.publishedAt) }}</span>
                <span>· {{ readingTime(featuredPost.content) }} min read</span>
              </div>
              <span class="rounded-full bg-teal-700 px-4 py-2 text-xs font-bold text-white group-hover:bg-teal-800">Read &rarr;</span>
            </div>
          </div>
        </RouterLink>

        <!-- Sidebar mini list -->
        <aside class="space-y-4">
          <h3 class="text-sm font-black uppercase tracking-widest text-slate-500">Trending now</h3>
          <RouterLink
            v-for="post in trending"
            :key="post.id"
            :to="`/blog/${post.slug}`"
            class="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <img :src="resolveImage(post.coverImage)" :alt="post.title" class="h-20 w-20 flex-shrink-0 rounded-xl object-cover" loading="lazy" />
            <div class="flex-1 min-w-0">
              <p class="text-[10px] font-black uppercase tracking-widest text-teal-700">{{ post.category || 'General' }}</p>
              <p class="mt-1 text-sm font-bold text-slate-900 group-hover:text-teal-700 line-clamp-2">{{ post.title }}</p>
              <p class="mt-1 text-[11px] text-slate-500">{{ formatDate(post.publishedAt) }}</p>
            </div>
          </RouterLink>
        </aside>
      </div>
    </section>

    <!-- Articles grid -->
    <section class="mx-auto mt-16 max-w-7xl px-4">
      <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 class="text-2xl font-black text-slate-900 md:text-3xl">Latest Articles</h3>
          <p class="mt-1 text-sm text-slate-500">{{ filteredPosts.length }} article{{ filteredPosts.length > 1 ? 's' : '' }} <span v-if="activeCategory !== 'All'">in {{ activeCategory }}</span><span v-if="search">matching "{{ search }}"</span></p>
        </div>
        <div class="text-sm text-slate-500" v-if="search || activeCategory !== 'All'">
          <button type="button" class="font-bold text-teal-700 hover:text-teal-800" @click="clearFilters">Clear filters</button>
        </div>
      </div>

      <!-- Category filter (inline, less visually heavy) -->
      <div class="mb-6 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Filter by topic</span>
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="rounded-full px-3 py-1 text-xs font-bold transition"
          :class="activeCategory === category
            ? 'bg-teal-700 text-white'
            : 'text-slate-600 hover:bg-slate-100'"
          @click="activeCategory = category"
        >
          {{ category }}
          <span v-if="category !== 'All'" class="ml-1 text-[10px] opacity-60">{{ countFor(category) }}</span>
        </button>
      </div>

      <div v-if="!filteredPosts.length" class="rounded-3xl border border-slate-200 bg-white p-10 text-center">
        <p class="text-3xl">🌿</p>
        <p class="mt-3 text-base font-bold text-slate-900">No articles match your search yet.</p>
        <p class="mt-1 text-sm text-slate-500">Try clearing filters or come back soon — our editorial team posts every week.</p>
      </div>

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="post in paginatedPosts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="relative overflow-hidden">
            <img :src="resolveImage(post.coverImage)" :alt="post.title" class="h-48 w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
          </div>
          <div class="flex flex-1 flex-col p-6">
            <p class="text-[11px] font-black uppercase tracking-widest text-teal-700">{{ post.category || 'General' }}</p>
            <h4 class="mt-2 text-lg font-black text-slate-900 group-hover:text-teal-700 line-clamp-2">{{ post.title }}</h4>
            <p class="mt-3 flex-1 text-sm text-slate-600 line-clamp-3">{{ post.excerpt || preview(post.content, 140) }}</p>
            <div class="mt-5 flex items-center justify-between text-xs text-slate-500">
              <span>{{ formatDate(post.publishedAt) }}</span>
              <span>{{ readingTime(post.content) }} min read</span>
            </div>
          </div>
        </RouterLink>
      </div>

      <div v-if="filteredPosts.length > pageSize" class="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p class="text-sm text-slate-500">
          Showing {{ paginatedPosts.length }} of {{ filteredPosts.length }}
        </p>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="page === 1"
            @click="page--"
          >&larr; Previous</button>
          <span class="text-sm font-bold text-slate-700">Page {{ page }} / {{ totalPages }}</span>
          <button
            type="button"
            class="rounded-full bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="page === totalPages"
            @click="page++"
          >Next &rarr;</button>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="mx-auto mt-20 max-w-7xl px-4">
      <NewsletterSignup
        title="Get next week's article first"
        subtitle="Health tips, hospital announcements and event invitations — by WhatsApp, SMS or email."
        source="blog-footer"
        :tags="['health-tips']"
      />
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api, ApiError } from '@/lib/api'
import NewsletterSignup from '@/components/NewsletterSignup.vue'
import EventsShowcase from '@/components/EventsShowcase.vue'

const loading = ref(false)
const error = ref('')
const posts = ref([])
const events = ref([])
const activeCategory = ref('All')
const search = ref('')
const page = ref(1)
const pageSize = 9

const stats = computed(() => ({
  total: effectivePosts.value.length
}))

const fallbackFeaturedPost = {
  id: 'fallback-featured',
  slug: 'partnership-to-increase-covid-19-testing-capacity',
  title: 'Partnership to Increase COVID-19 Testing Capacity',
  excerpt: 'With 200 access points across the country and a comprehensive logistics network, we are a major partner in the pandemic response.',
  content: 'With 200 access points across the country and a comprehensive logistics network, we are a major partner in the pandemic response.',
  category: 'News', author: 'Martin King',
  publishedAt: '2023-01-27T00:00:00.000Z',
  coverImage: '/images/blog/grid/1.jpg'
}

const fallbackPosts = [
  { id: 'fallback-1', slug: 'pathogen-passage-prevention', title: 'Pathogen Passage Prevention', excerpt: 'Taking precautions against the pandemic of the century and protecting our vulnerable communities.', content: 'Taking precautions against the pandemic of the century and protecting our vulnerable communities.', category: 'Prevention', publishedAt: '2022-01-27T00:00:00.000Z', coverImage: '/images/blog/grid/2.jpg' },
  { id: 'fallback-2', slug: 'genetic-mutations-and-viral-spread', title: 'Genetic Mutations and Viral Spread', excerpt: 'Analysis of gene evolution and how mutations affect transmission.', content: 'Analysis of gene evolution and how mutations affect transmission.', category: 'Research', publishedAt: '2022-01-27T00:00:00.000Z', coverImage: '/images/blog/grid/3.jpg' },
  { id: 'fallback-3', slug: 'no-cough-no-problem-covid-19-symptoms', title: 'No Cough, No Problem? COVID-19 Symptoms', excerpt: 'Understanding medication concerns and atypical symptoms of the virus.', content: 'Understanding medication concerns and atypical symptoms of the virus.', category: 'Health', publishedAt: '2022-01-27T00:00:00.000Z', coverImage: '/images/blog/grid/4.jpg' },
  { id: 'fallback-4', slug: 'christmas-celebration-at-st-therese', title: 'Christmas Celebration at St. Therese', excerpt: 'A moment of joy shared between children, patients and hospital staff.', content: 'A moment of joy shared between children, patients and hospital staff.', category: 'Community', publishedAt: '2025-12-25T00:00:00.000Z', coverImage: '/images/gallery/chrismas/1.jpeg' },
  { id: 'fallback-5', slug: 'understanding-your-lab-results', title: 'Understanding Your Lab Results', excerpt: 'How to read your analysis report and when to consult a doctor immediately.', content: 'How to read your analysis report and when to consult a doctor immediately.', category: 'Education', publishedAt: '2026-01-12T00:00:00.000Z', coverImage: '/images/blog/grid/5.jpg' },
  { id: 'fallback-6', slug: 'maternal-health-and-pediatric-care', title: 'Maternal Health and Pediatric Care', excerpt: 'New programs dedicated to mothers and children of the Nomayos district.', content: 'New programs dedicated to mothers and children of the Nomayos district.', category: 'Programs', publishedAt: '2026-02-05T00:00:00.000Z', coverImage: '/images/blog/grid/6.jpg' }
]

const effectivePosts = computed(() => posts.value.length ? posts.value : [fallbackFeaturedPost, ...fallbackPosts])
const featuredPost  = computed(() => effectivePosts.value[0] || null)
const regularPosts  = computed(() => effectivePosts.value.slice(1))

const trending = computed(() => effectivePosts.value.slice(0, 3))

const categories = computed(() => {
  const set = new Set(['All'])
  for (const p of effectivePosts.value) set.add(p.category || 'General')
  return [...set]
})

const filteredPosts = computed(() => {
  const q = search.value.trim().toLowerCase()
  return regularPosts.value.filter(p => {
    if (activeCategory.value !== 'All' && (p.category || 'General') !== activeCategory.value) return false
    if (!q) return true
    return [p.title, p.excerpt, p.content, p.author, p.category]
      .filter(Boolean).some(s => String(s).toLowerCase().includes(q))
  })
})

const totalPages    = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / pageSize)))
const paginatedPosts = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

function countFor(cat) {
  return effectivePosts.value.filter(p => (p.category || 'General') === cat).length
}

function clearFilters() {
  search.value = ''
  activeCategory.value = 'All'
  page.value = 1
}

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { dateStyle: 'medium' })
}
function preview(text, max = 160) {
  if (!text) return ''
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length <= max ? clean : `${clean.slice(0, max)}…`
}

function readingTime(text) {
  if (!text) return 1
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function initials(name) {
  return name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function resolveImage(path) {
  if (!path) return '/images/blog/grid/1.jpg'
  // Compatibility: old data used /assets/images/...
  return path.replace(/^\/assets\//, '/')
}

async function loadPosts() {
  loading.value = true
  error.value = ''
  try {
    const data = await api.get('/posts', { limit: 50 })
    posts.value = Array.isArray(data?.items) ? data.items : []
    page.value = 1
  } catch (err) {
    posts.value = []
    error.value = err instanceof ApiError && err.status > 0
      ? err.message
      : 'Live blog feed is offline.'
  } finally {
    loading.value = false
  }
}

async function loadEvents() {
  try {
    const data = await api.get('/events', { scope: 'upcoming' })
    events.value = Array.isArray(data) ? data.slice(0, 4) : []
  } catch {
    events.value = []
  }
}

onMounted(async () => {
  await Promise.all([loadPosts(), loadEvents()])
})
</script>

<style scoped>
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
</style>
