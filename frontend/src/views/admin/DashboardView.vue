<template>
  <div class="space-y-8">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-black text-slate-900">Welcome back, {{ admin?.name || 'Admin' }} 👋</h2>
        <p class="text-sm text-slate-500">Live snapshot of activity at the hospital site.</p>
      </div>
      <div class="flex gap-2">
        <RouterLink to="/admin/posts/new" class="inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700">
          <FileText :size="16" /> New article
        </RouterLink>
        <RouterLink to="/admin/events/new" class="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600">
          <Calendar :size="16" /> New event
        </RouterLink>
      </div>
    </header>

    <section v-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{{ error }}</section>

    <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Published articles"  :value="stats.publishedPosts"    :icon="FileText"  accent="teal"  hint="On the public blog" />
      <StatCard label="Upcoming events"     :value="stats.upcomingEvents"     :icon="Calendar"  accent="amber" hint="Visible at /blog and /home" />
      <StatCard label="Active subscribers"  :value="stats.activeSubscribers"  :icon="Users"     accent="blue"  hint="Opt-in WhatsApp/Email/SMS" />
      <StatCard label="Broadcasts sent"     :value="stats.broadcastsSent"     :icon="Send"      accent="rose"  hint="All-time" />
    </section>

    <section class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-black text-slate-900">Recent broadcasts</h3>
          <RouterLink to="/admin/broadcasts" class="text-xs font-bold text-teal-700 hover:text-teal-800">View all →</RouterLink>
        </header>
        <div v-if="recentBroadcasts.length" class="divide-y divide-slate-100">
          <article v-for="b in recentBroadcasts" :key="b.id" class="flex items-center justify-between gap-3 py-3">
            <div class="min-w-0">
              <p class="truncate text-sm font-bold text-slate-900">{{ b.title || b.message.slice(0, 60) }}</p>
              <p class="mt-1 text-[11px] text-slate-500">{{ formatDateTime(b.createdAt) }} · {{ b.sentCount }}/{{ b.totalCount }} sent · {{ b.failedCount }} failed</p>
            </div>
            <span :class="['rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest', statusClass(b.status)]">{{ b.status }}</span>
          </article>
        </div>
        <p v-else class="py-8 text-center text-sm text-slate-500">No broadcasts yet. Create one to engage your subscribers.</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-black text-slate-900">Channels</h3>
        </header>
        <ul class="space-y-3 text-sm">
          <li class="flex items-center justify-between">
            <span class="flex items-center gap-2"><MessagesSquare :size="16" class="text-emerald-600" /> WhatsApp</span>
            <span :class="badgeClass(channels.whatsapp?.ready)">{{ channels.whatsapp?.ready ? 'Ready' : channels.whatsapp?.enabled ? 'Connecting…' : 'Off' }}</span>
          </li>
          <li class="flex items-center justify-between">
            <span class="flex items-center gap-2"><Mail :size="16" class="text-blue-600" /> Email</span>
            <span :class="badgeClass(channels.email?.enabled)">{{ channels.email?.enabled ? 'Ready' : 'Off' }}</span>
          </li>
          <li class="flex items-center justify-between">
            <span class="flex items-center gap-2"><Phone :size="16" class="text-amber-600" /> SMS</span>
            <span :class="badgeClass(channels.sms?.configured)">{{ channels.sms?.configured ? 'Ready' : 'Off' }}</span>
          </li>
        </ul>
        <div class="mt-5 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500">
          Configure providers in <code>backend/.env</code> and restart the API.
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-black text-slate-900">Inbox</h3>
          <RouterLink to="/admin/inbox" class="text-xs font-bold text-teal-700 hover:text-teal-800">Open inbox →</RouterLink>
        </header>
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-xl bg-slate-50 p-3">
            <p class="text-2xl font-black text-slate-900">{{ inbox.contacts || 0 }}</p>
            <p class="text-[10px] uppercase tracking-widest text-slate-500">Contact messages</p>
          </div>
          <div class="rounded-xl bg-slate-50 p-3">
            <p class="text-2xl font-black text-slate-900">{{ inbox.appointments || 0 }}</p>
            <p class="text-[10px] uppercase tracking-widest text-slate-500">Appointments</p>
          </div>
          <div class="rounded-xl bg-slate-50 p-3">
            <p class="text-2xl font-black text-slate-900">{{ inbox.satisfaction || 0 }}</p>
            <p class="text-[10px] uppercase tracking-widest text-slate-500">Satisfaction</p>
          </div>
          <div class="rounded-xl bg-slate-50 p-3">
            <p class="text-2xl font-black text-slate-900">{{ inbox.rsvps || 0 }}</p>
            <p class="text-[10px] uppercase tracking-widest text-slate-500">Event RSVPs</p>
          </div>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-black text-slate-900">Quick links</h3>
        <div class="mt-4 grid grid-cols-2 gap-3">
          <RouterLink v-for="a in quickActions" :key="a.to" :to="a.to"
            class="group flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-700 hover:border-teal-300 hover:bg-teal-50">
            <span :class="['grid h-9 w-9 place-items-center rounded-lg', a.bg]">
              <component :is="a.icon" :size="16" :class="a.text" />
            </span>
            {{ a.label }}
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  FileText, Calendar, Users, Send, Mail, Phone, MessagesSquare, Image as ImageIcon, Inbox, Settings
} from 'lucide-vue-next'
import { api, ApiError } from '@/lib/api'
import { auth } from '@/stores/auth'
import StatCard from '@/components/admin/StatCard.vue'

const admin = computed(() => auth.admin.value)
const error = ref('')

const stats = ref({ activeSubscribers: 0, publishedPosts: 0, upcomingEvents: 0, broadcastsSent: 0 })
const recentBroadcasts = ref([])
const channels = ref({})
const inbox = ref({ contacts: 0, appointments: 0, satisfaction: 0, rsvps: 0 })

const quickActions = [
  { to: '/admin/posts',       label: 'Manage articles',  icon: FileText,  bg: 'bg-teal-50',  text: 'text-teal-600' },
  { to: '/admin/events',      label: 'Manage events',    icon: Calendar,  bg: 'bg-amber-50', text: 'text-amber-600' },
  { to: '/admin/broadcasts',  label: 'New broadcast',    icon: Send,      bg: 'bg-rose-50',  text: 'text-rose-600' },
  { to: '/admin/uploads',     label: 'Media library',    icon: ImageIcon, bg: 'bg-blue-50',  text: 'text-blue-600' },
  { to: '/admin/subscribers', label: 'Subscribers',      icon: Users,     bg: 'bg-blue-50',  text: 'text-blue-600' },
  { to: '/admin/settings',    label: 'Settings',         icon: Settings,  bg: 'bg-slate-100',text: 'text-slate-600' }
]

function formatDateTime(v) {
  if (!v) return ''
  const d = new Date(v); return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}
function statusClass(s) {
  if (s === 'SENT')    return 'bg-emerald-100 text-emerald-800'
  if (s === 'SENDING') return 'bg-blue-100 text-blue-800'
  if (s === 'FAILED')  return 'bg-rose-100 text-rose-800'
  return 'bg-slate-100 text-slate-700'
}
function badgeClass(on) {
  return on
    ? 'rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-emerald-700'
    : 'rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-500'
}

async function load() {
  error.value = ''
  try {
    const [dashboard, inboxSummary] = await Promise.all([
      api.get('/status/dashboard', undefined, { token: auth.token.value }),
      api.get('/inbox/summary', undefined, { token: auth.token.value }).catch(() => ({}))
    ])
    stats.value = dashboard.stats
    recentBroadcasts.value = dashboard.recentBroadcasts || []
    channels.value = dashboard.channels || {}
    inbox.value = {
      contacts: inboxSummary.contacts || 0,
      appointments: inboxSummary.appointments || 0,
      satisfaction: inboxSummary.satisfaction || 0,
      rsvps: inboxSummary.lastRsvpAt ? 1 : 0
    }
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Could not load dashboard data.'
  }
}

onMounted(load)
</script>
