<template>
  <div class="flex min-h-screen bg-slate-100 text-slate-900">
    <!-- Sidebar (desktop) -->
    <aside class="hidden w-64 flex-shrink-0 flex-col bg-slate-950 text-white lg:flex">
      <div class="border-b border-white/10 px-6 py-5">
        <RouterLink to="/admin" class="flex items-center gap-3">
          <span class="grid h-9 w-9 place-items-center rounded-xl bg-teal-500 font-black text-white">ST</span>
          <div>
            <p class="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Admin</p>
            <p class="text-sm font-bold">St. Therese</p>
          </div>
        </RouterLink>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-5">
        <p class="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Content</p>
        <RouterLink v-for="link in contentLinks" :key="link.to" v-bind="navLink(link)">
          <component :is="link.icon" :size="18" />
          {{ link.label }}
          <span v-if="link.count != null" class="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold">{{ link.count }}</span>
        </RouterLink>

        <p class="mt-5 px-3 pb-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Engagement</p>
        <RouterLink v-for="link in engageLinks" :key="link.to" v-bind="navLink(link)">
          <component :is="link.icon" :size="18" />
          {{ link.label }}
        </RouterLink>

        <p class="mt-5 px-3 pb-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">System</p>
        <RouterLink v-for="link in systemLinks" :key="link.to" v-bind="navLink(link)">
          <component :is="link.icon" :size="18" />
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="border-t border-white/10 p-4">
        <div class="flex items-center gap-3">
          <span class="grid h-9 w-9 place-items-center rounded-full bg-teal-500 font-black text-white">{{ initials }}</span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-bold">{{ auth.admin.value?.name || 'Admin' }}</p>
            <p class="truncate text-[11px] text-slate-400">{{ auth.admin.value?.email }}</p>
          </div>
          <button type="button" class="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white" title="Logout" @click="logout">
            <LogOut :size="16" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile drawer -->
    <Transition name="slide">
      <div v-if="mobileOpen" class="fixed inset-0 z-40 flex lg:hidden">
        <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="mobileOpen = false"></div>
        <aside class="relative flex w-64 flex-col bg-slate-950 text-white shadow-2xl">
          <div class="border-b border-white/10 p-4">
            <button type="button" class="rounded-lg bg-white/10 p-2 text-white" @click="mobileOpen = false">
              <X :size="20" />
            </button>
          </div>
          <nav class="flex-1 overflow-y-auto p-3">
            <RouterLink v-for="link in [...contentLinks, ...engageLinks, ...systemLinks]" :key="link.to"
              v-bind="navLink(link)" @click="mobileOpen = false">
              <component :is="link.icon" :size="18" />
              {{ link.label }}
            </RouterLink>
          </nav>
        </aside>
      </div>
    </Transition>

    <!-- Main column -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Topbar -->
      <header class="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
        <div class="flex items-center gap-3">
          <button type="button" class="rounded-lg bg-slate-100 p-2 text-slate-600 lg:hidden" @click="mobileOpen = true">
            <Menu :size="20" />
          </button>
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{{ breadcrumb }}</p>
            <h1 class="text-lg font-black text-slate-900">{{ pageTitle }}</h1>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <a href="/" target="_blank" class="hidden items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 sm:inline-flex">
            <ExternalLink :size="14" />
            View site
          </a>
          <button type="button" class="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200" title="Refresh">
            <RefreshCw :size="16" />
          </button>
        </div>
      </header>

      <!-- Must-change-password banner -->
      <div v-if="auth.mustChangePassword.value && !route.path.startsWith('/admin/settings')"
           class="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 lg:px-8">
        <div class="flex flex-wrap items-center gap-3">
          <span class="font-bold">🔒 Default password detected.</span>
          <span>Please change it now to secure the admin panel.</span>
          <RouterLink to="/admin/settings" class="ml-auto rounded-full bg-amber-600 px-3 py-1 text-xs font-bold text-white hover:bg-amber-700">
            Change password
          </RouterLink>
        </div>
      </div>

      <!-- Page slot -->
      <main class="flex-1 px-4 py-6 lg:px-8 lg:py-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard, FileText, Calendar, Users, Send, Inbox, Settings, Image as ImageIcon,
  LogOut, Menu, X, ExternalLink, RefreshCw
} from 'lucide-vue-next'
import { auth } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const mobileOpen = ref(false)

const contentLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/posts', label: 'Articles', icon: FileText },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/uploads', label: 'Media library', icon: ImageIcon }
]

const engageLinks = [
  { to: '/admin/subscribers', label: 'Subscribers', icon: Users },
  { to: '/admin/broadcasts', label: 'Broadcasts', icon: Send },
  { to: '/admin/inbox', label: 'Inbox', icon: Inbox }
]

const systemLinks = [
  { to: '/admin/settings', label: 'Settings', icon: Settings }
]

const initials = computed(() => {
  const n = auth.admin.value?.name || auth.admin.value?.email || 'A'
  return n.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
})

const allLinks = computed(() => [...contentLinks, ...engageLinks, ...systemLinks])
const currentLink = computed(() => allLinks.value.find(l => l.exact ? route.path === l.to : route.path.startsWith(l.to)))
const pageTitle = computed(() => currentLink.value?.label || 'Admin')
const breadcrumb = computed(() => 'Admin · ' + (currentLink.value?.label || ''))

function navLink(link) {
  return {
    to: link.to,
    class: 'group mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white',
    activeClass: link.exact ? '' : '!bg-teal-600 !text-white',
    exactActiveClass: '!bg-teal-600 !text-white'
  }
}

async function logout() {
  auth.logout()
  router.push('/admin/login')
}

onMounted(() => { auth.refreshProfile() })

watch(() => route.fullPath, () => { mobileOpen.value = false })
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: opacity 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; }
</style>
