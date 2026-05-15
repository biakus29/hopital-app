import { reactive, computed, watch } from 'vue'
import { api } from '@/lib/api'

const STORAGE_KEY = 'st-therese-admin'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

const persisted = loadFromStorage()

const state = reactive({
  token: persisted?.token || null,
  admin: persisted?.admin || null
})

// Persist any change
watch(state, () => {
  try {
    if (state.token) localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    else localStorage.removeItem(STORAGE_KEY)
  } catch { /* ignore */ }
}, { deep: true })

export const auth = {
  state,
  isLoggedIn: computed(() => !!state.token),
  mustChangePassword: computed(() => !!state.admin?.mustChangePassword),
  token: computed(() => state.token),
  admin: computed(() => state.admin),

  async login(email, password) {
    const data = await api.post('/auth/login', { email, password })
    state.token = data.token
    state.admin = data.admin
    return data
  },

  async refreshProfile() {
    if (!state.token) return null
    try {
      const data = await api.get('/auth/me', undefined, { token: state.token })
      state.admin = { ...state.admin, ...data }
      return data
    } catch {
      // Token invalid or backend offline — fail silently
      return null
    }
  },

  async changePassword(currentPassword, newPassword) {
    await api.post('/auth/change-password', { currentPassword, newPassword }, { token: state.token })
    if (state.admin) state.admin.mustChangePassword = false
  },

  async updateProfile(payload) {
    const updated = await api.put('/auth/me', payload, { token: state.token })
    state.admin = { ...state.admin, ...updated }
  },

  logout() {
    state.token = null
    state.admin = null
  }
}
