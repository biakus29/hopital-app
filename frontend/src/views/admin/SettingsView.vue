<template>
  <div class="max-w-2xl space-y-6">
    <header>
      <h2 class="text-2xl font-black text-slate-900">Settings</h2>
      <p class="text-sm text-slate-500">Account, security and channel status.</p>
    </header>

    <!-- Change password -->
    <section class="rounded-3xl border border-slate-200 bg-white p-6">
      <header class="mb-4 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-black">Password</h3>
          <p v-if="mustChange" class="mt-1 text-sm text-amber-700">⚠ Default password detected — please change it now.</p>
          <p v-else class="mt-1 text-sm text-slate-500">Last updated at the most recent change.</p>
        </div>
      </header>
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="changePassword">
        <div class="sm:col-span-2">
          <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Current password</label>
          <input v-model="pwd.current" type="password" required autocomplete="current-password"
                 class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">New password</label>
          <input v-model="pwd.next" type="password" required minlength="6" autocomplete="new-password"
                 class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Confirm new password</label>
          <input v-model="pwd.confirm" type="password" required minlength="6" autocomplete="new-password"
                 class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div class="sm:col-span-2 flex items-center justify-between">
          <p v-if="pwdMsg" :class="['text-sm', pwdOk ? 'text-emerald-700' : 'text-rose-600']">{{ pwdMsg }}</p>
          <button type="submit" :disabled="pwdSaving"
                  class="rounded-full bg-teal-600 px-5 py-2 text-sm font-black text-white hover:bg-teal-700 disabled:opacity-60">
            {{ pwdSaving ? 'Updating…' : 'Change password' }}
          </button>
        </div>
      </form>
    </section>

    <!-- Profile -->
    <section class="rounded-3xl border border-slate-200 bg-white p-6">
      <h3 class="text-lg font-black">Profile</h3>
      <form class="mt-4 grid gap-4 sm:grid-cols-2" @submit.prevent="saveProfile">
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Name</label>
          <input v-model="profile.name" type="text" class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-slate-500">Email</label>
          <input v-model="profile.email" type="email" class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div class="sm:col-span-2 flex items-center justify-between">
          <p v-if="profileMsg" :class="['text-sm', profileOk ? 'text-emerald-700' : 'text-rose-600']">{{ profileMsg }}</p>
          <button type="submit" :disabled="profileSaving"
                  class="rounded-full border border-slate-300 px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
            {{ profileSaving ? 'Saving…' : 'Save profile' }}
          </button>
        </div>
      </form>
    </section>

    <!-- Channel status -->
    <section class="rounded-3xl border border-slate-200 bg-white p-6">
      <h3 class="text-lg font-black">Channel status</h3>
      <p class="text-sm text-slate-500">Configure providers in <code class="rounded bg-slate-100 px-1 py-0.5">backend/.env</code>.</p>
      <ul class="mt-4 space-y-3 text-sm">
        <li class="flex items-center justify-between">
          <span>WhatsApp</span>
          <span :class="badge(channels.whatsapp?.ready)">{{ channels.whatsapp?.ready ? 'Ready' : channels.whatsapp?.enabled ? 'Connecting' : 'Off' }}</span>
        </li>
        <li class="flex items-center justify-between">
          <span>Email ({{ channels.email?.host || 'n/a' }})</span>
          <span :class="badge(channels.email?.enabled)">{{ channels.email?.enabled ? 'Ready' : 'Off' }}</span>
        </li>
        <li class="flex items-center justify-between">
          <span>SMS ({{ channels.sms?.provider }})</span>
          <span :class="badge(channels.sms?.configured)">{{ channels.sms?.configured ? 'Ready' : 'Off' }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { api, ApiError } from '@/lib/api'
import { auth } from '@/stores/auth'

const mustChange = auth.mustChangePassword
const channels = ref({})

const pwd = reactive({ current: '', next: '', confirm: '' })
const pwdSaving = ref(false)
const pwdMsg = ref(''); const pwdOk = ref(false)

const profile = reactive({ name: auth.admin.value?.name || '', email: auth.admin.value?.email || '' })
const profileSaving = ref(false)
const profileMsg = ref(''); const profileOk = ref(false)

function badge(on) {
  return on
    ? 'rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-emerald-700'
    : 'rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-500'
}

async function changePassword() {
  pwdMsg.value = ''
  if (pwd.next !== pwd.confirm) { pwdMsg.value = 'New passwords do not match.'; pwdOk.value = false; return }
  pwdSaving.value = true
  try {
    await auth.changePassword(pwd.current, pwd.next)
    pwd.current = pwd.next = pwd.confirm = ''
    pwdMsg.value = 'Password updated.'
    pwdOk.value = true
  } catch (err) {
    pwdMsg.value = err instanceof ApiError ? err.message : 'Could not update password.'
    pwdOk.value = false
  } finally { pwdSaving.value = false }
}

async function saveProfile() {
  profileMsg.value = ''
  profileSaving.value = true
  try {
    await auth.updateProfile({ name: profile.name, email: profile.email })
    profileMsg.value = 'Profile updated.'
    profileOk.value = true
  } catch (err) {
    profileMsg.value = err instanceof ApiError ? err.message : 'Could not save profile.'
    profileOk.value = false
  } finally { profileSaving.value = false }
}

async function load() {
  try {
    const d = await api.get('/status/dashboard', undefined, { token: auth.token.value })
    channels.value = d.channels || {}
  } catch { channels.value = {} }
}

onMounted(load)
</script>
