<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-black text-slate-900">Media library</h2>
        <p class="text-sm text-slate-500">Browse and manage the images you've uploaded for articles and events.</p>
      </div>
      <label class="inline-flex cursor-pointer items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700">
        <UploadCloud :size="16" /> Upload image
        <input type="file" accept="image/*" class="hidden" @change="onPick" />
      </label>
    </header>

    <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading…</div>
    <div v-else-if="!items.length" class="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <p class="text-3xl">🖼</p>
      <p class="mt-3 font-bold">Library is empty</p>
      <p class="mt-1 text-sm text-slate-500">Upload your first image to start managing media.</p>
    </div>

    <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <article v-for="m in items" :key="m.filename" class="group overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div class="relative aspect-square">
          <img :src="m.url" :alt="m.filename" class="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div class="absolute inset-0 flex flex-col justify-between p-3 opacity-0 transition group-hover:bg-slate-950/50 group-hover:opacity-100">
            <button type="button" class="ml-auto rounded-full bg-rose-500 px-2 py-1 text-[10px] font-bold text-white" @click="remove(m)">Delete</button>
            <button type="button" class="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-900" @click="copy(m.url)">{{ copied === m.url ? 'Copied!' : 'Copy URL' }}</button>
          </div>
        </div>
        <div class="p-3">
          <p class="truncate text-xs font-bold text-slate-700">{{ m.filename }}</p>
          <p class="text-[10px] text-slate-500">{{ formatSize(m.size) }} · {{ formatDate(m.uploadedAt) }}</p>
        </div>
      </article>
    </div>

    <div v-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{{ error }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { UploadCloud } from 'lucide-vue-next'
import { api } from '@/lib/api'
import { auth } from '@/stores/auth'

const items = ref([])
const loading = ref(true)
const copied = ref('')
const error = ref('')

function formatSize(b) { if (b > 1024 * 1024) return (b / 1024 / 1024).toFixed(1) + ' MB'; return Math.round(b / 1024) + ' KB' }
function formatDate(v) { if (!v) return ''; return new Date(v).toLocaleDateString('en-GB', { dateStyle: 'medium' }) }

async function load() {
  loading.value = true
  try { items.value = await api.get('/uploads', undefined, { token: auth.token.value }) }
  finally { loading.value = false }
}

async function copy(url) {
  await navigator.clipboard.writeText(url)
  copied.value = url
  setTimeout(() => (copied.value = ''), 1500)
}

async function remove(m) {
  if (!confirm(`Delete ${m.filename}?`)) return
  await api.delete(`/uploads/${m.filename}`, { token: auth.token.value })
  load()
}

async function onPick(e) {
  const file = e.target.files?.[0]
  if (!file) return
  error.value = ''
  try {
    const form = new FormData(); form.append('file', file)
    const res = await fetch((import.meta.env.VITE_API_URL || '/api') + '/uploads/image', {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token.value}` },
      body: form
    })
    if (!res.ok) throw new Error('Upload failed')
    await load()
  } catch (err) { error.value = err.message || 'Upload failed' }
  e.target.value = ''
}

onMounted(load)
</script>
