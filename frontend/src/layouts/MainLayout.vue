<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  X,
  Shield,
  Menu,
  Home,
  Stethoscope,
  Calendar,
  BookOpen,
  Mail,
} from 'lucide-vue-next'

const logoDark = '/images/logo/logo-dark.png'
const logoLight = '/images/logo/logo-light.png'

const route = useRoute()
const mobileOpen = ref(false)

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value
  if (mobileOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

onMounted(() => {
  window.addEventListener('popstate', () => (mobileOpen.value = false))
})
</script>

<template>
  <div>
    <!-- Mobile drawer -->
    <Transition name="fade-slide">
      <div v-if="mobileOpen" class="fixed inset-0 z-[100] lg:hidden">
        <div
          class="absolute inset-0 bg-blue-950/60 backdrop-blur-xl"
          @click="toggleMobile"
        />
        <!-- TODO: bundle section unclear: outer drawer panel wrapper class (`cu`) not visible in bundle -->
        <div class="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl flex flex-col">
          <!-- TODO: bundle section unclear: drawer header wrapper class (`lu`) not visible in bundle -->
          <div class="flex items-center justify-between p-6 border-b border-slate-100">
            <img :src="logoDark" alt="Logo" class="h-10 w-auto" />
            <button
              class="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-blue-600 transition-all active:scale-90"
              @click="toggleMobile"
            >
              <X :size="24" />
            </button>
          </div>
          <!-- TODO: bundle section unclear: drawer nav wrapper class (`uu`) not visible in bundle -->
          <nav class="flex-1 overflow-y-auto px-6 py-4">
            <RouterLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              :class="[
                'py-4 border-b border-slate-50 flex justify-between items-center group',
                { 'text-blue-600': route.path === link.to },
              ]"
              @click="toggleMobile"
            >
              {{ link.label }}
              <ArrowRight
                :size="20"
                class="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
              />
            </RouterLink>
          </nav>
          <div class="p-6 border-t border-slate-100">
            <div class="space-y-4">
              <RouterLink
                to="/book"
                class="btn-primary w-full text-center py-5 shadow-teal-900/20"
                @click="toggleMobile"
              >
                Book an Appointment
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Top utility bar -->
    <!-- TODO: bundle section unclear: top bar wrapper classes (`mu`, `hu`) not visible in bundle -->
    <div class="hidden lg:block bg-blue-950 text-blue-100 text-xs">
      <div class="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <span class="flex items-center gap-2">
            <Phone :size="12" class="text-blue-400" />
            Emergency: (+237) 678 06 11 26
          </span>
          <span class="flex items-center gap-2">
            <MapPin :size="12" class="text-blue-400" />
            Nomayos, Cameroun
          </span>
        </div>
        <div class="flex items-center gap-6">
          <span class="flex items-center gap-2">
            <Clock :size="12" class="text-blue-400" />
            Mon - Fri: 6:00 am - 8:00 pm
          </span>
          <div class="hidden xl:flex items-center gap-4 text-blue-200">
            <a href="#" class="hover:text-white transition-colors">Insurance</a>
            <a href="#" class="hover:text-white transition-colors">Providers</a>
            <a href="#" class="hover:text-white transition-colors">Accreditation</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Header -->
    <!-- TODO: bundle section unclear: header outer class (`xu`) and inner container class (`Su`) not visible in bundle -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-3">
          <img :src="logoDark" alt="St. Therese logo" class="h-10 md:h-12 w-auto" />
        </RouterLink>
        <!-- TODO: bundle section unclear: desktop nav wrapper class (`Cu`) not visible in bundle -->
        <nav class="hidden lg:flex items-center gap-10 text-sm font-bold text-slate-900 uppercase tracking-wider">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="[
              'hover:text-blue-600 transition-colors relative group',
              { 'text-blue-600': route.path === link.to },
            ]"
          >
            {{ link.label }}
            <span
              :class="[
                'absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full',
                { 'w-full': route.path === link.to },
              ]"
            />
          </RouterLink>
        </nav>
        <div class="flex items-center gap-4">
          <RouterLink to="/book" class="btn-primary !py-3.5 !px-8 text-xs hidden lg:flex">
            Book a Visit
          </RouterLink>
          <button
            class="lg:hidden p-3 bg-slate-50 rounded-2xl text-slate-600 active:scale-90 transition-all"
            @click="toggleMobile"
          >
            <Menu :size="24" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main slot -->
    <!-- TODO: bundle section unclear: main wrapper class (`Eu`) not visible in bundle -->
    <main>
      <slot />
    </main>

    <!-- Mobile bottom navigation -->
    <!-- TODO: bundle section unclear: mobile bottom nav wrapper class (`Du`) and book icon wrapper (`Ou`) not visible in bundle -->
    <div
      class="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-100 flex items-center justify-around px-2 py-2"
    >
      <RouterLink to="/" class="mobile-nav-item">
        <Home :size="24" />
        <span>Home</span>
      </RouterLink>
      <RouterLink to="/services" class="mobile-nav-item">
        <Stethoscope :size="24" />
        <span>Services</span>
      </RouterLink>
      <RouterLink to="/book" class="mobile-nav-item">
        <div class="-translate-y-4 p-4 rounded-full bg-blue-600 text-white shadow-lg">
          <Calendar :size="24" />
        </div>
        <span class="-translate-y-4">Book</span>
      </RouterLink>
      <RouterLink to="/blog" class="mobile-nav-item">
        <BookOpen :size="24" />
        <span>Blog</span>
      </RouterLink>
      <RouterLink to="/contact" class="mobile-nav-item">
        <Mail :size="24" />
        <span>Contact</span>
      </RouterLink>
    </div>

    <!-- Footer -->
    <!-- TODO: bundle section unclear: footer outer class (`ku`), inner container (`Au`), grid wrapper (`ju`), brand column (`Mu`), social row (`Nu`), social icons (`Pu`, `Fu`), and column list classes (`Iu`, `Lu`, `Ru`) not visible in bundle -->
    <footer class="bg-slate-950 text-slate-400 pt-20 pb-10">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div class="space-y-6">
            <img :src="logoLight" alt="St. Therese logo" class="h-10 w-auto" />
            <p class="text-sm leading-relaxed">
              Providing world-class healthcare with a human touch to the families of Nomayos and the Mbankomo district.
            </p>
            <div class="flex items-center gap-3">
              <div class="p-3 rounded-xl bg-slate-900 hover:bg-blue-600 transition-colors">
                <Phone :size="18" class="text-white" />
              </div>
              <div class="p-3 rounded-xl bg-slate-900 hover:bg-blue-600 transition-colors">
                <MapPin :size="18" class="text-white" />
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-white font-black mb-8 uppercase tracking-[0.2em] text-[10px]">
              Medical Services
            </h4>
            <ul class="space-y-4 text-sm font-medium">
              <li>
                <RouterLink to="/services" class="hover:text-white transition-colors">
                  Diagnostic Testing
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/services" class="hover:text-white transition-colors">
                  General Consultation
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/services" class="hover:text-white transition-colors">
                  Pediatric Care
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/services" class="hover:text-white transition-colors">
                  Genetic Insights
                </RouterLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-black mb-8 uppercase tracking-[0.2em] text-[10px]">
              Quick Links
            </h4>
            <ul class="space-y-4 text-sm font-medium">
              <li>
                <RouterLink to="/about" class="hover:text-white transition-colors">
                  About St. Therese
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/careers" class="hover:text-white transition-colors">
                  Careers
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/contact" class="hover:text-white transition-colors">
                  Contact Support
                </RouterLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-black mb-8 uppercase tracking-[0.2em] text-[10px]">
              Legal & Privacy
            </h4>
            <ul class="space-y-4 text-sm font-medium">
              <li>
                <RouterLink to="/privacy" class="hover:text-white transition-colors">
                  Privacy Policy
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/terms" class="hover:text-white transition-colors">
                  Terms of Service
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/policy" class="hover:text-white transition-colors">
                  Patient Rights
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <div
          class="mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500"
        >
          <p>© 2026 St. Therese Catholic Hospital</p>
          <div class="flex gap-8">
            <!-- TODO: bundle section unclear: bundle truncated mid-string — last visible text was "Built for" with remaining footer tagline content cut off in source file -->
            <span>Built for Nomayos</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
