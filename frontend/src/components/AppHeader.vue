<template>
  <header class="sticky top-0 z-40 bg-slate-950/95 text-white backdrop-blur">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:py-5">
      <RouterLink to="/" class="flex items-center gap-3">
        <img :src="logo" alt="St. Therese Hospital" class="h-10 md:h-12" />
      </RouterLink>

      <nav class="hidden items-center gap-8 lg:flex">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-sm font-semibold text-slate-200 transition hover:text-white"
          active-class="text-teal-400"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="hidden items-center gap-3 lg:flex">
        <RouterLink to="/portal" class="text-sm font-semibold text-slate-200 hover:text-white">Portal</RouterLink>
        <RouterLink to="/book" class="btn-primary !py-2">Book a Visit</RouterLink>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-full border border-slate-700 p-2 text-white lg:hidden"
        aria-label="Open menu"
        @click="drawerOpen = true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
    </div>

    <Transition name="fade">
      <div v-if="drawerOpen" class="fixed inset-0 z-50 lg:hidden">
        <div class="absolute inset-0 bg-slate-950/70" @click="drawerOpen = false"></div>
        <aside class="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-slate-950 px-6 py-8 text-white shadow-2xl">
          <div class="mb-10 flex items-center justify-between">
            <img :src="logo" alt="" class="h-9" />
            <button
              type="button"
              class="rounded-full border border-slate-700 p-2"
              aria-label="Close menu"
              @click="drawerOpen = false"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav class="flex flex-col gap-4 text-base font-semibold">
            <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" @click="drawerOpen = false">
              {{ link.label }}
            </RouterLink>
            <RouterLink to="/portal" @click="drawerOpen = false">Portal</RouterLink>
          </nav>
          <RouterLink to="/book" class="btn-primary mt-10 w-full" @click="drawerOpen = false">Book a Visit</RouterLink>
        </aside>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import logo from '../assets/logo/logo-light.png'

const drawerOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { drawerOpen.value = false })

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/book', label: 'Book' },
  { to: '/contact', label: 'Contact' },
  { to: '/blog', label: 'Blog' }
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
