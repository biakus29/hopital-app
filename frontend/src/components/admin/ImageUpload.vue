<template>
  <div>
    <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">{{ label }}</label>

    <div
      class="group relative mt-2 flex h-48 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-teal-500"
      :class="{ 'border-rose-400 bg-rose-50': error }"
      @click="trigger"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <img v-if="modelValue" :src="modelValue" class="absolute inset-0 h-full w-full object-cover" alt="Preview" />
      <div v-if="!modelValue" class="text-center">
        <p class="text-3xl">🖼</p>
        <p class="mt-2 text-sm font-bold text-slate-700">Click to upload or drag &amp; drop</p>
        <p class="text-xs text-slate-500">PNG, JPG, WebP — max 5 MB</p>
      </div>

      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-slate-900/40 text-white">
        <span class="animate-pulse text-sm font-bold">Uploading…</span>
      </div>

      <button
        v-if="modelValue && !loading"
        type="button"
        class="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-rose-600 shadow hover:bg-white"
        @click.stop="clear"
      >Remove</button>
    </div>

    <p v-if="error" class="mt-2 text-sm text-rose-600">{{ error }}</p>
    <input ref="input" type="file" accept="image/*" class="hidden" @change="onPick" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '@/stores/auth'
import { api, ApiError } from '@/lib/api'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label:      { type: String, default: 'Cover image' }
})
const emit = defineEmits(['update:modelValue'])

const input = ref(null)
const loading = ref(false)
const error = ref('')
const dragging = ref(false)

function trigger() { input.value?.click() }
function clear() {
  emit('update:modelValue', '')
}

function onPick(e) {
  const file = e.target.files?.[0]
  if (file) upload(file)
  e.target.value = ''
}

function onDrop(e) {
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) upload(file)
}

async function upload(file) {
  error.value = ''
  loading.value = true
  try {
    if (file.size > 5 * 1024 * 1024) throw new Error('File too large (5 MB max)')
    if (!file.type.startsWith('image/')) throw new Error('Not an image')
    const form = new FormData()
    form.append('file', file)
    const res = await fetch((import.meta.env.VITE_API_URL || '/api') + '/uploads/image', {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token.value}` },
      body: form
    })
    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      throw new Error(txt || `Upload failed (${res.status})`)
    }
    const data = await res.json()
    emit('update:modelValue', data.url)
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : (err.message || 'Upload failed')
  } finally {
    loading.value = false
  }
}
</script>
