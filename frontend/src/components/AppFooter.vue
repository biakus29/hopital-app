<template>
  <footer class="bg-slate-950 py-20 text-slate-300">
    <div class="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-4">
      <div>
        <img :src="logo" alt="St. Thérèse Hospital" class="mb-6 h-12" />
        <p class="text-sm leading-relaxed text-slate-400">
          Providing world-class healthcare with a human touch to the families of Nomayos and the Mbankomo district.
        </p>
      </div>

      <div>
        <h3 class="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-white">Medical Services</h3>
        <ul class="space-y-3 text-sm">
          <li><RouterLink to="/services" class="hover:text-white">Diagnostic Testing</RouterLink></li>
          <li><RouterLink to="/services" class="hover:text-white">General Consultation</RouterLink></li>
          <li><RouterLink to="/services" class="hover:text-white">Pediatric Care</RouterLink></li>
          <li><RouterLink to="/services" class="hover:text-white">Genetic Insights</RouterLink></li>
        </ul>
      </div>

      <div>
        <h3 class="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-white">Quick Links</h3>
        <ul class="space-y-3 text-sm">
          <li><RouterLink to="/about" class="hover:text-white">About St. Therese</RouterLink></li>
          <li><RouterLink to="/careers" class="hover:text-white">Careers</RouterLink></li>
          <li><RouterLink to="/portal" class="hover:text-white">Staff Portal</RouterLink></li>
          <li><RouterLink to="/contact" class="hover:text-white">Contact Support</RouterLink></li>
        </ul>
      </div>

      <div>
        <h3 class="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-white">Legal &amp; Privacy</h3>
        <ul class="space-y-3 text-sm">
          <li><RouterLink to="/privacy" class="hover:text-white">Privacy Policy</RouterLink></li>
          <li><RouterLink to="/terms" class="hover:text-white">Terms of Service</RouterLink></li>
          <li><RouterLink to="/faqs" class="hover:text-white">Patient Rights</RouterLink></li>
        </ul>
      </div>
    </div>

    <div class="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-slate-800 px-4 pt-8 text-xs text-slate-500 md:flex-row">
      <p>&copy; {{ new Date().getFullYear() }} St. Therese Catholic Hospital</p>
      <div class="flex items-center gap-4">
        <span>Built for the Community</span>
        <span>Healthcare Excellence</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import logo from '../assets/logo/logo-light.png'
</script>
