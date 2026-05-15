<template>
  <div class="home" :class="{ 'reduced-motion': prefersReducedMotion }" ref="homeRef">
    <!-- LIGHT ORBES (Antigravity layer 0) -->
    <div class="orb orb-1" />
    <div class="orb orb-2" />
    <div class="orb orb-3" />
    <canvas ref="particleCanvas" class="particle-canvas" aria-hidden="true" />

    <!-- LIGNE ECG DÉCORATIVE -->
    <div class="ecg-bar" aria-hidden="true">
      <svg class="ecg-svg" viewBox="0 0 1200 40" preserveAspectRatio="none">
        <polyline
          class="ecg-line"
          points="0,20 20,20 30,4 40,36 50,2 60,38 70,20 80,20
                  80,20 100,20 110,4 120,36 130,2 140,38 150,20 160,20
                  160,20 180,20 190,4 200,36 210,2 220,38 230,20 240,20
                  240,20 260,20 270,4 280,36 290,2 300,38 310,20 320,20
                  320,20 340,20 350,4 360,36 370,2 380,38 390,20 400,20
                  400,20 420,20 430,4 440,36 450,2 460,38 470,20 480,20
                  480,20 500,20 510,4 520,36 530,2 540,38 550,20 560,20
                  560,20 580,20 590,4 600,36 610,2 620,38 630,20 640,20
                  640,20 660,20 670,4 680,36 690,2 700,38 710,20 720,20
                  720,20 740,20 750,4 760,36 770,2 780,38 790,20 800,20
                  800,20 820,20 830,4 840,36 850,2 860,38 870,20 880,20
                  880,20 900,20 910,4 920,36 930,2 940,38 950,20 960,20
                  960,20 980,20 990,4 1000,36 1010,2 1020,38 1030,20 1040,20
                  1040,20 1060,20 1070,4 1080,36 1090,2 1100,38 1110,20 1120,20
                  1120,20 1140,20 1150,4 1160,36 1170,2 1180,38 1190,20 1200,20"
        />
      </svg>
    </div>

    <!-- HERO -->
    <section class="hero sr" ref="heroRef">
      <div class="hero__bg-grid" />
      <div class="hero__content">
        <div class="hero__eyebrow sr-child">
          <span class="eyebrow-line" />
          <span>Reference Hospital · Nomayos, Cameroon</span>
          <span class="eyebrow-line eyebrow-line--r" />
        </div>

        <h1 class="hero__title sr-child">
          <span class="hero__title-top">Excellence in Care</span>
          <span class="hero__title-bottom">
            <span class="title-accent">St. Therese</span>
          </span>
        </h1>

        <p class="hero__subtitle sr-child ag-float ag-float--light" style="--float-delay:.35s;--float-dur:5.3s">
          High-precision medicine at the service of every patient.<br />
          Expertise, technology, and humanity combined.
        </p>

        <div class="hero__actions sr-child">
          <RouterLink to="/book" class="btn-hex btn-hex--primary ag-float ag-float--medium" style="--float-delay:.15s;--float-dur:4.8s">
            <span class="btn-hex__face">Book a Visit</span>
          </RouterLink>
          <RouterLink to="/about" class="btn-hex btn-hex--ghost ag-float ag-float--light" style="--float-delay:.55s;--float-dur:5.6s">
            <span class="btn-hex__face">Discover the Hospital</span>
          </RouterLink>
        </div>
      </div>

      <!-- ORBITAL VISUAL -->
      <div class="hero__visual sr-child">
        <div class="ring ring--outer" />
        <div class="ring ring--middle" />
        <div class="ring ring--inner" />

        <div class="hero__main-img-wrap ag-float ag-float--medium" style="--float-delay:.8s;--float-dur:6s">
          <img src="/assets/images/about/1.png" alt="St. Therese Excellence" class="hero__main-img-photo" />
          <div class="hero__main-img-overlay" />
        </div>

        <div class="orb-spec orb-spec--top ag-float ag-float--light" style="--float-delay:0s;--float-dur:4.2s">
          <span class="orb-spec__val">7,154</span><span class="orb-spec__lbl">Patients / year</span>
        </div>
        <div class="orb-spec orb-spec--right ag-float ag-float--light" style="--float-delay:.4s;--float-dur:5.5s">
          <span class="orb-spec__val">98%</span><span class="orb-spec__lbl">Satisfaction</span>
        </div>
        <div class="orb-spec orb-spec--bottom ag-float ag-float--light" style="--float-delay:.9s;--float-dur:3.8s">
          <span class="orb-spec__val">40+</span><span class="orb-spec__lbl">Specialists</span>
        </div>
        <div class="orb-spec orb-spec--left ag-float ag-float--light" style="--float-delay:1.3s;--float-dur:6.1s">
          <span class="orb-spec__val">24/7</span><span class="orb-spec__lbl">Emergency</span>
        </div>

        <div class="orb-iso ag-float ag-float--light" style="--float-delay:1.8s;--float-dur:5s">
          <span class="orb-iso__icon">✦</span>
          <div>
            <div class="orb-iso__title">ISO 9001</div>
            <div class="orb-iso__sub">Certified Quality</div>
          </div>
        </div>
      </div>
    </section>

    <!-- SERVICES -->
    <section class="services sr" ref="servicesRef">
      <div class="section-header sr-child">
        <div class="section-badge">Our Disciplines</div>
        <h2 class="section-title">Medical Specialties</h2>
        <p class="section-sub">Expert teams in every field for total patient care.</p>
      </div>

      <div class="diamond-grid">
        <div
          v-for="(svc, i) in services"
          :key="svc.id"
          class="dc sr-child ag-float"
          :class="i % 2 === 0 ? 'ag-float--medium' : 'ag-float--light'"
          :style="`--float-delay:${0.2 + i * 0.33}s; --float-dur:${4.2 + i * 0.41}s; --sr-delay:${i * 0.08}s`"
          @mouseenter="onDiamondEnter"
          @mouseleave="onDiamondLeave"
        >
          <div class="dc__shape">
            <div class="dc__inner">
              <div class="dc__spec dc__spec--top">{{ svc.stat }}</div>
              <div class="dc__spec dc__spec--bottom">{{ svc.unit }}</div>
              <div class="dc__content">
                <div class="dc__icon">{{ svc.icon }}</div>
                <h3 class="dc__name">{{ svc.name }}</h3>
                <p class="dc__desc">{{ svc.desc }}</p>
              </div>
            </div>
          </div>
          <div class="dc__corner dc__corner--tl" />
          <div class="dc__corner dc__corner--tr" />
          <div class="dc__corner dc__corner--bl" />
          <div class="dc__corner dc__corner--br" />
          <div class="dc__glow" />
        </div>
      </div>
    </section>

    <!-- STATS BAND -->
    <section class="stats-band sr" ref="statsRef">
      <div class="stats-band__grid">
        <article v-for="(s, i) in stats" :key="s.label" class="stat sr-child ag-float ag-float--light" :style="`--sr-delay:${i * .06}s;--float-delay:${i * .42}s;--float-dur:${4.1 + i * .34}s`">
          <div class="stat__val">{{ s.display }}</div>
          <div class="stat__lbl">{{ s.label }}</div>
          <div v-if="i < stats.length - 1" class="stat__sep" />
        </article>
      </div>
    </section>

    <!-- WHY US -->
    <section class="why sr" ref="whyRef">
      <div class="why__left sr-child">
        <div class="section-badge">Our Commitment</div>
        <h2 class="section-title">Why<br /><em>St. Therese?</em></h2>
        <p class="section-sub">
          An establishment designed for clinical excellence, human proximity, and reliable diagnostics.
        </p>
        <RouterLink to="/about" class="btn-hex btn-hex--primary ag-float ag-float--medium" style="--float-delay:.3s;--float-dur:4.9s">
          <span class="btn-hex__face">Our Story</span>
        </RouterLink>
      </div>

      <div class="why__right sr-child">
        <div class="section-img-wrap ag-float ag-float--medium" style="--float-delay:.75s;--float-dur:5.8s">
          <img src="/assets/images/sliders/1.jpg" alt="St. Therese Facility" class="section-img" />
          <div class="img-corner img-corner--tl" />
          <div class="img-corner img-corner--br" />

          <div class="img-badge img-badge--main ag-float ag-float--light" style="--float-delay:.2s;--float-dur:4.4s">
            <span>◈</span>
            <div><strong>Reliable Data</strong><small>Clear decisions</small></div>
          </div>
          <div class="img-badge img-badge--secondary ag-float ag-float--light" style="--float-delay:.6s;--float-dur:5.2s">
            <span>✦</span>
            <div><strong>24/7</strong><small>Emergency Care</small></div>
          </div>
          <div class="img-badge img-badge--stat ag-float ag-float--light" style="--float-delay:1.1s;--float-dur:6s">
            <span>◇</span>
            <div><strong>97%</strong><small>Satisfaction</small></div>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="testimonials sr" ref="testRef">
      <div class="section-header sr-child">
        <div class="section-badge">Testimonials</div>
        <h2 class="section-title">What Our Patients Say</h2>
      </div>
      <div class="testi-track">
        <article
          v-for="(t, idx) in [...testimonials, ...testimonials]"
          :key="`${t.id}-${idx}`"
          class="testi-card ag-float ag-float--light"
          :style="`--float-delay:${0.2 + idx * .25}s;--float-dur:${4.8 + idx * .2}s`"
        >
          <p class="testi-card__text">{{ t.text }}</p>
          <div class="testi-card__footer">
            <span class="testi-card__avatar">{{ t.initials }}</span>
            <div>
              <div class="testi-card__name">{{ t.name }}</div>
              <div class="testi-card__role">{{ t.role }}</div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta sr" ref="ctaRef">
      <div class="cta__bg" />
      <h2 class="cta__title sr-child">Your health deserves the best.</h2>
      <p class="cta__sub sr-child" style="--sr-delay:.1s">Book an appointment today with one of our specialists.</p>
      <div class="cta__actions sr-child" style="--sr-delay:.2s">
        <RouterLink to="/book" class="btn-hex btn-hex--primary ag-float ag-float--medium" style="--float-delay:.15s;--float-dur:4.6s">
          <span class="btn-hex__face">Book a Consultation</span>
        </RouterLink>
        <RouterLink to="/contact" class="btn-hex btn-hex--ghost ag-float ag-float--light" style="--float-delay:.55s;--float-dur:5.4s">
          <span class="btn-hex__face">Contact Us</span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const services = [
  { id: 1, name: 'Cardiology', icon: '♥', desc: 'Diagnosis and treatment of heart diseases.', stat: '163+', unit: 'Interventions / year' },
  { id: 2, name: 'Pediatrics', icon: '✦', desc: 'Care dedicated to infants, children, and adolescents.', stat: '98%', unit: 'Satisfaction' },
  { id: 3, name: 'Radiology', icon: '◈', desc: 'High-definition imaging: scanner, MRI, ultrasound.', stat: '24/7', unit: 'Availability' },
  { id: 4, name: 'Surgery', icon: '⊕', desc: 'Latest generation operating rooms.', stat: '5', unit: 'Operating Rooms' },
  { id: 5, name: 'Maternity', icon: '◇', desc: 'Complete support from pregnancy to childbirth.', stat: '1,381', unit: 'Births / year' },
  { id: 6, name: 'Emergency', icon: '⚡', desc: 'Immediate care 24/7.', stat: '<15min', unit: 'Waiting Time' }
]

const stats = [
  { display: '7,154', label: 'Tests & patients (2022)' },
  { display: '1,381', label: 'Free visits / month' },
  { display: '40+',   label: 'Specialists' },
  { display: '98%',   label: 'Satisfaction Rate' }
]

const testimonials = [
  { id: 1, text: 'Exceptional care and very human staff.', name: 'Marie-Claire N.', role: 'Maternity Patient', initials: 'MC' },
  { id: 2, text: 'Rapid diagnosis and effective treatment in cardiology.', name: 'Paul Eto’o', role: 'Cardiology Patient', initials: 'PE' },
  { id: 3, text: 'Warm welcome and modern infrastructure.', name: 'Dr. Amina K.', role: 'Referring Physician', initials: 'AK' },
  { id: 4, text: 'The pediatric service was remarkable with my child.', name: 'Josiane M.', role: 'Mother of patient', initials: 'JM' }
]

const homeRef = ref<HTMLElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const servicesRef = ref<HTMLElement | null>(null)
const statsRef = ref<HTMLElement | null>(null)
const whyRef = ref<HTMLElement | null>(null)
const testRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const particleCanvas = ref<HTMLCanvasElement | null>(null)

const prefersReducedMotion = ref(false)
const cursor = { x: -500, y: -500 }
let animationFrame = 0
let observer: IntersectionObserver | null = null
let cleanupResize: (() => void) | null = null

function ensureFonts() {
  const fontId = 'ag-v2-fonts'
  if (document.getElementById(fontId)) return
  const link = document.createElement('link')
  link.id = fontId
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;600;700&family=DM+Sans:wght@300;400;600&display=swap'
  document.head.appendChild(link)
}

function revealChars(...els: (HTMLElement | null)[]) {
  // Logic removed to avoid cutting words
}

function initScrollReveal() {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('sr--on')
        entry.target.querySelectorAll<HTMLElement>('.sr-child').forEach((child, idx) => {
          if (!child.style.getPropertyValue('--sr-delay')) child.style.setProperty('--sr-delay', `${idx * 0.08}s`)
          child.classList.add('sr-child--on')
        })
      })
    },
    { threshold: 0.1 }
  )
  ;[heroRef.value, servicesRef.value, statsRef.value, whyRef.value, testRef.value, ctaRef.value].forEach((section) => {
    if (section) observer?.observe(section)
  })
}

function initParticles() {
  const canvas = particleCanvas.value
  if (!canvas || prefersReducedMotion.value) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const particles: any[] = []
  
  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = homeRef.value ? homeRef.value.offsetHeight : window.innerHeight
  }

  for (let idx = 0; idx < 65; idx += 1) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1 + Math.random() * 2,
      alpha: 0.1 + Math.random() * 0.3
    })
  }

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(13, 148, 136, ${p.alpha})`
      ctx.fill()
    })
    animationFrame = requestAnimationFrame(draw)
  }
  resize()
  draw()
  window.addEventListener('resize', resize)
  cleanupResize = () => window.removeEventListener('resize', resize)
}

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ensureFonts()
  initScrollReveal()
  initParticles()
})

function onDiamondEnter(event: Event) {
  const target = event.currentTarget as HTMLElement
  const shape = target.querySelector<HTMLElement>('.dc__shape')
  if (shape) {
    shape.style.transform = 'rotate(45deg) scale(1.08) translateY(-6px)'
    shape.style.borderColor = 'var(--teal)'
  }
}
function onDiamondLeave(event: Event) {
  const target = event.currentTarget as HTMLElement
  const shape = target.querySelector<HTMLElement>('.dc__shape')
  if (shape) {
    shape.style.transform = 'rotate(45deg)'
    shape.style.borderColor = ''
  }
}

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  observer?.disconnect()
  cleanupResize?.()
})
</script>

<style scoped>
.home {
  --teal: #0d9488;
  --teal-lt: #14b8a6;
  --gold: #c9a84c;
  --gold-lt: #e8c97a;
  --bg: #f8fbfa;
  --text: #0f172a;
  --muted: #64748b;
  --bdr: rgba(13, 148, 136, 0.1);
  --fd: 'Cormorant Garamond', Georgia, serif;
  --fb: 'DM Sans', sans-serif;
  
  position: relative;
  background: var(--bg);
  color: var(--text);
  font-family: var(--fb);
  overflow-x: hidden;
}

/* ORBES */
.orb { position: fixed; border-radius: 50%; filter: blur(100px); opacity: 0.3; z-index: 0; pointer-events: none; animation: orb-drift 40s linear infinite; }
.orb-1 { width: 600px; height: 600px; background: #ccf2f4; top: -10%; left: -5%; }
.orb-2 { width: 500px; height: 500px; background: #fef3c7; bottom: 5%; right: -5%; animation-duration: 50s; }
.orb-3 { width: 400px; height: 400px; background: #e0f2fe; top: 40%; left: 30%; }

.particle-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: 0.6; }

/* ECG */
.ecg-bar { position: absolute; left: 0; top: 0; width: 100%; opacity: 0.15; z-index: 1; }
.ecg-svg { width: 200%; height: 40px; animation: ecg-slide 10s linear infinite; }
.ecg-line { fill: none; stroke: var(--teal); stroke-width: 2; }

/* HERO */
.hero { min-height: 90vh; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; padding: 120px 8vw 60px; position: relative; z-index: 2; }
.hero__bg-grid { position: absolute; inset: 0; background-image: radial-gradient(var(--bdr) 1px, transparent 1px); background-size: 40px 40px; mask-image: radial-gradient(ellipse at 50% 50%, black, transparent); opacity: 0.4; }
.hero__eyebrow { display: flex; align-items: center; gap: 1rem; color: var(--teal); font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; font-size: 0.75rem; margin-bottom: 0.75rem; }
.eyebrow-line { width: 40px; height: 1px; background: var(--teal); }
.hero__title { font-family: var(--fd); font-size: clamp(2.5rem, 5vw, 5rem); line-height: 1; font-weight: 800; margin-bottom: 0.75rem; }
.hero__title-top, .hero__title-bottom { display: block; line-height: 1; margin: 0; }
.hero__title-bottom { margin-top: 0.08em; }
.title-accent { color: var(--teal); }
.hero__subtitle { color: var(--muted); font-size: 1.1rem; line-height: 1.6; margin: 0.75rem 0 1.5rem; max-width: 500px; }
.hero__actions { display: flex; gap: 1rem; }

/* VISUAL */
.hero__visual { position: relative; width: 100%; max-width: 450px; aspect-ratio: 1/1; margin: 0 auto; display: flex; align-items: center; justify-content: center; }
.ring { position: absolute; border: 1px solid var(--bdr); border-radius: 50%; inset: 0; }
.hero__main-img-wrap { position: absolute; inset: 15%; border-radius: 3rem; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.1); z-index: 2; }
.hero__main-img-photo { width: 100%; height: 100%; object-fit: cover; }
.hero__main-img-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, rgba(13,148,136,0.1)); }

.orb-spec { position: absolute; background: white; padding: 0.6rem 1rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid var(--bdr); display: flex; flex-direction: column; align-items: center; min-width: 100px; }
.orb-spec__val { font-weight: 800; color: var(--teal); font-size: 1.1rem; }
.orb-spec__lbl { font-size: 0.65rem; color: var(--muted); text-transform: uppercase; font-weight: 600; }
.orb-spec--top { top: -10px; left: 50%; transform: translateX(-50%); }
.orb-spec--right { right: -20px; top: 50%; transform: translateY(-50%); }
.orb-spec--bottom { bottom: -10px; left: 50%; transform: translateX(-50%); }
.orb-spec--left { left: -20px; top: 50%; transform: translateY(-50%); }

.orb-iso { position: absolute; bottom: 20px; right: -40px; background: white; padding: 0.8rem 1.2rem; border-radius: 1.2rem; box-shadow: 0 15px 35px rgba(0,0,0,0.08); border: 1px solid rgba(201,168,76,0.2); display: flex; gap: 0.8rem; align-items: center; }
.orb-iso__icon { color: var(--gold); font-size: 1.2rem; }
.orb-iso__title { font-weight: 800; font-size: 0.85rem; color: #1e293b; }
.orb-iso__sub { font-size: 0.7rem; color: var(--muted); }

/* SECTIONS */
.services, .why, .testimonials, .cta { padding: 100px 8vw; position: relative; z-index: 2; }
.section-badge { display: inline-block; padding: 6px 16px; background: white; border: 1px solid var(--bdr); border-radius: 999px; color: var(--teal); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.2rem; }
.section-title { font-family: var(--fd); font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 800; margin-bottom: 1rem; }
.section-title em { color: var(--gold); font-style: italic; }
.section-sub { color: var(--muted); max-width: 600px; margin: 0 auto; line-height: 1.7; }

/* DIAMOND CARDS */
.diamond-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4rem 2rem; margin-top: 5rem; padding-top: 2rem; }
.dc { position: relative; width: clamp(160px, 15vw, 220px); height: clamp(160px, 15vw, 220px); margin: 0 auto; }
.dc__shape { position: absolute; inset: 0; transform: rotate(45deg); background: white; border: 1px solid var(--bdr); border-radius: 1.5rem; transition: all 0.5s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
.dc__content { 
  position: absolute; 
  inset: 0; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  text-align: center; 
  padding: 1.5rem; 
  transform: rotate(-45deg); /* Counter-rotate to keep text horizontal */
}
.dc__icon { font-size: 1.8rem; color: var(--teal); margin-bottom: 0.5rem; }
.dc__name { font-size: 1rem; font-weight: 800; color: #1e293b; }
.dc__desc { font-size: 0.75rem; color: var(--muted); line-height: 1.4; margin-top: 0.4rem; }
.dc__spec { position: absolute; font-size: 0.65rem; font-weight: 700; color: var(--teal); white-space: nowrap; }
.dc__spec--top { top: -25px; left: 50%; transform: translateX(-50%); }
.dc__spec--bottom { bottom: -25px; left: 50%; transform: translateX(-50%); color: var(--muted); }

/* STATS */
.stats-band { background: white; border-top: 1px solid var(--bdr); border-bottom: 1px solid var(--bdr); padding: 60px 8vw; }
.stats-band__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
.stat { text-align: center; position: relative; }
.stat__val { font-size: 2.5rem; font-weight: 800; color: var(--teal); font-family: var(--fd); line-height: 1; }
.stat__lbl { font-size: 0.8rem; color: var(--muted); font-weight: 600; margin-top: 0.5rem; }
.stat__sep { position: absolute; right: -1rem; top: 15%; bottom: 15%; width: 1px; background: var(--bdr); }

/* WHY US */
.why { display: grid; grid-template-columns: 1fr 1.2fr; gap: 5rem; align-items: center; }
.section-img-wrap { position: relative; border-radius: 3rem; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.12); }
.section-img { width: 100%; height: 450px; object-fit: cover; }
.img-badge { position: absolute; background: white; padding: 1rem 1.5rem; border-radius: 1.5rem; box-shadow: 0 15px 40px rgba(0,0,0,0.1); border: 1px solid var(--bdr); display: flex; gap: 0.8rem; align-items: center; }
.img-badge--main { bottom: 30px; left: 30px; }
.img-badge--secondary { top: 30px; right: 30px; }
.img-badge--stat { bottom: 80px; right: -20px; }
.img-badge strong { font-size: 0.85rem; color: #1e293b; display: block; }
.img-badge small { font-size: 0.7rem; color: var(--muted); }

/* TESTIMONIALS */
.testi-track { display: flex; gap: 2rem; overflow-x: auto; padding: 20px 0; scroll-behavior: smooth; }
.testi-track::-webkit-scrollbar { display: none; }
.testi-card { min-width: 350px; background: white; padding: 2.5rem; border-radius: 2rem; border: 1px solid var(--bdr); box-shadow: 0 15px 45px rgba(0,0,0,0.04); }
.testi-card__text { font-size: 1rem; color: #475569; line-height: 1.7; font-style: italic; }
.testi-card__footer { display: flex; align-items: center; gap: 1rem; margin-top: 2rem; }
.testi-card__avatar { width: 45px; height: 45px; background: var(--teal); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; }
.testi-card__name { font-weight: 700; color: #1e293b; }
.testi-card__role { font-size: 0.75rem; color: var(--muted); }

/* CTA */
.cta { text-align: center; background: white; border-top: 1px solid var(--bdr); }
.cta__bg { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(13,148,136,0.05), transparent); }
.cta__title { font-size: clamp(2rem, 4vw, 4rem); font-weight: 800; font-family: var(--fd); margin-bottom: 1.5rem; }
.cta__sub { font-size: 1.1rem; color: var(--muted); max-width: 600px; margin: 0 auto 3rem; }
.cta__actions { display: flex; justify-content: center; gap: 1.5rem; }

/* BUTTONS */
.btn-hex { display: inline-block; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.8rem; transition: all 0.4s ease; cursor: pointer; }
.btn-hex__face { padding: 14px 32px; display: block; clip-path: polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%); }
.btn-hex--primary { background: var(--teal); color: white; }
.btn-hex--primary:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(13,148,136,0.3); }
.btn-hex--ghost { background: transparent; color: var(--teal); border: 1px solid var(--teal); border-radius: 4px; }
.btn-hex--ghost:hover { background: rgba(13,148,136,0.05); transform: translateY(-5px); }

/* ANIMATIONS */
@keyframes orb-drift {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, 30px); }
}
@keyframes ecg-slide {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.sr { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
.sr--on { opacity: 1; transform: none; }
.sr-child { opacity: 0; transform: translateY(20px); transition: all 0.6s ease-out; }
.sr-child--on { opacity: 1; transform: none; }

.hero__title { opacity: 0; transform: translateY(20px); transition: 1s ease-out; }
.sr--on .hero__title { opacity: 1; transform: none; }

@media (max-width: 1024px) {
  .hero { grid-template-columns: 1fr; text-align: center; gap: 6rem; padding-top: 100px; }
  .hero__content { display: flex; flex-direction: column; align-items: center; order: 1; }
  .hero__visual { order: 2; transform: scale(0.9); }
  .why { grid-template-columns: 1fr; gap: 4rem; }
  .diamond-grid { grid-template-columns: repeat(2, 1fr); gap: 5rem 3rem; }
  .stats-band__grid { grid-template-columns: repeat(2, 1fr); gap: 3rem; }
}
@media (max-width: 640px) {
  .hero { padding-top: 80px; }
  .hero__title { font-size: 2.8rem; }
  .diamond-grid { grid-template-columns: 1fr; gap: 6rem; }
  .hero__visual { transform: scale(0.8); margin-bottom: 2rem; }
  .hero__actions { flex-direction: column; width: 100%; max-width: 320px; }
  .btn-hex { width: 100%; text-align: center; }
  .stats-band__grid { grid-template-columns: 1fr; }
  .stat__sep { display: none; }
}
</style>
