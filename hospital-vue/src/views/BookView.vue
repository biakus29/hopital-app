<script setup>
import { ref, reactive } from 'vue'

const sent = ref(false)
const loading = ref(false)

const form = reactive({
  service: '',
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  notes: ''
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
</script>

<template>
  <div class="hero-mesh min-h-screen pt-16">
    <section class="py-20 bg-blue-900 text-white rounded-b-[3rem]">
      <div class="container mx-auto px-4 max-w-3xl text-center">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">Book a Visit Online</h1>
        <p class="text-blue-100 text-xl">Schedule your appointment or home lab visit in minutes.</p>
      </div>
    </section>

    <section class="py-20">
      <div class="container mx-auto px-4 max-w-4xl">
        <div v-if="sent" class="card-premium text-center">
          <h2 class="text-3xl font-bold text-green-800">Appointment Requested</h2>
          <p class="text-green-700 mt-3">Thank you {{ form.name }}, we will confirm your booking by email.</p>
          <button class="btn-primary mt-6" @click="sent = false">Book Another Visit</button>
        </div>

        <form v-else class="card-premium space-y-8" @submit.prevent="submit">
          <div>
            <label class="block font-bold mb-3">Service</label>
            <select
              v-model="form.service"
              required
              class="w-full px-4 py-3 rounded-xl border border-slate-200"
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
              class="px-4 py-3 rounded-xl border border-slate-200"
            />
            <input
              v-model="form.email"
              required
              type="email"
              placeholder="Email"
              class="px-4 py-3 rounded-xl border border-slate-200"
            />
            <input
              v-model="form.phone"
              required
              type="tel"
              placeholder="Phone"
              class="px-4 py-3 rounded-xl border border-slate-200 sm:col-span-2"
            />
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <input
              v-model="form.date"
              required
              type="date"
              class="px-4 py-3 rounded-xl border border-slate-200"
            />
            <select
              v-model="form.time"
              required
              class="px-4 py-3 rounded-xl border border-slate-200"
            >
              <option disabled value="">Choose time</option>
              <option v-for="t in timeSlots" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>

          <textarea
            v-model="form.notes"
            rows="4"
            placeholder="Additional notes"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 resize-none"
          ></textarea>

          <button type="submit" class="btn-primary w-full" :disabled="loading">
            {{ loading ? 'Sending...' : 'Confirm Booking' }}
          </button>
        </form>
      </div>
    </section>
  </div>
</template>
