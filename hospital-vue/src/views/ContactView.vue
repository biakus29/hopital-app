<template>
  <main class="contact-page" ref="pageRef">
    <!-- ══════════════════════════════════════
         DYNAMIC BACKGROUND
    ══════════════════════════════════════ -->
    <div class="dynamic-orbs">
      <div class="orb orb-1" :style="orbStyle(0.05)" />
      <div class="orb orb-2" :style="orbStyle(-0.03)" />
      <div class="orb orb-3" :style="orbStyle(0.02)" />
    </div>
    <canvas ref="particleCanvas" class="particle-canvas" aria-hidden="true" />

    <!-- ══════════════════════════════════════
         HERO SECTION
    ══════════════════════════════════════ -->
    <section class="hero-contact">
      <div class="hero-mesh-bg" />
      <div class="container mx-auto px-4 text-center max-w-5xl relative z-10">
        <div class="floating-label sr-child">
          <span class="label-line" />
          <span class="label-txt">We are here for you</span>
          <span class="label-line" />
        </div>
        
        <h1 class="hero-title" ref="titleRef">
          Let's Start a <br/>
          <span class="text-teal-600 italic font-serif">Conversation</span>
        </h1>
        
        <p class="hero-subtitle ag-float ag-float--light">
          Questions about a test, an appointment, or our services? 
          Our team is available to guide you.
        </p>
      </div>
      
      <div class="ecg-divider-premium">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
          <polyline class="ecg-line" points="0,20 100,20 110,4 120,36 130,2 140,38 150,20 1200,20" />
        </svg>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         CONTACT GRID
    ══════════════════════════════════════ -->
    <section class="contact-grid-section py-20 sr">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-16 items-start">
          
          <!-- LEFT: INFO CARDS -->
          <div class="space-y-8 sr-child">
            <div class="info-lux-card ag-float--light">
              <div class="info-icon-wrap">📍</div>
              <div>
                <h4 class="text-teal-900 font-bold uppercase tracking-widest text-xs mb-1">Our Location</h4>
                <p class="text-slate-600 font-bold">Nomayos, Cameroon</p>
                <p class="text-slate-500 text-sm">Route de Mbankomo, St. Odile Catholic Parish</p>
              </div>
            </div>

            <div class="info-lux-card ag-float--medium" style="--float-delay: 0.2s">
              <div class="info-icon-wrap">📞</div>
              <div>
                <h4 class="text-teal-900 font-bold uppercase tracking-widest text-xs mb-1">Phone</h4>
                <p class="text-slate-600 font-bold text-lg">(+237) 678 06 11 26</p>
                <p class="text-slate-400 text-sm">Emergency available 24/7</p>
              </div>
            </div>

            <div class="info-lux-card ag-float--light" style="--float-delay: 0.4s">
              <div class="info-icon-wrap">📧</div>
              <div>
                <h4 class="text-teal-900 font-bold uppercase tracking-widest text-xs mb-1">Email</h4>
                <p class="text-slate-600 font-bold">info@st-therese-hospital.cm</p>
                <p class="text-slate-500 text-sm">General inquiries & results</p>
              </div>
            </div>

            <div class="info-lux-card ag-float--medium" style="--float-delay: 0.6s">
              <div class="info-icon-wrap">⏰</div>
              <div>
                <h4 class="text-teal-900 font-bold uppercase tracking-widest text-xs mb-1">Opening Hours</h4>
                <p class="text-slate-600 font-bold">Mon - Fri: 6:00 am - 8:00 pm</p>
                <p class="text-slate-600">Saturday: 8:00 am - 4:00 pm</p>
              </div>
            </div>
          </div>

          <!-- RIGHT: FORM -->
          <div class="form-container-lux glass-premium p-10 sr-child" style="--delay: 0.2s">
            <div v-if="submitted" class="success-state text-center py-12">
              <div class="success-circle mb-6 mx-auto">✓</div>
              <h3 class="text-3xl font-bold text-teal-900 mb-4">Thank You!</h3>
              <p class="text-slate-600 mb-8">Your message has been successfully sent. We will get back to you shortly.</p>
              <button @click="submitted = false" class="btn-premium-lux">Send another message</button>
            </div>
            <form v-else class="space-y-6" @submit.prevent="handleSubmit">
              <div class="grid md:grid-cols-2 gap-6">
                <div class="input-group">
                  <label class="input-label">Your Name</label>
                  <input v-model="form.name" type="text" required placeholder="John Doe" class="lux-input" />
                </div>
                <div class="input-group">
                  <label class="input-label">Your Email</label>
                  <input v-model="form.email" type="email" required placeholder="john@example.com" class="lux-input" />
                </div>
              </div>
              <div class="input-group">
                <label class="input-label">Subject</label>
                <select v-model="form.subject" class="lux-input">
                  <option>General Inquiry</option>
                  <option>Appointment Request</option>
                  <option>Test Results</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div class="input-group">
                <label class="input-label">Message</label>
                <textarea v-model="form.message" required rows="5" placeholder="How can we help you?" class="lux-input resize-none"></textarea>
              </div>
              <button type="submit" class="btn-premium-lux w-full" :disabled="isSubmitting">
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         MAP SECTION
    ══════════════════════════════════════ -->
    <section class="map-section h-[500px] w-full grayscale contrast-125 hover:grayscale-0 transition-all duration-1000 sr">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15923.479532585!2d11.41164!3d3.7745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf773f3286f9%3A0xc3c55206f4770e5a!2sNomayos!5e0!3m2!1sen!2scm!4v1650000000000!5m2!1sen!2scm" 
        width="100%" height="100%" style="border:0;" allowfullscreen loading="lazy" title="St. Therese Hospital location map"></iframe>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

// --- DATA ---
const isSubmitting = ref(false)
const submitted = ref(false)
const form = reactive({
  name: '',
  email: '',
  subject: 'General Inquiry',
  message: ''
})

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await response.json()
    if (data.success) {
      submitted.value = true
      form.name = ''
      form.email = ''
      form.message = ''
    }
  } catch (error) {
    console.error('Contact error:', error)
    alert('An error occurred. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// --- MOUSE PARALLAX ---
const mousePos = ref({ x: 0, y: 0 })
const orbStyle = (factor: number) => ({
  transform: `translate(${mousePos.value.x * factor}px, ${mousePos.value.y * factor}px)`
})

// --- ANIMATIONS LOGIC ---
const pageRef = ref<HTMLElement | null>(null)
const particleCanvas = ref<HTMLCanvasElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
let animId = 0
let observer: IntersectionObserver
let cleanupResize: (() => void) | null = null

function revealChars(el: HTMLElement | null) {
  // Logic removed
}

function initSR() {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('sr--on')
        e.target.querySelectorAll('.sr-child').forEach(c => c.classList.add('sr-child--on'))
      }
    })
  }, { threshold: 0.1 })
  document.querySelectorAll('.sr').forEach(s => observer.observe(s))
}

function initParticles() {
  const canvas = particleCanvas.value; if (!canvas) return
  const ctx = canvas.getContext('2d')!;
  const pts: any[] = []
  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = pageRef.value?.offsetHeight || window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)
  cleanupResize = () => window.removeEventListener('resize', resize)
  for(let i=0; i<35; i++) {
    pts.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random()-0.5)*0.2,
      vy: (Math.random()-0.5)*0.2,
      r: Math.random() * 2 + 0.3,
      alpha: Math.random() * 0.1 + 0.05
    })
  }
  function draw() {
    ctx.clearRect(0,0,canvas.width, canvas.height)
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy
      if(p.x < 0 || p.x > canvas.width) p.vx *= -1
      if(p.y < 0 || p.y > canvas.height) p.vy *= -1
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2)
      ctx.fillStyle = `rgba(13, 148, 136, ${p.alpha})`; ctx.fill()
    })
    animId = requestAnimationFrame(draw)
  }
  draw()
}

onMounted(() => {
  initSR()
  initParticles()
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  observer?.disconnect()
  cleanupResize?.()
})
</script>

<style scoped>
@reference "../style.css";

.contact-page {
  --teal: #0d9488;
  --teal-dark: #134e4a;
  --gold: #c9a84c;
  --bg: #f8fbfa;
  background: var(--bg);
  color: #1e293b;
  font-family: 'DM Sans', sans-serif;
  overflow-x: hidden;
  position: relative;
}

/* ══════════════════════════════════════
   BACKGROUND
   ══════════════════════════════════════ */
.orb { position: fixed; border-radius: 50%; filter: blur(140px); opacity: 0.15; z-index: 0; pointer-events: none; transition: transform 0.2s ease-out; }
.orb-1 { width: 800px; height: 800px; background: #ccf2f4; top: -10%; right: -5%; }
.orb-2 { width: 600px; height: 600px; background: #fef3c7; bottom: 5%; left: -5%; }
.orb-3 { width: 400px; height: 400px; background: #e0f2fe; top: 40%; left: 30%; }

.particle-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

/* ══════════════════════════════════════
   HERO
   ══════════════════════════════════════ */
.hero-contact { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 140px 20px 60px; position: relative; }
.hero-mesh-bg { position: absolute; inset: 0; background-image: radial-gradient(rgba(13,148,136,0.1) 1px, transparent 1px); background-size: 50px 50px; mask-image: radial-gradient(ellipse at center, black, transparent); }

.floating-label { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; }
.label-line { height: 1px; width: 40px; background: linear-gradient(90deg, transparent, var(--teal)); }
.label-txt { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3em; color: var(--teal); }

.hero-title { font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 1.1; font-weight: 900; margin-bottom: 2rem; }
.hero-subtitle { font-size: 1.15rem; color: #64748b; max-width: 650px; line-height: 1.7; font-weight: 300; }

.ecg-divider-premium { width: 100%; position: absolute; bottom: 0; opacity: 0.1; }
.ecg-line { fill: none; stroke: var(--teal); stroke-width: 2; }

/* ══════════════════════════════════════
   INFO CARDS
   ══════════════════════════════════════ */
.info-lux-card { background: white; padding: 2rem; border-radius: 2rem; display: flex; align-items: center; gap: 1.5rem; border: 1px solid rgba(0,0,0,0.03); box-shadow: 0 15px 35px rgba(0,0,0,0.02); }
.info-icon-wrap { width: 60px; height: 60px; background: #f0fdfa; border-radius: 1.2rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--teal); }

/* ══════════════════════════════════════
   FORM
   ══════════════════════════════════════ */
.form-container-lux { border-radius: 3rem; border: 1px solid white; box-shadow: 0 40px 100px rgba(0,0,0,0.04); }
.input-label { font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px; margin-left: 5px; }
.lux-input { width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 1.2rem; padding: 1.2rem 1.5rem; font-size: 0.95rem; transition: all 0.3s; }
.lux-input:focus { outline: none; border-color: var(--teal); background: white; box-shadow: 0 0 0 4px rgba(13,148,136,0.1); }

.btn-premium-lux { display: block; width: 100%; padding: 1.2rem; background: var(--teal-dark); color: white; border-radius: 1.2rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; transition: all 0.3s; }
.btn-premium-lux:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(13,78,74,0.3); }
.btn-premium-lux:disabled { opacity: 0.6; cursor: not-allowed; }

.success-circle { width: 80px; height: 80px; background: var(--teal); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; box-shadow: 0 15px 30px rgba(13,148,136,0.3); }

/* ══════════════════════════════════════
   UTILS
   ══════════════════════════════════════ */
.glass-premium { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(25px); }

.sr { opacity: 0; transform: translateY(40px); transition: 1s cubic-bezier(0.16, 1, 0.3, 1); }
.sr--on { opacity: 1; transform: none; }
.sr-child { opacity: 0; transform: translateY(20px); transition: 0.7s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0s); }
.sr-child--on { opacity: 1; transform: none; }

.hero-title { opacity: 0; transform: translateY(20px); transition: 1s ease-out; }
.contact-page .hero-title { opacity: 1; transform: none; }

.ag-float { animation: float 6s ease-in-out infinite; }
.ag-float--light { --amp: 10px; animation-duration: 5s; }
.ag-float--medium { --amp: 15px; animation-duration: 7s; }
.ag-float--heavy { --amp: 20px; animation-duration: 8s; }
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(calc(-1 * var(--amp, 10px))); }
}

@media (max-width: 1024px) {
  .hero-contact { padding-top: 100px; }
  .form-container-lux { padding: 2rem; border-radius: 2rem; }
}
</style>
