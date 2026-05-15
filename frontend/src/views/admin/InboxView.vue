<template>
  <div class="space-y-6">
    <header>
      <h2 class="text-2xl font-black text-slate-900">Inbox</h2>
      <p class="text-sm text-slate-500">All interactions submitted from the public site.</p>
    </header>

    <div class="flex flex-wrap gap-2">
      <button v-for="t in tabs" :key="t.id"
              :class="[
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition',
                tab === t.id ? 'bg-teal-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
              ]"
              @click="tab = t.id">
        <component :is="t.icon" :size="14" />
        {{ t.label }}
        <span v-if="counts[t.id] != null" class="rounded-full bg-black/15 px-2 py-0.5 text-[10px]">{{ counts[t.id] }}</span>
      </button>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white">
      <div v-if="loading" class="p-8 text-center text-sm text-slate-500">Loading…</div>
      <div v-else-if="!items.length" class="p-12 text-center">
        <p class="text-3xl">📭</p>
        <p class="mt-3 font-bold">Nothing yet</p>
      </div>

      <!-- Contacts -->
      <ul v-else-if="tab === 'contacts'" class="divide-y divide-slate-100">
        <li v-for="m in items" :key="m.id" class="p-5">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="font-bold text-slate-900">{{ m.name }} <span class="text-slate-500 font-normal">· {{ m.email }}</span></p>
              <p class="mt-0.5 text-[11px] text-slate-500">{{ m.subject }} · {{ formatDateTime(m.createdAt) }}</p>
              <p class="mt-2 whitespace-pre-wrap text-sm text-slate-700">{{ m.message }}</p>
            </div>
            <div class="flex items-center gap-2">
              <a :href="`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`" class="rounded-full bg-teal-600 px-3 py-1.5 text-xs font-bold text-white">Reply</a>
              <button type="button" class="rounded-lg p-2 text-rose-500 hover:bg-rose-50" @click="remove('contacts', m.id)"><Trash2 :size="16" /></button>
            </div>
          </div>
        </li>
      </ul>

      <!-- Appointments -->
      <table v-else-if="tab === 'appointments'" class="w-full text-left text-sm">
        <thead class="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500">
          <tr>
            <th class="px-4 py-3">Patient</th>
            <th class="px-4 py-3">Service</th>
            <th class="px-4 py-3">When</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="a in items" :key="a.id" class="hover:bg-slate-50">
            <td class="px-4 py-3">
              <p class="font-bold">{{ a.name }}</p>
              <p class="text-[11px] text-slate-500">{{ a.phone }} {{ a.email ? '· ' + a.email : '' }}</p>
            </td>
            <td class="px-4 py-3">{{ a.service }}</td>
            <td class="px-4 py-3">{{ a.date }} · {{ a.time }}</td>
            <td class="px-4 py-3">
              <select :value="a.status" @change="setStatus(a, $event.target.value)" class="rounded-lg border border-slate-200 px-2 py-1 text-xs">
                <option>PENDING</option><option>CONFIRMED</option><option>DONE</option><option>CANCELLED</option>
              </select>
            </td>
            <td class="px-4 py-3 text-right">
              <button type="button" class="rounded-lg p-2 text-rose-500 hover:bg-rose-50" @click="remove('appointments', a.id)"><Trash2 :size="16" /></button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Satisfaction -->
      <ul v-else-if="tab === 'satisfaction'" class="divide-y divide-slate-100">
        <li v-for="s in items" :key="s.id" class="p-5">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="font-bold text-slate-900">
                <span class="mr-2 text-amber-500">{{ '★'.repeat(s.rating) }}<span class="text-slate-300">{{ '★'.repeat(5 - s.rating) }}</span></span>
                {{ s.name }}
              </p>
              <p class="text-[11px] text-slate-500">{{ s.phone }} {{ s.email ? '· ' + s.email : '' }} · {{ formatDateTime(s.createdAt) }}</p>
              <p v-if="s.consentToPublish" class="mt-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">Consent to publish ✓</p>
              <p class="mt-2 text-sm text-slate-700">{{ s.comment }}</p>
            </div>
            <button type="button" class="rounded-lg p-2 text-rose-500 hover:bg-rose-50" @click="remove('satisfaction', s.id)"><Trash2 :size="16" /></button>
          </div>
        </li>
      </ul>

      <!-- RSVPs -->
      <table v-else-if="tab === 'rsvps'" class="w-full text-left text-sm">
        <thead class="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500">
          <tr>
            <th class="px-4 py-3">Attendee</th>
            <th class="px-4 py-3">Event</th>
            <th class="px-4 py-3">When</th>
            <th class="px-4 py-3">Registered</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="r in items" :key="r.id" class="hover:bg-slate-50">
            <td class="px-4 py-3">
              <p class="font-bold">{{ r.name || '—' }}</p>
              <p class="text-[11px] text-slate-500">+{{ r.phone }}</p>
            </td>
            <td class="px-4 py-3">{{ r.event?.title || '—' }}</td>
            <td class="px-4 py-3">{{ formatDateTime(r.event?.startsAt) }}</td>
            <td class="px-4 py-3 text-slate-500">{{ formatDateTime(r.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { MessageSquare, Calendar, Star, UserCheck, Trash2 } from 'lucide-vue-next'
import { api } from '@/lib/api'
import { auth } from '@/stores/auth'

const tabs = [
  { id: 'contacts',     label: 'Contact messages', icon: MessageSquare },
  { id: 'appointments', label: 'Appointments',     icon: Calendar },
  { id: 'satisfaction', label: 'Satisfaction',     icon: Star },
  { id: 'rsvps',        label: 'Event RSVPs',      icon: UserCheck }
]

const tab = ref('contacts')
const items = ref([])
const loading = ref(true)
const counts = ref({})

function formatDateTime(v) {
  if (!v) return ''
  return new Date(v).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

async function load() {
  loading.value = true
  try {
    items.value = await api.get(`/inbox/${tab.value}`, undefined, { token: auth.token.value })
  } finally { loading.value = false }
}

async function loadCounts() {
  try {
    const s = await api.get('/inbox/summary', undefined, { token: auth.token.value })
    counts.value = {
      contacts: s.contacts,
      appointments: s.appointments,
      satisfaction: s.satisfaction
    }
  } catch { counts.value = {} }
}

async function remove(kind, id) {
  if (!confirm('Delete this entry?')) return
  await api.delete(`/inbox/${kind}/${id}`, { token: auth.token.value })
  load(); loadCounts()
}

async function setStatus(a, status) {
  await api.put(`/inbox/appointments/${a.id}/status`, { status }, { token: auth.token.value })
  load()
}

watch(tab, load)
onMounted(() => { load(); loadCounts() })
</script>
