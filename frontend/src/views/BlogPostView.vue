<template>
  <main class="bg-slate-50 pb-24">
    <!-- Reading progress bar -->
    <div class="fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
      <div class="h-full bg-teal-500 transition-[width] duration-150 ease-out" :style="{ width: `${progress}%` }"></div>
    </div>

    <!-- Hero -->
    <section class="relative overflow-hidden bg-slate-950 text-white">
      <div v-if="post?.coverImage" class="absolute inset-0 opacity-30">
        <img :src="resolveImage(post.coverImage)" :alt="post.title" class="h-full w-full object-cover blur-sm" />
        <div class="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950"></div>
      </div>
      <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-600/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div class="relative mx-auto max-w-4xl px-4 py-16 md:py-24">
        <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
          <RouterLink to="/blog" class="text-teal-300 hover:text-teal-200">&larr; All articles</RouterLink>
          <span v-if="post?.category">·</span>
          <span v-if="post?.category" class="text-teal-300">{{ post.category }}</span>
        </nav>

        <h1 class="mt-5 text-4xl font-black leading-[1.1] md:text-5xl">
          {{ post?.title || 'Loading article…' }}
        </h1>

        <p v-if="post?.excerpt" class="mt-5 max-w-3xl text-lg text-slate-200">{{ post.excerpt }}</p>

        <div v-if="post" class="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-300">
          <div v-if="post.author" class="flex items-center gap-3">
            <span class="grid h-10 w-10 place-items-center rounded-full bg-teal-500 font-black text-white">
              {{ initials(post.author) }}
            </span>
            <div>
              <p class="font-bold text-white">{{ post.author }}</p>
              <p class="text-xs text-slate-400">St. Therese editorial team</p>
            </div>
          </div>
          <span class="hidden sm:block text-slate-500">·</span>
          <p v-if="post.publishedAt">{{ formatDate(post.publishedAt) }}</p>
          <span class="hidden sm:block text-slate-500">·</span>
          <p>{{ readingTime }} min read</p>
        </div>
      </div>
    </section>

    <!-- Article body -->
    <section class="mx-auto -mt-10 max-w-4xl px-4">
      <div v-if="loading" class="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div class="space-y-3">
          <div class="h-72 w-full animate-pulse rounded-2xl bg-slate-200"></div>
          <div class="h-6 w-3/4 animate-pulse rounded bg-slate-200"></div>
          <div class="h-4 w-full animate-pulse rounded bg-slate-100"></div>
          <div class="h-4 w-5/6 animate-pulse rounded bg-slate-100"></div>
          <div class="h-4 w-2/3 animate-pulse rounded bg-slate-100"></div>
        </div>
      </div>

      <div v-else-if="error" class="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
        <p class="text-3xl">🚧</p>
        <p class="mt-3 text-lg font-bold text-red-900">{{ error }}</p>
        <RouterLink to="/blog" class="mt-5 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700">
          Back to articles
        </RouterLink>
      </div>

      <article v-else-if="post" class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <img
          v-if="post.coverImage"
          :src="resolveImage(post.coverImage)"
          :alt="post.title"
          class="h-72 w-full object-cover md:h-96"
          loading="lazy"
        />

        <div class="px-6 py-10 md:px-12 md:py-14">
          <!-- Share bar (sticky on desktop) -->
          <div class="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-6">
            <p class="text-xs font-bold uppercase tracking-widest text-slate-500">Share this article</p>
            <div class="flex items-center gap-2">
              <a
                :href="`https://wa.me/?text=${encodedShareText}`"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.09.69 4.13 1.97 5.81L2 22l4.42-1.96a9.84 9.84 0 0 0 5.62 1.74h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.65 14.13c-.24.68-1.41 1.32-1.97 1.39-.5.05-1.15.08-1.85-.12-.43-.13-.99-.31-1.7-.62-2.99-1.29-4.95-4.3-5.1-4.5-.15-.2-1.21-1.61-1.21-3.08 0-1.46.77-2.18 1.04-2.48.27-.3.59-.37.79-.37.2 0 .4.01.57.01.18 0 .43-.07.67.51.24.59.83 2.05.9 2.2.07.14.12.31.02.5-.1.2-.15.32-.29.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.78 1.28 1.67 2.07 1.14 1.02 2.1 1.34 2.4 1.49.3.15.47.13.65-.07.18-.2.75-.87.95-1.17.2-.3.4-.25.66-.15.27.1 1.72.81 2.01.96.29.15.49.22.56.34.07.13.07.74-.17 1.42z"/></svg>
                WhatsApp
              </a>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                @click="copyLink"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                {{ copied ? 'Copied!' : 'Copy link' }}
              </button>
              <a
                :href="`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodedShareText}`"
                class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Email
              </a>
            </div>
          </div>

          <!-- Content -->
          <div ref="articleBodyRef" class="article-body" v-html="renderedContent"></div>
        </div>
      </article>
    </section>

    <!-- Related -->
    <section v-if="related.length" class="mx-auto mt-16 max-w-7xl px-4">
      <h3 class="text-2xl font-black text-slate-900">Continue reading</h3>
      <div class="mt-6 grid gap-6 md:grid-cols-3">
        <RouterLink
          v-for="r in related"
          :key="r.id"
          :to="`/blog/${r.slug}`"
          class="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
        >
          <img :src="resolveImage(r.coverImage)" :alt="r.title" class="h-40 w-full object-cover" loading="lazy" />
          <div class="p-5">
            <p class="text-[10px] font-black uppercase tracking-widest text-teal-700">{{ r.category || 'General' }}</p>
            <p class="mt-1 text-base font-black text-slate-900 group-hover:text-teal-700 line-clamp-2">{{ r.title }}</p>
            <p class="mt-2 text-xs text-slate-500">{{ formatDate(r.publishedAt) }}</p>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="mx-auto mt-16 max-w-4xl px-4">
      <NewsletterSignup
        title="Liked this article?"
        subtitle="Subscribe to receive new posts and event invitations as soon as they're published."
        source="blog-post"
        :tags="post?.category ? [String(post.category).toLowerCase()] : []"
      />
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { api, ApiError } from '@/lib/api'
import NewsletterSignup from '@/components/NewsletterSignup.vue'

const route = useRoute()
const loading = ref(false)
const error = ref('')
const post = ref(null)
const related = ref([])
const copied = ref(false)
const progress = ref(0)
const articleBodyRef = ref(null)

marked.setOptions({ gfm: true, breaks: true })

const renderedContent = computed(() => {
  const raw = post.value?.content || ''
  // marked.parse is sync by default in v14; sanitize before injecting
  const html = marked.parse(raw, { async: false })
  return DOMPurify.sanitize(html)
})

const readingTime = computed(() => {
  const words = (post.value?.content || '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
})

const shareText = computed(() => {
  const t = post.value?.title || 'St. Therese Hospital — Health Journal'
  return `${t}\n${typeof window !== 'undefined' ? window.location.href : ''}`
})
const encodedShareText = computed(() => encodeURIComponent(shareText.value))

function resolveImage(path) {
  if (!path) return '/images/blog/grid/1.jpg'
  return path.replace(/^\/assets\//, '/')
}

function initials(name) {
  return String(name).split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { dateStyle: 'medium' })
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch { copied.value = false }
}

async function loadPost() {
  loading.value = true
  error.value = ''
  post.value = null
  try {
    post.value = await api.get(`/posts/${route.params.slug}`)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) error.value = 'This article was not found or is no longer published.'
    else error.value = 'Unable to load this article. Please try again later.'
  } finally {
    loading.value = false
  }
}

async function loadRelated() {
  try {
    const data = await api.get('/posts', { limit: 20 })
    const items = Array.isArray(data?.items) ? data.items : []
    related.value = items
      .filter(p => p.slug !== route.params.slug)
      .filter(p => post.value && (!post.value.category || p.category === post.value.category) || true)
      .slice(0, 3)
  } catch { related.value = [] }
}

function onScroll() {
  const h = document.documentElement
  const total = h.scrollHeight - h.clientHeight
  progress.value = total > 0 ? Math.min(100, (h.scrollTop / total) * 100) : 0
}

watch(() => route.params.slug, async () => {
  window.scrollTo({ top: 0 })
  await loadPost()
  await loadRelated()
})

onMounted(async () => {
  window.addEventListener('scroll', onScroll, { passive: true })
  await loadPost()
  await loadRelated()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>

<style>
/* Article typography (not scoped, so v-html children pick it up) */
.article-body { color: #334155; font-size: 1.05rem; line-height: 1.75; }
.article-body h1, .article-body h2, .article-body h3, .article-body h4 { color: #0f172a; font-weight: 800; margin: 2rem 0 0.75rem; line-height: 1.25; }
.article-body h2 { font-size: 1.65rem; }
.article-body h3 { font-size: 1.35rem; }
.article-body p { margin: 0 0 1.15rem; }
.article-body a { color: #0f766e; text-decoration: underline; text-underline-offset: 3px; font-weight: 600; }
.article-body a:hover { color: #115e59; }
.article-body ul, .article-body ol { margin: 0 0 1.2rem 1.5rem; }
.article-body ul li { list-style: disc; margin-bottom: 0.4rem; }
.article-body ol li { list-style: decimal; margin-bottom: 0.4rem; }
.article-body blockquote { border-left: 4px solid #0d9488; padding: 0.25rem 0 0.25rem 1rem; margin: 1.5rem 0; color: #475569; font-style: italic; background: #f0fdfa; border-radius: 0 0.5rem 0.5rem 0; }
.article-body img { max-width: 100%; border-radius: 1rem; margin: 1.5rem 0; }
.article-body code { background: #f1f5f9; color: #0f172a; padding: 0.1rem 0.35rem; border-radius: 0.35rem; font-size: 0.92em; }
.article-body pre { background: #0f172a; color: #e2e8f0; padding: 1rem 1.25rem; border-radius: 0.75rem; overflow-x: auto; margin: 1.25rem 0; }
.article-body pre code { background: transparent; color: inherit; padding: 0; }
.article-body hr { border: none; border-top: 1px solid #e2e8f0; margin: 2rem 0; }
.article-body table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
.article-body th, .article-body td { border: 1px solid #e2e8f0; padding: 0.5rem 0.75rem; text-align: left; }
.article-body th { background: #f8fafc; }
</style>
