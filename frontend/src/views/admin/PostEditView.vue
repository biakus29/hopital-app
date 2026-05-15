<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
          <RouterLink to="/admin/posts" class="hover:text-teal-600">Articles</RouterLink>
          <span class="mx-2">/</span>
          <span>{{ isNew ? 'New' : 'Edit' }}</span>
        </p>
        <h2 class="mt-1 text-2xl font-black text-slate-900">{{ isNew ? 'Write a new article' : form.title || 'Edit article' }}</h2>
      </div>
      <div class="flex flex-wrap gap-2">
        <button type="button" class="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                :disabled="saving" @click="save(false)">
          Save draft
        </button>
        <button type="button" class="rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"
                :disabled="saving" @click="save(true)">
          {{ saving ? 'Saving…' : (form.published ? 'Update' : 'Publish') }}
        </button>
      </div>
    </header>

    <div v-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{{ error }}</div>
    <div v-if="success" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{{ success }}</div>

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Main editor -->
      <div class="space-y-5 lg:col-span-2">
        <div class="rounded-3xl border border-slate-200 bg-white p-6">
          <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Title</label>
          <input v-model="form.title" type="text" placeholder="Headline"
                 class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-xl font-bold outline-none ring-teal-500 focus:ring-2" />

          <label class="mt-5 block text-xs font-bold uppercase tracking-widest text-slate-500">Excerpt</label>
          <textarea v-model="form.excerpt" rows="2" placeholder="Short summary shown on the blog grid"
                    class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-teal-500 focus:ring-2"></textarea>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-6">
          <div class="mb-3 flex items-center justify-between">
            <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Content (Markdown)</label>
            <div class="flex gap-1">
              <button type="button" class="rounded-md px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100"
                      :class="{ '!bg-teal-600 !text-white': mode === 'edit' }" @click="mode = 'edit'">Edit</button>
              <button type="button" class="rounded-md px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100"
                      :class="{ '!bg-teal-600 !text-white': mode === 'preview' }" @click="mode = 'preview'">Preview</button>
            </div>
          </div>
          <textarea v-if="mode === 'edit'" v-model="form.content" rows="20" placeholder="Write your article in Markdown…"
                    class="w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm outline-none ring-teal-500 focus:ring-2"></textarea>
          <div v-else class="article-body min-h-[400px] rounded-xl border border-slate-200 bg-white p-5" v-html="renderedContent"></div>
          <p class="mt-2 text-[11px] text-slate-500">
            Markdown supported : <code>**bold**</code>, <code>[link](url)</code>, <code>## headings</code>, lists, <code>&gt; quotes</code>, images.
          </p>
        </div>
      </div>

      <!-- Sidebar -->
      <aside class="space-y-5">
        <div class="rounded-3xl border border-slate-200 bg-white p-6">
          <p class="text-xs font-bold uppercase tracking-widest text-slate-500">Status</p>
          <div class="mt-3 flex items-center gap-3">
            <span :class="[
              'rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest',
              form.published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            ]">{{ form.published ? 'Live' : 'Draft' }}</span>
            <button type="button" class="text-xs font-bold text-teal-700 hover:text-teal-800" @click="form.published = !form.published">
              Toggle
            </button>
          </div>
          <p v-if="form.publishedAt" class="mt-3 text-[11px] text-slate-500">First published: {{ formatDateTime(form.publishedAt) }}</p>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-6">
          <ImageUpload v-model="form.coverImage" label="Cover image" />
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Category</label>
            <input v-model="form.category" type="text" placeholder="News, Prevention, Education…"
                   class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" list="post-categories" />
            <datalist id="post-categories">
              <option>News</option><option>Prevention</option><option>Research</option>
              <option>Health</option><option>Community</option><option>Education</option><option>Programs</option>
            </datalist>
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Author</label>
            <input v-model="form.author" type="text" placeholder="e.g. Dr. Ngwa"
                   class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>

        <button v-if="!isNew" type="button"
                class="w-full rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100"
                @click="confirmDelete">
          Delete article
        </button>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { api, ApiError } from '@/lib/api'
import { auth } from '@/stores/auth'
import ImageUpload from '@/components/admin/ImageUpload.vue'

const route = useRoute()
const router = useRouter()
const isNew = computed(() => !route.params.id)
const mode = ref('edit')
const saving = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: '',
  coverImage: '',
  author: '',
  published: false,
  publishedAt: null
})

marked.setOptions({ gfm: true, breaks: true })

const renderedContent = computed(() => {
  const html = marked.parse(form.content || '*Nothing to preview yet.*', { async: false })
  return DOMPurify.sanitize(html)
})

function formatDateTime(v) {
  if (!v) return ''
  const d = new Date(v); return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

async function load() {
  if (isNew.value) return
  try {
    const list = await api.get('/posts/admin/all', undefined, { token: auth.token.value })
    const p = list.find(x => String(x.id) === String(route.params.id))
    if (!p) throw new Error('Post not found')
    Object.assign(form, p)
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Could not load this article.'
  }
}

async function save(publishAfterSave) {
  error.value = ''
  success.value = ''
  if (!form.title || form.title.length < 3) { error.value = 'Title must be at least 3 characters.'; return }
  if (!form.content || form.content.length < 1) { error.value = 'Content cannot be empty.'; return }

  saving.value = true
  try {
    const payload = {
      title: form.title,
      excerpt: form.excerpt || null,
      content: form.content,
      category: form.category || null,
      coverImage: form.coverImage || null,
      author: form.author || null,
      published: publishAfterSave ? true : Boolean(form.published)
    }
    if (isNew.value) {
      const created = await api.post('/posts', payload, { token: auth.token.value })
      router.replace(`/admin/posts/${created.id}`)
    } else {
      const updated = await api.put(`/posts/${route.params.id}`, payload, { token: auth.token.value })
      Object.assign(form, updated)
    }
    success.value = 'Saved!'
    setTimeout(() => (success.value = ''), 2500)
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Save failed.'
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  if (!confirm('Delete this article permanently?')) return
  await api.delete(`/posts/${route.params.id}`, { token: auth.token.value })
  router.push('/admin/posts')
}

onMounted(load)
</script>

<style>
.article-body h1, .article-body h2, .article-body h3 { font-weight: 800; margin: 1.2rem 0 0.6rem; }
.article-body h2 { font-size: 1.4rem; }
.article-body h3 { font-size: 1.2rem; }
.article-body p { margin-bottom: 0.9rem; line-height: 1.65; color: #334155; }
.article-body ul, .article-body ol { margin: 0 0 1rem 1.5rem; }
.article-body ul li { list-style: disc; }
.article-body ol li { list-style: decimal; }
.article-body blockquote { border-left: 4px solid #14b8a6; padding-left: 1rem; color: #475569; margin: 1rem 0; }
.article-body a { color: #0f766e; text-decoration: underline; }
.article-body code { background: #f1f5f9; padding: 0.1rem 0.35rem; border-radius: 0.35rem; }
.article-body pre { background: #0f172a; color: #e2e8f0; padding: 1rem; border-radius: 0.75rem; overflow-x: auto; }
.article-body img { max-width: 100%; border-radius: 0.75rem; margin: 1rem 0; }
</style>
