<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-black text-slate-900">Broadcasts</h2>
        <p class="text-sm text-slate-500">Send messages to your subscribers on the channels they opted into.</p>
      </div>
      <button type="button" class="inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700" @click="composeOpen = true">
        <Send :size="16" /> New broadcast
      </button>
    </header>

    <!-- List -->
    <div class="rounded-2xl border border-slate-200 bg-white">
      <div v-if="loading" class="p-8 text-center text-sm text-slate-500">Loading…</div>
      <div v-else-if="!broadcasts.length" class="p-12 text-center">
        <p class="text-3xl">📣</p>
        <p class="mt-3 font-bold">No broadcasts yet</p>
      </div>
      <table v-else class="w-full text-left text-sm">
        <thead class="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500">
          <tr>
            <th class="px-4 py-3">Message</th>
            <th class="px-4 py-3">Channel</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Progress</th>
            <th class="px-4 py-3">Sent at</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="b in broadcasts" :key="b.id" class="hover:bg-slate-50">
            <td class="px-4 py-3">
              <p class="font-bold text-slate-900 line-clamp-1">{{ b.title || b.message.slice(0, 80) }}</p>
              <p class="mt-0.5 text-[11px] text-slate-500 line-clamp-1">{{ b.message }}</p>
            </td>
            <td class="px-4 py-3">
              <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-700">{{ b.channel }}</span>
            </td>
            <td class="px-4 py-3">
              <span :class="['rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest', statusClass(b.status)]">{{ b.status }}</span>
            </td>
            <td class="px-4 py-3 text-slate-600">{{ b.sentCount }}/{{ b.totalCount }} <span v-if="b.failedCount" class="text-rose-600">· {{ b.failedCount }} failed</span></td>
            <td class="px-4 py-3 text-slate-500">{{ formatDateTime(b.startedAt || b.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Compose modal -->
    <div v-if="composeOpen" class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-4 sm:items-center">
      <div class="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <header class="mb-5 flex items-start justify-between">
          <div>
            <h3 class="text-lg font-black">Compose broadcast</h3>
            <p class="text-sm text-slate-500">Goes out as soon as you confirm. Throttled to {{ delayMs }}ms between recipients.</p>
          </div>
          <button type="button" class="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200" @click="closeCompose">✕</button>
        </header>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Channel</label>
            <div class="mt-2 flex flex-wrap gap-2">
              <button v-for="c in channels" :key="c" type="button"
                      :class="[
                        'rounded-full px-3 py-1.5 text-xs font-bold transition',
                        compose.channel === c ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      ]" @click="compose.channel = c">{{ c }}</button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Title (internal)</label>
            <input v-model="compose.title" type="text" placeholder="e.g. Diabetes day reminder"
                   class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>

          <div v-if="compose.channel === 'EMAIL' || compose.channel === 'MULTI'">
            <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Subject (email)</label>
            <input v-model="compose.subject" type="text" placeholder="Email subject line"
                   class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Message</label>
            <textarea v-model="compose.message" rows="6" placeholder="Your message…"
                      class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></textarea>
            <p class="mt-1 text-[11px] text-slate-500">{{ compose.message.length }} chars</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Filter tag</label>
              <input v-model="compose.filterTag" type="text" placeholder="(optional)"
                     class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Status filter</label>
              <select v-model="compose.filterStatus" class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="ACTIVE">Active only</option>
                <option value="ALL">All subscribers</option>
              </select>
            </div>
          </div>

          <div class="rounded-xl bg-slate-50 p-3 text-sm">
            <p class="font-bold text-slate-700">
              Estimated recipients: <span class="text-teal-700">{{ preview.recipientCount ?? '—' }}</span>
              <button type="button" class="ml-2 text-[11px] font-bold text-teal-700 underline" @click="previewCount">Refresh</button>
            </p>
          </div>

          <div v-if="error" class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{{ error }}</div>
        </div>

        <footer class="mt-6 flex justify-end gap-2">
          <button type="button" class="rounded-full px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100" @click="closeCompose">Cancel</button>
          <button type="button" class="rounded-full bg-teal-600 px-5 py-2 text-sm font-black text-white hover:bg-teal-700"
                  :disabled="sending" @click="send">
            {{ sending ? 'Sending…' : 'Send broadcast' }}
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Send } from 'lucide-vue-next'
import { api, ApiError } from '@/lib/api'
import { auth } from '@/stores/auth'

const broadcasts = ref([])
const loading = ref(true)
const composeOpen = ref(false)
const sending = ref(false)
const error = ref('')
const delayMs = 3500

const channels = ['WHATSAPP', 'EMAIL', 'SMS', 'MULTI']

const compose = reactive({
  channel: 'WHATSAPP',
  title: '',
  subject: '',
  message: '',
  filterTag: '',
  filterStatus: 'ACTIVE'
})
const preview = ref({ recipientCount: null })

function statusClass(s) {
  if (s === 'SENT')    return 'bg-emerald-100 text-emerald-800'
  if (s === 'SENDING') return 'bg-blue-100 text-blue-800'
  if (s === 'FAILED')  return 'bg-rose-100 text-rose-800'
  return 'bg-slate-100 text-slate-700'
}
function formatDateTime(v) {
  if (!v) return ''
  return new Date(v).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

async function load() {
  loading.value = true
  try {
    broadcasts.value = await api.get('/broadcasts', undefined, { token: auth.token.value })
  } finally { loading.value = false }
}

function closeCompose() {
  composeOpen.value = false
  error.value = ''
}

async function previewCount() {
  error.value = ''
  try {
    const res = await api.post('/broadcasts/preview', {
      channel: compose.channel,
      message: compose.message || 'preview',
      subject: compose.subject || undefined,
      filterTag: compose.filterTag || undefined,
      filterStatus: compose.filterStatus
    }, { token: auth.token.value })
    preview.value = res
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Preview failed.'
  }
}

async function send() {
  error.value = ''
  if (!compose.message.trim()) { error.value = 'Message cannot be empty.'; return }
  if (compose.channel === 'EMAIL' && !compose.subject.trim()) { error.value = 'Email subject is required.'; return }
  sending.value = true
  try {
    await api.post('/broadcasts', {
      channel: compose.channel,
      title: compose.title || undefined,
      subject: compose.subject || undefined,
      message: compose.message,
      filterTag: compose.filterTag || undefined,
      filterStatus: compose.filterStatus
    }, { token: auth.token.value })
    composeOpen.value = false
    Object.assign(compose, { title: '', subject: '', message: '', filterTag: '' })
    await load()
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Broadcast failed.'
  } finally { sending.value = false }
}

onMounted(load)
</script>
