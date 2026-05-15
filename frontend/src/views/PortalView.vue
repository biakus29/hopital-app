<script setup>
import { ref } from 'vue'

// Sidebar tabs — labels verbatim from bundle
const tabs = ['Dashboard', 'Appointments', 'Patients', 'Reports']
const active = ref('Dashboard')

// Metric cards — labels and values verbatim from bundle
const metrics = [
  { label: "Today's Appointments", value: '24' },
  { label: 'New Patients', value: '12' },
  { label: 'Pending Reports', value: '8' },
  { label: 'Revenue', value: 'FCFA 450k' },
]

// Patient table rows — verbatim from bundle
const patients = [
  { name: 'John Doe', id: 'P-1023', time: '10:30 AM', status: 'Waiting' },
  { name: 'Jane Smith', id: 'P-1024', time: '11:15 AM', status: 'In Progress' },
]

function statusClass(status) {
  if (status === 'Waiting') return 'bg-amber-100 text-amber-700'
  if (status === 'In Progress') return 'bg-blue-100 text-blue-700'
  if (status === 'Completed') return 'bg-emerald-100 text-emerald-700'
  return 'bg-slate-100 text-slate-700'
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <aside class="w-64 bg-blue-950 text-white hidden md:flex flex-col">
      <div class="p-6 border-b border-white/10">
        <h1 class="font-bold text-lg">ST. THERESE PORTAL</h1>
      </div>
      <nav class="p-4 space-y-2">
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl',
            active === tab ? 'bg-blue-600 font-semibold' : 'hover:bg-white/10',
          ]"
          @click="active = tab"
        >
          {{ tab }}
        </button>
      </nav>
    </aside>

    <main class="flex-1 p-6 md:p-10">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Welcome back, Dr. Ngwa</h2>
          <p class="text-slate-500 text-sm">Live clinic metrics and patient workflow overview.</p>
        </div>
      </header>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <article
          v-for="metric in metrics"
          :key="metric.label"
          class="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <p class="text-slate-500 text-sm">{{ metric.label }}</p>
          <p class="text-3xl font-bold mt-2">{{ metric.value }}</p>
        </article>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 font-bold">Today's Patients</div>
        <table class="w-full text-left">
          <thead class="bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
            <tr>
              <th class="px-6 py-3">Name</th>
              <th class="px-6 py-3">ID</th>
              <th class="px-6 py-3">Time</th>
              <th class="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="patient in patients"
              :key="patient.id"
              class="border-t border-slate-100"
            >
              <td class="px-6 py-4">{{ patient.name }}</td>
              <td class="px-6 py-4">{{ patient.id }}</td>
              <td class="px-6 py-4">{{ patient.time }}</td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                    statusClass(patient.status),
                  ]"
                >
                  {{ patient.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>
