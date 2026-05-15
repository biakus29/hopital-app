<template>
  <section :class="['relative overflow-hidden rounded-3xl p-6 md:p-10', themeClass]">
    <div class="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-16 -left-12 h-52 w-52 rounded-full bg-white/10 blur-3xl"></div>

    <div class="relative">
      <p class="text-xs font-black uppercase tracking-[0.22em] text-teal-200">Stay informed</p>
      <h3 class="mt-2 text-2xl md:text-3xl font-black text-white">{{ title }}</h3>
      <p class="mt-2 max-w-xl text-sm text-teal-50">{{ subtitle }}</p>

      <form v-if="!sent" class="mt-6 space-y-4" @submit.prevent="submit">
        <div class="grid gap-3 sm:grid-cols-2">
          <input
            v-model="form.name"
            type="text"
            placeholder="Your name (optional)"
            class="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-teal-100/60 outline-none ring-teal-300 focus:ring-2"
          />
          <input
            v-model="form.phone"
            type="tel"
            placeholder="Phone (+237 …)"
            class="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-teal-100/60 outline-none ring-teal-300 focus:ring-2"
          />
        </div>
        <input
          v-model="form.email"
          type="email"
          placeholder="Email address"
          class="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-teal-100/60 outline-none ring-teal-300 focus:ring-2"
        />

        <div>
          <p class="mb-2 text-xs font-bold uppercase tracking-widest text-teal-100/80">Channels</p>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="ch in availableChannels"
              :key="ch.value"
              :class="[
                'inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                selected.has(ch.value) ? 'border-white bg-white text-teal-900' : 'border-white/30 bg-white/5 text-white hover:bg-white/10'
              ]"
            >
              <input type="checkbox" class="sr-only" :value="ch.value" :checked="selected.has(ch.value)" @change="toggle(ch.value)" />
              {{ ch.label }}
            </label>
          </div>
        </div>

        <div v-if="error" class="rounded-xl border border-amber-300/40 bg-amber-100/10 px-4 py-2 text-sm text-amber-100">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-teal-900 transition hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ loading ? 'Subscribing…' : 'Subscribe' }}
        </button>

        <p class="text-[11px] text-teal-100/70">
          We respect your privacy. Reply <strong>STOP</strong> any time on WhatsApp/SMS or contact us by email to unsubscribe.
        </p>
      </form>

      <div v-else class="mt-6 rounded-2xl border border-white/20 bg-white/10 p-6">
        <p class="text-base font-bold text-white">Thank you for subscribing! ✓</p>
        <p class="mt-2 text-sm text-teal-50">
          A confirmation will reach you on the channels you chose. Reply <strong>EVENTS</strong> on WhatsApp to discover upcoming events.
        </p>
        <button type="button" class="mt-4 text-sm font-bold text-white underline" @click="reset">Subscribe another contact</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { api, ApiError } from '@/lib/api'

const props = defineProps({
  title:    { type: String, default: 'Health tips, events and announcements' },
  subtitle: { type: String, default: 'Receive notifications by WhatsApp, SMS or email — your choice. Unsubscribe any time.' },
  theme:    { type: String, default: 'teal' },          // teal | dark
  source:   { type: String, default: 'website-newsletter' },
  tags:     { type: Array,  default: () => [] }
})

const themeClass = computed(() =>
  props.theme === 'dark'
    ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white'
    : 'bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 text-white'
)

const availableChannels = [
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'EMAIL',    label: 'Email' },
  { value: 'SMS',      label: 'SMS' }
]

const form = reactive({ name: '', phone: '', email: '' })
const selected = ref(new Set(['WHATSAPP']))
const loading = ref(false)
const sent = ref(false)
const error = ref('')

function toggle(value) {
  if (selected.value.has(value)) selected.value.delete(value)
  else selected.value.add(value)
  // Force reactivity by replacing the Set instance
  selected.value = new Set(selected.value)
}

function reset() {
  form.name = ''; form.phone = ''; form.email = ''
  selected.value = new Set(['WHATSAPP'])
  sent.value = false
  error.value = ''
}

async function submit() {
  error.value = ''
  const channels = [...selected.value]
  if (!channels.length) return (error.value = 'Pick at least one channel.')
  const hasContact = (channels.some(c => c === 'WHATSAPP' || c === 'SMS') && form.phone.trim()) ||
                     (channels.includes('EMAIL') && form.email.trim())
  if (!hasContact) return (error.value = 'Provide a phone for WhatsApp/SMS or an email for Email.')

  loading.value = true
  try {
    await api.post('/subscribers/subscribe', {
      name:   form.name.trim() || undefined,
      phone:  form.phone.trim() || undefined,
      email:  form.email.trim() || undefined,
      tags:   props.tags,
      source: props.source,
      channels
    })
    sent.value = true
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Subscription failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
