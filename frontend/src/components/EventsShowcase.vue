<template>
  <section v-if="events.length" :class="rootClass">
    <div class="mx-auto max-w-7xl px-4">
      <header class="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-amber-800">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-600"></span>
            {{ eyebrow }}
          </p>
          <h2 class="mt-3 text-3xl font-black text-slate-900 md:text-4xl">{{ title }}</h2>
          <p v-if="subtitle" class="mt-2 max-w-2xl text-slate-600">{{ subtitle }}</p>
        </div>
        <RouterLink to="/blog" class="text-sm font-bold text-teal-700 hover:text-teal-800">All events &rarr;</RouterLink>
      </header>

      <!-- Hero event: the closest one -->
      <article
        v-if="hero"
        class="group relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-teal-50 shadow-xl"
      >
        <div class="grid gap-0 lg:grid-cols-5">
          <div class="relative lg:col-span-3">
            <img
              :src="resolveImage(hero.coverImage)"
              :alt="hero.title"
              class="h-72 w-full object-cover lg:h-full"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-transparent lg:bg-gradient-to-l"></div>
            <div class="absolute left-5 top-5 flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-white shadow-lg">
                ⭐ Featured event
              </span>
              <span v-if="daysUntil(hero.startsAt) <= 7" class="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-white shadow-lg">
                ⏳ This week
              </span>
            </div>
          </div>

          <div class="flex flex-col justify-between gap-6 p-7 lg:col-span-2 lg:p-10">
            <div>
              <p class="text-[11px] font-black uppercase tracking-widest text-amber-700">{{ formatDateBadge(hero.startsAt) }}</p>
              <h3 class="mt-2 text-2xl font-black leading-tight text-slate-900 md:text-3xl">{{ hero.title }}</h3>
              <p class="mt-3 line-clamp-4 text-sm text-slate-600">{{ hero.description }}</p>

              <dl class="mt-6 space-y-2 text-sm text-slate-700">
                <div class="flex items-center gap-2">
                  <span class="text-amber-700">🕐</span>
                  <span>{{ formatDateTime(hero.startsAt) }}</span>
                </div>
                <div v-if="hero.location" class="flex items-center gap-2">
                  <span class="text-amber-700">📍</span>
                  <span>{{ hero.location }}</span>
                </div>
                <div v-if="hero.rsvpCount > 0" class="flex items-center gap-2">
                  <span class="text-amber-700">👥</span>
                  <span>{{ hero.rsvpCount }} registered</span>
                </div>
              </dl>
            </div>

            <!-- Countdown -->
            <div v-if="hero.countdown" class="grid grid-cols-4 gap-2 text-center">
              <div v-for="block in [
                { label: 'Days',    value: hero.countdown.days },
                { label: 'Hours',   value: hero.countdown.hours },
                { label: 'Minutes', value: hero.countdown.minutes },
                { label: 'Seconds', value: hero.countdown.seconds }
              ]" :key="block.label"
                class="rounded-xl bg-slate-900 px-2 py-3 text-white"
              >
                <p class="text-2xl font-black tabular-nums">{{ String(block.value).padStart(2, '0') }}</p>
                <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">{{ block.label }}</p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <button
                v-if="hero.rsvpEnabled"
                type="button"
                class="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-amber-500/30 transition hover:bg-amber-600"
                @click="openRsvp(hero)"
              >
                ✓ RSVP now
              </button>
              <RouterLink :to="`/blog`" class="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100">
                Learn more
              </RouterLink>
            </div>
          </div>
        </div>
      </article>

      <!-- Other events as cards -->
      <div v-if="otherEvents.length" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="event in otherEvents"
          :key="event.id"
          class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div class="flex items-start justify-between gap-3">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-amber-800">
              📅 Event
            </span>
            <div class="flex-shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-center">
              <p class="text-[9px] font-black uppercase tracking-widest text-slate-500">{{ shortMonth(event.startsAt) }}</p>
              <p class="text-lg font-black leading-none text-slate-900">{{ shortDay(event.startsAt) }}</p>
            </div>
          </div>
          <h4 class="mt-3 text-base font-black text-slate-900 line-clamp-2">{{ event.title }}</h4>
          <p class="mt-1 text-xs text-slate-500">{{ formatDateTime(event.startsAt) }}</p>
          <p v-if="event.location" class="text-xs text-slate-500">📍 {{ event.location }}</p>
          <p class="mt-3 line-clamp-2 flex-1 text-sm text-slate-600">{{ event.description }}</p>
          <button
            v-if="event.rsvpEnabled"
            type="button"
            class="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800"
            @click="openRsvp(event)"
          >
            RSVP
          </button>
        </article>
      </div>
    </div>

    <!-- RSVP modal -->
    <Transition name="fade">
      <div v-if="rsvpEvent" class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center" @click.self="closeRsvp">
        <div class="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <p class="text-[11px] font-black uppercase tracking-widest text-amber-700">RSVP</p>
              <h3 class="mt-1 text-xl font-black text-slate-900">{{ rsvpEvent.title }}</h3>
              <p class="mt-1 text-sm text-slate-500">{{ formatDateTime(rsvpEvent.startsAt) }}</p>
            </div>
            <button type="button" class="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200" aria-label="Close" @click="closeRsvp">✕</button>
          </div>

          <div v-if="rsvpSuccess" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
            <p class="text-lg font-bold">✓ Registered!</p>
            <p class="mt-2 text-sm">You'll receive a WhatsApp confirmation and a reminder before the event.</p>
            <button type="button" class="mt-4 text-sm font-bold underline" @click="closeRsvp">Close</button>
          </div>

          <form v-else class="space-y-3" @submit.prevent="submitRsvp">
            <input
              v-model="rsvpForm.name"
              type="text"
              placeholder="Your name"
              required
              class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-teal-500 focus:ring-2"
            />
            <input
              v-model="rsvpForm.phone"
              type="tel"
              placeholder="Phone (+237 …)"
              required
              class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-teal-500 focus:ring-2"
            />
            <p v-if="rsvpError" class="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{{ rsvpError }}</p>
            <button
              type="submit"
              :disabled="rsvpLoading"
              class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-sm font-black text-white hover:bg-amber-600 disabled:opacity-60"
            >
              {{ rsvpLoading ? 'Registering…' : 'Confirm RSVP' }}
            </button>
            <p class="text-[11px] text-slate-500">
              By registering you agree to receive event-related notifications. Reply STOP any time to opt out.
            </p>
          </form>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api, ApiError } from '@/lib/api'

const props = defineProps({
  variant: { type: String, default: 'showcase' }, // 'showcase' (home) | 'compact' (blog)
  eyebrow: { type: String, default: 'Live at the hospital' },
  title:   { type: String, default: 'Events in focus' },
  subtitle:{ type: String, default: 'Reserve your spot, get reminders by WhatsApp, and join the next moment with our community.' }
})

const rootClass = computed(() =>
  props.variant === 'compact'
    ? 'py-10'
    : 'py-16 bg-gradient-to-b from-amber-50/50 to-white'
)

const events = ref([])
let tickInterval = null

const hero = computed(() => {
  const e = events.value[0]
  if (!e) return null
  return { ...e, countdown: computeCountdown(e.startsAt) }
})
const otherEvents = computed(() => events.value.slice(1, 4))

function computeCountdown(startsAt) {
  if (!startsAt) return null
  const diff = new Date(startsAt).getTime() - Date.now()
  if (diff <= 0) return null
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)
  return { days, hours, minutes, seconds }
}

function daysUntil(dt) {
  if (!dt) return 999
  return Math.max(0, Math.ceil((new Date(dt).getTime() - Date.now()) / 86_400_000))
}

function resolveImage(path) {
  if (!path) return '/images/banners/1.jpg'
  return path.replace(/^\/assets\//, '/')
}

function formatDateTime(value) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}
function formatDateBadge(value) {
  if (!value) return ''
  const d = new Date(value)
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long' }).toUpperCase()
}
function shortMonth(value) { return new Date(value).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase() }
function shortDay(value)   { return new Date(value).getDate() }

// ---- RSVP modal ----
const rsvpEvent = ref(null)
const rsvpForm = reactive({ name: '', phone: '' })
const rsvpLoading = ref(false)
const rsvpSuccess = ref(false)
const rsvpError = ref('')

function openRsvp(event) {
  rsvpEvent.value = event
  rsvpSuccess.value = false
  rsvpError.value = ''
  rsvpForm.name = ''
  rsvpForm.phone = ''
}
function closeRsvp() { rsvpEvent.value = null }

async function submitRsvp() {
  rsvpError.value = ''
  rsvpLoading.value = true
  try {
    await api.post(`/events/${rsvpEvent.value.id}/rsvp`, {
      name: rsvpForm.name.trim(),
      phone: rsvpForm.phone.trim()
    })
    rsvpSuccess.value = true
  } catch (err) {
    rsvpError.value = err instanceof ApiError ? err.message : 'Could not register. Try again later.'
  } finally {
    rsvpLoading.value = false
  }
}

// ---- Data loading ----
async function loadEvents() {
  try {
    const data = await api.get('/events/promoted')
    events.value = Array.isArray(data) ? data : []
  } catch {
    events.value = []
  }
}

onMounted(async () => {
  await loadEvents()
  tickInterval = setInterval(() => {
    // Force reactive recomputation of `hero.countdown` by reassigning events
    events.value = [...events.value]
  }, 1000)
})
onBeforeUnmount(() => { if (tickInterval) clearInterval(tickInterval) })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
</style>
