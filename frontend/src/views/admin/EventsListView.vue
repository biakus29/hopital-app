<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-black text-slate-900">Events</h2>
        <p class="text-sm text-slate-500">Schedule events, control promotion windows, collect RSVPs.</p>
      </div>
      <RouterLink to="/admin/events/new" class="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600">
        <Plus :size="16" /> New event
      </RouterLink>
    </header>

    <div class="rounded-2xl border border-slate-200 bg-white">
      <div v-if="loading" class="p-8 text-center text-sm text-slate-500">Loading…</div>
      <div v-else-if="!events.length" class="p-12 text-center">
        <p class="text-3xl">📅</p>
        <p class="mt-3 font-bold text-slate-900">No events yet</p>
        <p class="mt-1 text-sm text-slate-500">Create one to promote it on the home page and blog.</p>
      </div>
      <table v-else class="w-full text-left text-sm">
        <thead class="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500">
          <tr>
            <th class="px-4 py-3">Event</th>
            <th class="px-4 py-3">Date</th>
            <th class="px-4 py-3">Promotion</th>
            <th class="px-4 py-3">RSVP</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="e in events" :key="e.id" class="hover:bg-slate-50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img v-if="e.coverImage" :src="e.coverImage" :alt="e.title" class="h-10 w-10 rounded-lg object-cover" />
                <div v-else class="grid h-10 w-10 place-items-center rounded-lg bg-amber-100 text-amber-600">📅</div>
                <div class="min-w-0">
                  <p class="truncate font-bold text-slate-900">{{ e.title }}</p>
                  <p class="truncate text-[11px] text-slate-500">{{ e.location || 'No location' }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-slate-600">{{ formatDateTime(e.startsAt) }}</td>
            <td class="px-4 py-3">
              <span v-if="isPromoted(e)" class="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-amber-800">⭐ Featured now</span>
              <span v-else class="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-600">Idle</span>
            </td>
            <td class="px-4 py-3 text-slate-600">{{ e.rsvpCount }} {{ e.rsvpEnabled ? '' : '(closed)' }}</td>
            <td class="px-4 py-3">
              <div class="flex justify-end gap-2">
                <RouterLink :to="`/admin/events/${e.id}`" class="rounded-lg p-2 text-slate-500 hover:bg-slate-100" title="Edit">
                  <Pencil :size="16" />
                </RouterLink>
                <button type="button" class="rounded-lg p-2 text-rose-500 hover:bg-rose-50" title="Delete" @click="toDelete = e">
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
        <p class="text-lg font-black">Delete event?</p>
        <p class="mt-2 text-sm text-slate-600">"{{ toDelete.title }}" will be permanently removed (along with its RSVPs).</p>
        <div class="mt-5 flex justify-end gap-2">
          <button type="button" class="rounded-full px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100" @click="toDelete = null">Cancel</button>
          <button type="button" class="rounded-full bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-700" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { api } from '@/lib/api'
import { auth } from '@/stores/auth'

const events = ref([])
const loading = ref(true)
const toDelete = ref(null)

function formatDateTime(v) {
  if (!v) return ''
  const d = new Date(v); return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}
function isPromoted(e) {
  const now = Date.now()
  if (e.promoteFrom && e.promoteUntil) {
    return new Date(e.promoteFrom).getTime() <= now && now <= new Date(e.promoteUntil).getTime()
  }
  if (!e.promoteFrom && !e.promoteUntil && e.startsAt) {
    const diff = new Date(e.startsAt).getTime() - now
    return diff > 0 && diff <= 14 * 24 * 3600 * 1000
  }
  return false
}

async function load() {
  loading.value = true
  try {
    events.value = await api.get('/events', { scope: 'all' })
  } finally { loading.value = false }
}
async function confirmDelete() {
  const e = toDelete.value
  toDelete.value = null
  await api.delete(`/events/${e.id}`, { token: auth.token.value })
  await load()
}
onMounted(load)
</script>
