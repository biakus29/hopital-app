<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-6">
    <div class="absolute inset-0 overflow-hidden">
      <div class="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-md">
      <div class="mb-8 text-center text-white">
        <div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-500 font-black text-white shadow-lg shadow-teal-500/30">ST</div>
        <h1 class="mt-5 text-2xl font-black">St. Therese Admin</h1>
        <p class="mt-1 text-sm text-slate-300">Sign in to manage content and engagement.</p>
      </div>

      <form @submit.prevent="submit" class="space-y-4 rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur">
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Email</label>
          <input v-model="email" type="email" required autocomplete="username"
                 class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-teal-500 focus:ring-2" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Password</label>
          <div class="relative mt-2">
            <input v-model="password" :type="showPwd ? 'text' : 'password'" required autocomplete="current-password"
                   class="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none ring-teal-500 focus:ring-2" />
            <button type="button" class="absolute inset-y-0 right-3 text-slate-400 hover:text-slate-700" @click="showPwd = !showPwd">
              <component :is="showPwd ? EyeOff : Eye" :size="18" />
            </button>
          </div>
        </div>

        <div v-if="error" class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{{ error }}</div>

        <button type="submit" :disabled="loading"
                class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-teal-500/30 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>

        <div class="rounded-xl bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
          <strong class="text-slate-700">Default credentials</strong> · email <code class="rounded bg-white px-1 py-0.5">admin@st-therese-hospital.cm</code> · password <code class="rounded bg-white px-1 py-0.5">admin</code>
          <br>You'll be asked to change the password on first login.
        </div>
      </form>

      <p class="mt-6 text-center text-xs text-slate-400">
        <RouterLink to="/" class="hover:text-white">← Back to public site</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Eye, EyeOff } from 'lucide-vue-next'
import { auth } from '@/stores/auth'
import { ApiError } from '@/lib/api'

const route = useRoute()
const router = useRouter()
const email = ref('admin@st-therese-hospital.cm')
const password = ref('')
const showPwd = ref(false)
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    const next = (route.query.next && typeof route.query.next === 'string') ? route.query.next : '/admin'
    router.push(next)
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Sign in failed.'
  } finally {
    loading.value = false
  }
}
</script>
