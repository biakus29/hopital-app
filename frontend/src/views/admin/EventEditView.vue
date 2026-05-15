<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
          <RouterLink to="/admin/events" class="hover:text-amber-600">Events</RouterLink>
          <span class="mx-2">/</span>
          <span>{{ isNew ? 'New' : 'Edit' }}</span>
        </p>
        <h2 class="mt-1 text-2xl font-black text-slate-900">{{ isNew ? 'Create a new event' : form.title || 'Edit event' }}</h2>
      </div>
      <div class="flex flex-wrap gap-2">
        <RouterLink to="/admin/events" class="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Cancel</RouterLink>
        <button type="button" class="rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600"
                :disabled="saving" @click="save">
          {{ saving ? 'Saving…' : 'Save event' }}
        </button>
      </div>
    </header>

    <div v-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{{ error }}</div>
    <div v-if="success" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{{ success }}</div>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="space-y-5 lg:col-span-2">
        <div class="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Title</label>
            <input v-model="form.title" type="text"
                   class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-bold outline-none ring-amber-500 focus:ring-2" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Description</label>
            <textarea v-model="form.description" rows="6"
                      class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-amber-500 focus:ring-2"></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Location</label>
            <input v-model="form.location" type="text" placeholder="e.g. St. Therese Hospital — Main Hall"
                   class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-amber-500 focus:ring-2" />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Starts at</label>
              <input v-model="form.startsAt" type="datetime-local"
                     class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Ends at (optional)</label>
              <input v-model="form.endsAt" type="datetime-local"
                     class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <!-- Promotion window -->
        <div class="rounded-3xl border border-amber-200 bg-amber-50/50 p-6">
          <div class="flex items-start gap-3">
            <span class="grid h-10 w-10 place-items-center rounded-xl bg-amber-500 text-white">⭐</span>
            <div class="flex-1">
              <h3 class="text-base font-black text-amber-900">Featured promotion window</h3>
              <p class="mt-1 text-sm text-amber-800">
                Highlight this event on the <strong>Home page</strong> and at the <strong>top of the blog</strong> during a precise window.
                Leave both empty for the default behavior (auto-featured 14 days before <em>Starts at</em>).
              </p>
            </div>
          </div>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-amber-900">Promote from</label>
              <input v-model="form.promoteFrom" type="datetime-local"
                     class="mt-2 w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-amber-900">Promote until</label>
              <input v-model="form.promoteUntil" type="datetime-local"
                     class="mt-2 w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm" />
            </div>
          </div>
        </div>
      </div>

      <aside class="space-y-5">
        <div class="rounded-3xl border border-slate-200 bg-white p-6">
          <ImageUpload v-model="form.coverImage" label="Cover image" />
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Status</label>
            <select v-model="form.status" class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="SCHEDULED">Scheduled</option>
              <option value="ONGOING">Ongoing</option>
              <option value="ENDED">Ended</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <label class="flex items-center gap-3">
            <input v-model="form.rsvpEnabled" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
            <span class="text-sm font-bold text-slate-700">Enable RSVP form</span>
          </label>
          <p v-if="form.rsvpCount > 0" class="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
            {{ form.rsvpCount }} people have registered.
          </p>
        </div>

        <button v-if="!isNew" type="button"
                class="w-full rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100"
                @click="confirmDelete">
          Delete event
        </button>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { api, ApiError } from '@/lib/api'
import { auth } from '@/stores/auth'
import ImageUpload from '@/components/admin/ImageUpload.vue'

const route = useRoute()
const router = useRouter()
const isNew = computed(() => !route.params.id)
const saving = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  title: '',
  description: '',
  location: '',
  startsAt: '',
  endsAt: '',
  coverImage: '',
  status: 'SCHEDULED',
  rsvpEnabled: true,
  rsvpCount: 0,
  promoteFrom: '',
  promoteUntil: ''
})

function toDatetimeLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
function fromDatetimeLocal(v) { return v ? new Date(v).toISOString() : null }

async function load() {
  if (isNew.value) return
  try {
    const list = await api.get('/events', { scope: 'all' })
    const e = list.find(x => String(x.id) === String(route.params.id))
    if (!e) throw new Error('Event not found')
    Object.assign(form, {
      ...e,
      startsAt:     toDatetimeLocal(e.startsAt),
      endsAt:       toDatetimeLocal(e.endsAt),
      promoteFrom:  toDatetimeLocal(e.promoteFrom),
      promoteUntil: toDatetimeLocal(e.promoteUntil)
    })
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Could not load this event.'
  }
}

async function save() {
  error.value = ''
  success.value = ''
  if (!form.title || form.title.length < 3) { error.value = 'Title must be at least 3 characters.'; return }
  if (!form.description) { error.value = 'Description is required.'; return }
  if (!form.startsAt) { error.value = 'Start date is required.'; return }

  saving.value = true
  try {
    const payload = {
      title: form.title,
      description: form.description,
      location: form.location || null,
      startsAt: fromDatetimeLocal(form.startsAt),
      endsAt: fromDatetimeLocal(form.endsAt),
      coverImage: form.coverImage || null,
      status: form.status,
      rsvpEnabled: !!form.rsvpEnabled,
      promoteFrom: fromDatetimeLocal(form.promoteFrom),
      promoteUntil: fromDatetimeLocal(form.promoteUntil)
    }
    if (isNew.value) {
      const created = await api.post('/events', payload, { token: auth.token.value })
      router.replace(`/admin/events/${created.id}`)
    } else {
      await api.put(`/events/${route.params.id}`, payload, { token: auth.token.value })
    }
    success.value = 'Event saved.'
    setTimeout(() => (success.value = ''), 2500)
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Save failed.'
  } finally { saving.value = false }
}

async function confirmDelete() {
  if (!confirm('Delete this event permanently (and its RSVPs)?')) return
  await api.delete(`/events/${route.params.id}`, { token: auth.token.value })
  router.push('/admin/events')
}

onMounted(load)
</script>
