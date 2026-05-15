<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-black text-slate-900">Subscribers</h2>
        <p class="text-sm text-slate-500">People opted-in to receive your broadcasts.</p>
      </div>
    </header>

    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-4">
        <p class="text-2xl font-black">{{ stats.total }}</p>
        <p class="text-[10px] uppercase tracking-widest text-slate-500">Total</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4">
        <p class="text-2xl font-black text-emerald-700">{{ stats.active }}</p>
        <p class="text-[10px] uppercase tracking-widest text-slate-500">Active</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4">
        <p class="text-2xl font-black text-rose-700">{{ stats.unsubscribed }}</p>
        <p class="text-[10px] uppercase tracking-widest text-slate-500">Unsubscribed</p>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white">
      <div class="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3">
        <input v-model="search" type="search" placeholder="Search by phone or name…"
               class="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" @input="reload" />
        <select v-model="statusFilter" class="rounded-xl border border-slate-200 px-3 py-2 text-sm" @change="reload">
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="UNSUBSCRIBED">Unsubscribed</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      <div v-if="loading" class="p-8 text-center text-sm text-slate-500">Loading…</div>
      <div v-else-if="!items.length" class="p-12 text-center">
        <p class="text-3xl">👥</p>
        <p class="mt-3 font-bold">No subscribers yet</p>
      </div>
      <table v-else class="w-full text-left text-sm">
        <thead class="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500">
          <tr>
            <th class="px-4 py-3">Contact</th>
            <th class="px-4 py-3">Channels</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Joined</th>
            <th class="px-4 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="s in items" :key="s.id" class="hover:bg-slate-50">
            <td class="px-4 py-3">
              <p class="font-bold text-slate-900">{{ s.name || '—' }}</p>
              <p class="text-[11px] text-slate-500">{{ s.phone ? '+' + s.phone : '' }} {{ s.phone && s.email ? '·' : '' }} {{ s.email || '' }}</p>
              <p v-if="s.source" class="mt-0.5 text-[10px] uppercase tracking-widest text-slate-400">{{ s.source }}</p>
            </td>
            <td class="px-4 py-3 text-xs">
              <span v-if="s.optInWhatsapp" class="mr-1 rounded bg-emerald-100 px-2 py-0.5 font-bold text-emerald-700">WA</span>
              <span v-if="s.optInSms"      class="mr-1 rounded bg-amber-100 px-2 py-0.5 font-bold text-amber-700">SMS</span>
              <span v-if="s.optInEmail"    class="mr-1 rounded bg-blue-100 px-2 py-0.5 font-bold text-blue-700">Email</span>
            </td>
            <td class="px-4 py-3">
              <span :class="[
                'rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest',
                s.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                s.status === 'UNSUBSCRIBED' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
              ]">{{ s.status }}</span>
            </td>
            <td class="px-4 py-3 text-slate-600">{{ formatDate(s.joinedAt) }}</td>
            <td class="px-4 py-3 text-right">
              <button type="button" class="rounded-lg p-2 text-rose-500 hover:bg-rose-50" @click="remove(s)">
                <Trash2 :size="16" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-slate-100 p-3 text-sm">
        <span class="text-slate-500">Page {{ page }} / {{ totalPages }}</span>
        <div class="flex gap-2">
          <button type="button" class="rounded-full border border-slate-300 px-3 py-1 text-xs font-bold hover:bg-slate-50"
                  :disabled="page === 1" @click="page--; reload()">Previous</button>
          <button type="button" class="rounded-full bg-teal-600 px-3 py-1 text-xs font-bold text-white hover:bg-teal-700"
                  :disabled="page === totalPages" @click="page++; reload()">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import { api } from '@/lib/api'
import { auth } from '@/stores/auth'

const items = ref([])
const stats = ref({ total: 0, active: 0, unsubscribed: 0 })
const loading = ref(true)
const search = ref('')
const statusFilter = ref('')
const page = ref(1)
const totalPages = ref(1)

function formatDate(v) { if (!v) return ''; const d = new Date(v); return d.toLocaleDateString('en-GB', { dateStyle: 'medium' }) }

async function reload() {
  loading.value = true
  try {
    const [list, s] = await Promise.all([
      api.get('/subscribers', { page: page.value, limit: 50, status: statusFilter.value, search: search.value }, { token: auth.token.value }),
      api.get('/subscribers/stats', undefined, { token: auth.token.value })
    ])
    items.value = list.items
    totalPages.value = list.totalPages
    stats.value = s
  } finally { loading.value = false }
}

async function remove(s) {
  if (!confirm(`Remove ${s.phone || s.email}?`)) return
  await api.delete(`/subscribers/${s.id}`, { token: auth.token.value })
  reload()
}

onMounted(reload)
</script>
