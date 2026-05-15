<script setup>
import { ref, reactive } from 'vue'

const sent = ref(false)
const loading = ref(false)
const sendingSatisfaction = ref(false)
const satisfactionMessage = ref('')
const satisfactionError = ref(false)

const form = reactive({
  service: '',
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  notes: ''
})

const satisfaction = reactive({
  name: '',
  phone: '',
  email: '',
  rating: 5,
  comment: '',
  consentToPublish: false
})

const services = [
  'General Diagnostic Tests',
  'Specialized Genetic Testing',
  'Naturopathic Lab Testing',
  'Food Sensitivity Testing',
  'General Consultation',
  'Pediatric Care'
]

const timeSlots = [
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00'
]

const submit = async () => {
  loading.value = true
  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (data.success) {
      sent.value = true
    }
  } catch (e) {
    console.error('Submission error:', e)
    alert('An error occurred during booking. Please try again.')
  } finally {
    loading.value = false
  }
}

const submitSatisfaction = async () => {
  sendingSatisfaction.value = true
  satisfactionMessage.value = ''
  satisfactionError.value = false
  try {
    const res = await fetch('/api/satisfaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(satisfaction)
    })
    const data = await res.json()
    if (!res.ok || !data.success) throw new Error(data.error || 'Unable to save feedback.')
    satisfactionMessage.value = `Saved. Your ID is ${data.id}.`
    satisfaction.name = ''
    satisfaction.phone = ''
    satisfaction.email = ''
    satisfaction.rating = 5
    satisfaction.comment = ''
    satisfaction.consentToPublish = false
  } catch (e) {
    satisfactionError.value = true
    satisfactionMessage.value = e instanceof Error ? e.message : 'Unexpected error.'
  } finally {
    sendingSatisfaction.value = false
  }
}
</script>

<template>
  <div class="hero-mesh min-h-screen pt-16">
    <section class="py-14 bg-blue-900 text-white rounded-b-[3rem]">
      <div class="container mx-auto px-4 max-w-3xl text-center">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">Book a Visit Online</h1>
        <p class="text-blue-100 text-xl">Schedule your appointment or home lab visit in minutes.</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#appointment-form" class="rounded-full bg-white px-5 py-2 text-sm font-bold text-blue-900">Appointment Form</a>
          <a href="#satisfaction-form" class="rounded-full border border-white/40 px-5 py-2 text-sm font-bold text-white">Satisfaction Form</a>
        </div>
      </div>
    </section>

    <section class="py-10">
      <div class="container mx-auto px-4 max-w-6xl">
        <div v-if="sent" id="appointment-form" class="card-premium text-center">
          <h2 class="text-3xl font-bold text-green-800">Appointment Requested</h2>
          <p class="text-green-700 mt-3">Thank you {{ form.name }}, we will confirm your booking using your phone number.</p>
          <button class="btn-primary mt-6" @click="sent = false">Book Another Visit</button>
        </div>

        <div v-else class="grid gap-6 lg:grid-cols-2">
          <form id="appointment-form" class="card-premium space-y-8 h-fit" @submit.prevent="submit">
            <div class="border-b border-slate-100 pb-5">
            <h2 class="text-2xl font-black text-slate-900">Appointment Details</h2>
            <p class="mt-1 text-sm text-slate-600">Fill the form below. Phone number is required and used as your main contact ID.</p>
            </div>
            <div>
              <label class="block text-sm font-bold uppercase tracking-wide text-slate-700 mb-3">Service</label>
              <select
                v-model="form.service"
                required
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-100 outline-none"
              >
                <option disabled value="">Choose a service</option>
                <option v-for="s in services" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <input
                v-model="form.name"
                required
                type="text"
                placeholder="Full Name"
                class="px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-100 outline-none"
              />
              <input
                v-model="form.email"
                type="email"
                placeholder="Email (optional)"
                class="px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-100 outline-none"
              />
              <input
                v-model="form.phone"
                required
                type="tel"
                placeholder="Phone"
                class="px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-100 outline-none sm:col-span-2"
              />
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <input
                v-model="form.date"
                required
                type="date"
                class="px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-100 outline-none"
              />
              <select
                v-model="form.time"
                required
                class="px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-100 outline-none"
              >
                <option disabled value="">Choose time</option>
                <option v-for="t in timeSlots" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>

            <textarea
              v-model="form.notes"
              rows="4"
              placeholder="Additional notes"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 resize-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100 outline-none"
            ></textarea>

            <button type="submit" class="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed" :disabled="loading">
              {{ loading ? 'Sending...' : 'Confirm Booking' }}
            </button>
          </form>

          <div id="satisfaction-form" class="card-premium h-fit">
          <h2 class="text-2xl font-bold text-slate-900">Satisfaction Form</h2>
          <p class="mt-2 text-slate-600">Simple and readable form. Phone number is used as your ID. Email is optional.</p>

          <form class="mt-6 space-y-4" @submit.prevent="submitSatisfaction">
            <div class="grid sm:grid-cols-2 gap-4">
              <input v-model.trim="satisfaction.name" required type="text" placeholder="Full Name" class="px-4 py-3 rounded-xl border border-slate-200" />
              <input v-model.trim="satisfaction.phone" required type="tel" placeholder="Phone (ID)" class="px-4 py-3 rounded-xl border border-slate-200" />
            </div>
            <input v-model.trim="satisfaction.email" type="email" placeholder="Email (optional)" class="w-full px-4 py-3 rounded-xl border border-slate-200" />
            <select v-model.number="satisfaction.rating" required class="w-full px-4 py-3 rounded-xl border border-slate-200">
              <option :value="5">5 - Excellent</option>
              <option :value="4">4 - Good</option>
              <option :value="3">3 - Average</option>
              <option :value="2">2 - Poor</option>
              <option :value="1">1 - Bad</option>
            </select>
            <textarea v-model.trim="satisfaction.comment" required rows="4" placeholder="Your feedback" class="w-full px-4 py-3 rounded-xl border border-slate-200 resize-none"></textarea>
            <label class="flex items-center gap-2 text-sm text-slate-600">
              <input v-model="satisfaction.consentToPublish" type="checkbox" />
              I allow this feedback to appear publicly.
            </label>
            <div class="flex items-center gap-3">
              <button type="submit" class="btn-primary" :disabled="sendingSatisfaction">
                {{ sendingSatisfaction ? 'Sending...' : 'Send Feedback' }}
              </button>
              <p v-if="satisfactionMessage" class="text-sm" :class="satisfactionError ? 'text-red-600' : 'text-green-700'">
                {{ satisfactionMessage }}
              </p>
            </div>
          </form>
        </div>
        </div>
      </div>
    </section>
  </div>
</template>
