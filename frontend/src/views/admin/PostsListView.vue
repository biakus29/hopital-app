<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-black text-slate-900">Articles</h2>
        <p class="text-sm text-slate-500">Manage your blog posts, drafts and publications.</p>
      </div>
      <RouterLink to="/admin/posts/new" class="inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700">
        <Plus :size="16" /> New article
      </RouterLink>
    </header>

    <div class="rounded-2xl border border-slate-200 bg-white">
      <div class="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3">
        <input v-model="search" type="search" placeholder="Search by title…"
               class="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-teal-500 focus:ring-2" />
        <select v-model="filter" class="rounded-xl border border-slate-200 px-3 py-2 text-sm">
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      <div v-if="loading" class="p-8 text-center text-sm text-slate-500">Loading…</div>
      <div v-else-if="!filtered.length" class="p-12 text-center">
        <p class="text-3xl">📝</p>
        <p class="mt-3 font-bold text-slate-900">No articles yet</p>
        <p class="mt-1 text-sm text-slate-500">Click "New article" to create your first post.</p>
      </div>

      <table v-else class="w-full text-left text-sm">
        <thead class="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500">
          <tr>
            <th class="px-4 py-3">Title</th>
            <th class="px-4 py-3">Category</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Published</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="p in filtered" :key="p.id" class="hover:bg-slate-50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img v-if="p.coverImage" :src="resolveImage(p.coverImage)" :alt="p.title" class="h-10 w-10 rounded-lg object-cover" />
                <div v-else class="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-400">📄</div>
                <div class="min-w-0">
                  <p class="truncate font-bold text-slate-900">{{ p.title }}</p>
                  <p class="truncate text-[11px] text-slate-500">/{{ p.slug }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-slate-600">{{ p.category || '—' }}</td>
            <td class="px-4 py-3">
              <span :class="[
                'rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest',
                p.published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              ]">{{ p.published ? 'Live' : 'Draft' }}</span>
            </td>
            <td class="px-4 py-3 text-slate-600">{{ formatDate(p.publishedAt) || '—' }}</td>
            <td class="px-4 py-3">
              <div class="flex justify-end gap-2">
                <RouterLink :to="`/admin/posts/${p.id}`" class="rounded-lg p-2 text-slate-500 hover:bg-slate-100" title="Edit">
                  <Pencil :size="16" />
                </RouterLink>
                <a v-if="p.published" :href="`/blog/${p.slug}`" target="_blank" class="rounded-lg p-2 text-slate-500 hover:bg-slate-100" title="View">
                  <ExternalLink :size="16" />
                </a>
                <button type="button" class="rounded-lg p-2 text-rose-500 hover:bg-rose-50" title="Delete" @click="askDelete(p)">
                  <Trash2 :size="16" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="toDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <p class="text-lg font-black">Delete article?</p>
        <p class="mt-2 text-sm text-slate-600">"{{ toDelete.title }}" will be permanently removed.</p>
        <div class="mt-5 flex justify-end gap-2">
          <button type="button" class="rounded-full px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100" @click="toDelete = null">Cancel</button>
          <button type="button" class="rounded-full bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-700" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-vue-next'
import { api } from '@/lib/api'
import { auth } from '@/stores/auth'

const posts = ref([])
const loading = ref(true)
const search = ref('')
const filter = ref('all')
const toDelete = ref(null)

const filtered = computed(() => {
  return posts.value.filter(p => {
    if (filter.value === 'published' && !p.published) return false
    if (filter.value === 'draft' && p.published) return false
    if (search.value && !p.title.toLowerCase().includes(search.value.toLowerCase())) return false
    return true
  })
})

function resolveImage(path) {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('/')) return path
  return '/' + path
}

function formatDate(v) {
  if (!v) return ''
  const d = new Date(v); return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { dateStyle: 'medium' })
}

async function load() {
  loading.value = true
  try {
    posts.value = await api.get('/posts/admin/all', undefined, { token: auth.token.value })
  } finally { loading.value = false }
}

function askDelete(p) { toDelete.value = p }
async function confirmDelete() {
  const p = toDelete.value
  toDelete.value = null
  await api.delete(`/posts/${p.id}`, { token: auth.token.value })
  await load()
}

onMounted(load)
</script>
