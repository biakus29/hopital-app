<template>
  <div>
    <section class="relative h-[460px] overflow-hidden bg-slate-950">
      <div class="absolute inset-0 rounded-b-[2rem] overflow-hidden">
        <img :src="page.heroImage" alt="Page hero" class="h-full w-full object-cover opacity-80" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-slate-900/30"></div>
      <div class="relative mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-16 text-white">
        <p class="text-xs font-bold uppercase tracking-[0.22em] text-teal-300">{{ page.eyebrow }}</p>
        <h1 class="mt-3 text-4xl font-extrabold md:text-5xl">{{ page.title }}</h1>
        <p class="mt-4 max-w-2xl text-slate-200">{{ page.subtitle }}</p>
      </div>
    </section>

    <section class="py-16 md:py-20">
      <div class="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
        <article v-for="highlight in page.highlights" :key="highlight" class="card-premium rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p class="text-[10px] uppercase tracking-[0.2em] text-blue-600 font-bold mb-3">Highlight</p>
          <h3 class="text-lg font-bold text-slate-900">{{ highlight }}</h3>
        </article>
      </div>
    </section>

    <section class="py-16 md:py-20 bg-white">
      <div class="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <h2 class="text-3xl font-extrabold md:text-4xl">{{ page.focusTitle }}</h2>
          <p class="mt-5 text-slate-600">{{ page.focusText }}</p>
          <div class="mt-8 flex flex-wrap gap-4">
            <RouterLink to="/book" class="btn-primary">Book Appointment</RouterLink>
            <RouterLink to="/contact" class="btn-secondary">Contact Team</RouterLink>
          </div>
        </div>
        <div class="overflow-hidden rounded-[2rem] shadow-2xl border border-slate-100">
          <img :src="page.heroImage" alt="Focus visual" class="h-[340px] w-full object-cover" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { modernPages } from '../data/modernPages'

const props = defineProps({
  pageKey: { type: String, required: true }
})

const page = computed(() => modernPages[props.pageKey] ?? modernPages.whyUs)
</script>
