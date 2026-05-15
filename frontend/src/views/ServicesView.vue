<template>
  <main class="services-page" ref="pageRef" @mousemove="handleMouseMove">
    <!-- ══════════════════════════════════════
         DYNAMIC BACKGROUND
    ══════════════════════════════════════ -->
    <div class="dynamic-orbs">
      <div class="orb orb-1" :style="orbStyle(0.04)" />
      <div class="orb orb-2" :style="orbStyle(-0.02)" />
      <div class="orb orb-3" :style="orbStyle(0.015)" />
    </div>
    <canvas ref="particleCanvas" class="particle-canvas" aria-hidden="true" />

    <!-- ══════════════════════════════════════
         HERO SECTION - PRECISION & CLARITY
    ══════════════════════════════════════ -->
    <section class="hero-services">
      <div class="hero-mesh-bg" />
      <div class="container mx-auto px-4 text-center max-w-5xl relative z-10">
        <div class="floating-label sr-child">
          <span class="label-line" />
          <span class="label-txt">Diagnostics & Clinical Analysis</span>
          <span class="label-line" />
        </div>
        
        <h1 class="hero-title" ref="titleRef">
          Find the Right Test <br/>
          <span class="text-teal-600 italic font-serif">for Your Needs</span>
        </h1>
        
        <p class="hero-subtitle ag-float ag-float--light">
          "Knowledge is Power" — We directly connect our patients to their results 
          for informed and rapid health decisions.
        </p>

        <div class="hero-badges flex flex-wrap justify-center gap-6 mt-12 sr-child">
          <div class="mini-badge"><span class="icon"><Microscope :size="14" /></span> High Quality</div>
          <div class="mini-badge"><span class="icon"><Zap :size="14" /></span> Rapidity</div>
          <div class="mini-badge"><span class="icon"><ShieldCheck :size="14" /></span> Reliability</div>
        </div>
      </div>
      
      <div class="ecg-divider-premium">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
          <polyline class="ecg-line" points="0,20 100,20 110,4 120,36 130,2 140,38 150,20 300,20 310,4 320,36 330,2 340,38 350,20 1200,20" />
        </svg>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         SERVICES GRID - LUXURY CARDS
    ══════════════════════════════════════ -->
    <section class="services-grid py-32 sr">
      <div class="container mx-auto px-4">
        <div class="section-header-center text-center mb-20 sr-child">
          <div class="badge-premium mb-4">Our Test Menu</div>
          <h2 class="section-title-large">A <em>Complete</em> Range</h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div v-for="(svc, i) in services" :key="i" 
               class="service-lux-card ag-float" 
               :style="`--float-delay: ${i * 0.1}s; --float-dur: ${6 + i * 0.5}s`">
            <div class="card-inner">
              <div class="card-icon-lux"><component :is="svc.icon" :size="48" stroke-width="1.5" /></div>
              <h3 class="card-title-lux">{{ svc.title }}</h3>
              <p class="card-desc-lux">{{ svc.desc }}</p>
              <div class="card-features">
                <span v-for="feat in svc.features" :key="feat" class="feat-tag">
                  <span class="dot" /> {{ feat }}
                </span>
              </div>
            </div>
            <div class="card-bg-gradient" />
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         PREPARATION SECTION - BENTO STYLE
    ══════════════════════════════════════ -->
    <section class="preparation-section py-32 bg-slate-50 relative sr">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-16 items-center">
          <div class="lg:w-1/2 space-y-8 sr-child">
            <div class="badge-premium">Patient Guide</div>
            <h2 class="section-title-large">How to Prepare <br/> <em>for a Test?</em></h2>
            <p class="text-slate-600 text-lg leading-relaxed">
              Good preparation ensures the accuracy of your results. Follow these simple steps 
              for everything to go as well as possible on the day of your visit.
            </p>
            <div class="prep-steps space-y-6">
              <div class="prep-step flex gap-6">
                <div class="step-num">01</div>
                <div>
                  <h4 class="font-bold text-teal-900">Forms in Advance</h4>
                  <p class="text-slate-500 text-sm">Complete your personal information before coming to reduce waiting time.</p>
                </div>
              </div>
              <div class="prep-step flex gap-6">
                <div class="step-num">02</div>
                <div>
                  <h4 class="font-bold text-teal-900">Fasting (If Necessary)</h4>
                  <p class="text-slate-500 text-sm">Some tests require fasting since the previous evening.</p>
                </div>
              </div>
              <div class="prep-step flex gap-6">
                <div class="step-num">03</div>
                <div>
                  <h4 class="font-bold text-teal-900">No Fragrance</h4>
                  <p class="text-slate-500 text-sm">Avoid perfumes or scented creams for everyone's comfort.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 relative">
            <div class="glass-form-card glass-premium p-10 ag-float--medium">
              <div v-if="submitted" class="text-center py-10 animate-fade-in">
                <div class="success-icon-lux mb-6 text-teal-600 text-5xl">✓</div>
                <h3 class="text-2xl font-bold mb-4 text-teal-900">Request Sent!</h3>
                <p class="text-slate-600 mb-8">We will contact you soon to confirm your appointment.</p>
                <button class="btn-full-premium" @click="submitted = false">New Booking</button>
              </div>
              <div v-else>
                <h3 class="text-2xl font-bold mb-6 text-teal-900 text-center">Book an Appointment</h3>
                <form class="space-y-4" @submit.prevent="handleAppointment">
                  <div class="grid grid-cols-2 gap-4">
                    <input v-model="appointmentForm.name" type="text" required placeholder="Full Name" class="lux-input" />
                    <input v-model="appointmentForm.email" type="email" placeholder="Email (optional)" class="lux-input" />
                  </div>
                  <input v-model="appointmentForm.phone" type="tel" required placeholder="Phone Number" class="lux-input" />
                  <div class="grid grid-cols-2 gap-4">
                    <select v-model="appointmentForm.service" class="lux-input">
                      <option>Select a service</option>
                      <option>General Diagnostic</option>
                      <option>Genetics</option>
                      <option>Hormones</option>
                    </select>
                    <input v-model="appointmentForm.date" type="date" required class="lux-input" />
                  </div>
                  <textarea v-model="appointmentForm.message" placeholder="Comments or specific needs..." class="lux-input h-24"></textarea>
                  <button type="submit" class="btn-full-premium" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Sending...' : 'Confirm Request' }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         EXTRA INFO - GRID OF FEATURES
    ══════════════════════════════════════ -->
    <section class="extra-info py-32 sr">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(info, i) in extraInfos" :key="i" class="info-lux-box sr-child" :style="`--delay: ${i * 0.1}s`">
            <div class="info-icon"><component :is="info.icon" :size="40" stroke-width="1.5" /></div>
            <h4 class="info-title">{{ info.title }}</h4>
            <p class="info-text">{{ info.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         FINAL CTA - IMMERSIVE
    ══════════════════════════════════════ -->
    <section class="final-cta-lux py-40 sr">
      <div class="cta-lux-bg" />
      <div class="container mx-auto px-4 relative z-10 text-center">
        <div class="cta-icon-float ag-float--heavy"><Sparkles :size="64" /></div>
        <h2 class="cta-title-lux sr-child">"Helping To Deliver Answers <br/> For Health Questions."</h2>
        <p class="cta-sub-lux sr-child" style="--delay: 0.1s">
          Your health deserves reliable data. <br/>
          Contact our team for any questions about our services.
        </p>
        <div class="cta-actions-lux sr-child" style="--delay: 0.2s">
          <a href="tel:+237678061126" class="btn-premium-lux">Call (+237) 678 06 11 26</a>
          <a href="/contact" class="btn-outline-lux">Write to Us</a>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { 
  Dna, 
  Sprout, 
  Apple, 
  Globe, 
  Droplets, 
  Cpu, 
  Microscope, 
  CheckCircle, 
  Accessibility, 
  Zap, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-vue-next'

// --- DATA ---
const isSubmitting = ref(false)
const submitted = ref(false)
const appointmentForm = reactive({
  name: '',
  email: '',
  phone: '',
  service: 'Select a service',
  date: '',
  message: ''
})

const handleAppointment = async () => {
  isSubmitting.value = true
  try {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentForm)
    })
    const data = await response.json()
    if (data.success) {
      submitted.value = true
    }
  } catch (error) {
    console.error('Appointment error:', error)
    alert('An error occurred during booking.')
  } finally {
    isSubmitting.value = false
  }
}

const services = [
  { 
    icon: Dna, 
    title: 'General Diagnostic', 
    desc: 'Exceptional quality tests for early detection of gastrointestinal, immunological, and cardiovascular disorders.',
    features: ['Gastrointestinal', 'Immunology', 'Cardiovascular']
  },
  { 
    icon: Dna, 
    title: 'Specialized Genetics', 
    desc: 'DNA analysis useful at every stage of life to identify hereditary conditions or adapt your treatments.',
    features: ['Reproduction', 'Genetic Disorders', 'Hereditary Cancer']
  },
  { 
    icon: Sprout, 
    title: 'Naturopathic Laboratory', 
    desc: 'Objective information on hormone levels, environmental toxins, and sensitivities to trace your path to well-being.',
    features: ['Salivary Hormones', 'Inhalant Allergies', 'Toxins']
  },
  { 
    icon: Apple, 
    title: 'Food Sensitivity (IgG)', 
    desc: 'Precisely identify food reactions responsible for bloating, indigestion, or abdominal pain.',
    features: ['IgG Reactions', 'Chronic Pain', 'Digestion']
  },
  { 
    icon: Globe, 
    title: 'Genova Diagnostics', 
    desc: 'Partnership with a world-renowned laboratory for screening complex chronic diseases via a systemic approach.',
    features: ['Endocrinology', 'Genomics', 'Environment']
  },
  { 
    icon: Droplets, 
    title: 'Hormone Insights', 
    desc: 'Detailed urine analysis measuring cortisol, androgen, and progesterone metabolites for optimal balance.',
    features: ['Cortisol & Cortisone', 'Androgens', '17-ketosteroids']
  }
]

const extraInfos = [
  { icon: Cpu, title: 'Automation', text: 'Constant investment in new clinical chemistry technologies.' },
  { icon: Microscope, title: 'New Instruments', text: 'State-of-the-art equipment for increased precision and speed.' },
  { icon: CheckCircle, title: 'Strict Quality', text: 'Rigorous processes to ensure the excellence of every result.' },
  { icon: Accessibility, title: 'Accessibility', text: 'Wheelchair accessible establishment and autism-friendly welcome.' }
]

// --- MOUSE PARALLAX ---
const mousePos = ref({ x: 0, y: 0 })
const handleMouseMove = (e: MouseEvent) => {
  mousePos.value = { 
    x: (e.clientX - window.innerWidth / 2) / 25,
    y: (e.clientY - window.innerHeight / 2) / 25
  }
}
const orbStyle = (factor: number) => ({
  transform: `translate(${mousePos.value.x * factor}px, ${mousePos.value.y * factor}px)`
})

// --- ANIMATIONS LOGIC ---
const pageRef = ref<HTMLElement | null>(null)
const particleCanvas = ref<HTMLCanvasElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
let animId = 0
let observer: IntersectionObserver

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
  for(let i=0; i<45; i++) {
    pts.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random()-0.5)*0.2,
      vy: (Math.random()-0.5)*0.2,
      r: Math.random() * 2 + 0.3,
      alpha: Math.random() * 0.12 + 0.04
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
})
</script>

<style scoped>
@reference "../style.css";

.services-page {
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
.orb { position: fixed; border-radius: 50%; filter: blur(140px); opacity: 0.2; z-index: 0; pointer-events: none; transition: transform 0.2s ease-out; }
.orb-1 { width: 800px; height: 800px; background: #ccf2f4; top: -10%; right: -5%; }
.orb-2 { width: 600px; height: 600px; background: #fef3c7; bottom: 5%; left: -5%; }
.orb-3 { width: 400px; height: 400px; background: #e0f2fe; top: 40%; left: 30%; }

.particle-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

/* ══════════════════════════════════════
   HERO
   ══════════════════════════════════════ */
.hero-services { min-height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 140px 20px 80px; position: relative; }
.hero-mesh-bg { position: absolute; inset: 0; background-image: radial-gradient(rgba(13,148,136,0.08) 1.5px, transparent 1.5px); background-size: 40px 40px; mask-image: radial-gradient(circle at center, black, transparent); }

.floating-label { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; }
.label-line { height: 1px; width: 40px; background: linear-gradient(90deg, transparent, var(--teal)); }
.label-txt { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3em; color: var(--teal); }

.hero-title { font-size: clamp(2.5rem, 6vw, 5rem); line-height: 1.1; font-weight: 900; margin-bottom: 2rem; }
.hero-subtitle { font-size: 1.2rem; color: #64748b; max-width: 650px; line-height: 1.7; font-weight: 300; }

.mini-badge { background: white; padding: 8px 16px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(13,148,136,0.1); box-shadow: 0 4px 10px rgba(0,0,0,0.03); }

/* ══════════════════════════════════════
   SERVICE LUXURY CARDS
   ══════════════════════════════════════ */
.service-lux-card { background: white; border-radius: 2.5rem; border: 1px solid rgba(0,0,0,0.03); padding: 3rem; position: relative; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.02); transition: all 0.4s ease; }
.service-lux-card:hover { transform: translateY(-10px); border-color: var(--teal); box-shadow: 0 30px 60px rgba(13,148,136,0.08); }

.card-icon-lux { font-size: 3rem; margin-bottom: 2rem; }
.card-title-lux { font-size: 1.5rem; font-weight: 800; color: var(--teal-dark); margin-bottom: 1.2rem; }
.card-desc-lux { font-size: 0.95rem; color: #64748b; line-height: 1.6; margin-bottom: 2rem; }

.card-features { display: flex; flex-wrap: wrap; gap: 0.8rem; }
.feat-tag { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 700; color: var(--teal); background: rgba(13,148,136,0.05); padding: 4px 12px; border-radius: 999px; }
.dot { width: 4px; height: 4px; background: var(--teal); border-radius: 50%; }

/* ══════════════════════════════════════
   PREPARATION & FORM
   ══════════════════════════════════════ */
.step-num { width: 48px; height: 48px; border-radius: 50%; border: 2px solid var(--teal); display: flex; align-items: center; justify-content: center; font-weight: 900; color: var(--teal); flex-shrink: 0; }
.glass-form-card { border-radius: 3rem; position: relative; z-index: 5; }
.lux-input { width: 100%; background: #f8fafc; border: 1px solid rgba(0,0,0,0.05); border-radius: 1rem; padding: 1rem 1.5rem; font-size: 0.9rem; transition: all 0.3s; }
.lux-input:focus { outline: none; border-color: var(--teal); background: white; box-shadow: 0 0 0 4px rgba(13,148,136,0.1); }
.btn-full-premium { width: 100%; background: var(--teal); color: white; padding: 1.2rem; border-radius: 1.2rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s; }
.btn-full-premium:hover { background: var(--teal-dark); transform: translateY(-3px); box-shadow: 0 10px 25px rgba(13,148,136,0.3); }

/* ══════════════════════════════════════
   INFO BOXES
   ══════════════════════════════════════ */
.info-lux-box { text-align: center; padding: 2rem; }
.info-icon { font-size: 2.5rem; margin-bottom: 1.5rem; opacity: 0.8; }
.info-title { font-weight: 800; color: var(--teal-dark); margin-bottom: 0.5rem; }
.info-text { font-size: 0.85rem; color: #64748b; line-height: 1.5; }

/* ══════════════════════════════════════
   FINAL CTA
   ══════════════════════════════════════ */
.final-cta-lux { position: relative; background: #0f172a; color: white; border-radius: 6rem 6rem 0 0; }
.cta-lux-bg { position: absolute; inset: 0; background: radial-gradient(circle at 70% 30%, rgba(20,184,166,0.15), transparent 70%); }
.cta-icon-float { font-size: 4rem; color: var(--gold); margin-bottom: 2rem; opacity: 0.6; }
.cta-title-lux { font-size: clamp(2.5rem, 6vw, 4rem); font-family: 'Cormorant Garamond', serif; font-weight: 800; line-height: 1.2; margin-bottom: 2rem; }
.cta-sub-lux { font-size: 1.2rem; opacity: 0.7; max-width: 600px; margin: 0 auto 3.5rem; }

.btn-premium-lux { display: inline-block; padding: 18px 45px; background: var(--teal); color: white; border-radius: 999px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s; }
.btn-premium-lux:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(20,184,166,0.3); }
.btn-outline-lux { display: inline-block; padding: 18px 45px; border: 1px solid rgba(255,255,255,0.2); border-radius: 999px; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; margin-left: 1rem; }

/* ══════════════════════════════════════
   UTILS
   ══════════════════════════════════════ */
.glass-premium { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(25px); border: 1px solid white; box-shadow: 0 20px 60px rgba(0,0,0,0.05); }

.sr { opacity: 0; transform: translateY(40px); transition: 1s cubic-bezier(0.16, 1, 0.3, 1); }
.sr--on { opacity: 1; transform: none; }
.sr-child { opacity: 0; transform: translateY(20px); transition: 0.7s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0s); }
.sr-child--on { opacity: 1; transform: none; }

.hero-title { opacity: 0; transform: translateY(20px); transition: 1s ease-out; }
.services-page .hero-title { opacity: 1; transform: none; }

.badge-premium { display: inline-block; padding: 8px 20px; background: white; border: 1px solid rgba(13,148,136,0.15); border-radius: 999px; color: var(--teal); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
.section-title-large { font-size: clamp(2rem, 4vw, 3.5rem); font-family: 'Cormorant Garamond', serif; font-weight: 800; color: var(--teal-dark); line-height: 1.1; }
.section-title-large em { font-style: italic; color: var(--gold); }

.ag-float { animation: float 6s ease-in-out infinite; }
.ag-float--light { --amp: 10px; animation-duration: 5s; }
.ag-float--medium { --amp: 15px; animation-duration: 7s; }
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(calc(-1 * var(--amp, 10px))); }
}

@media (max-width: 768px) {
  .hero-services { padding-top: 100px; }
  .grid { grid-template-columns: 1fr; }
  .btn-outline-lux { margin-left: 0; margin-top: 1rem; width: 100%; }
  .btn-premium-lux { width: 100%; }
}
</style>
