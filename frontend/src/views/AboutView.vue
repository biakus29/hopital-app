<template>
  <main class="about-page" ref="pageRef" @mousemove="handleMouseMove">
    <!-- ══════════════════════════════════════
         FOND DYNAMIQUE (ANTIGRAVITY LAYER 0)
    ══════════════════════════════════════ -->
    <div class="dynamic-orbs">
      <div class="orb orb-1" :style="orbStyle(0.05)" />
      <div class="orb orb-2" :style="orbStyle(-0.03)" />
      <div class="orb orb-3" :style="orbStyle(0.02)" />
    </div>
    <canvas ref="particleCanvas" class="particle-canvas" aria-hidden="true" />

    <!-- ══════════════════════════════════════
         HERO SECTION - LUXURY TYPOGRAPHY
    ══════════════════════════════════════ -->
    <section class="hero-about">
      <div class="hero-grid-bg" />
      <div class="container mx-auto px-4 text-center max-w-5xl relative z-10">
        <div class="floating-label sr-child">
          <span class="label-line" />
          <span class="label-txt">Our Spiritual & Medical Commitment</span>
          <span class="label-line" />
        </div>
        
        <h1 class="hero-title" ref="titleRef">
          A Vision of Faith, <br/>
          <span class="text-teal-600 italic font-serif">Dedicated to Excellence</span>
        </h1>
        
        <p class="hero-subtitle ag-float ag-float--light">
          Since November 18, 2019, St. Therese of the Child Jesus Catholic Hospital 
          combines compassion and high technology in the heart of Nomayos.
        </p>

        <div class="hero-scroll-indicator ag-float--medium">
          <div class="mouse-icon">
            <div class="mouse-wheel" />
          </div>
          <span class="scroll-txt">Discover Our Story</span>
        </div>
      </div>
      
      <div class="ecg-divider-premium">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
          <polyline class="ecg-line" points="0,20 100,20 110,4 120,36 130,2 140,38 150,20 300,20 310,4 320,36 330,2 340,38 350,20 600,20 610,4 620,36 630,2 640,38 650,20 1200,20" />
        </svg>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         STORY SECTION - ASYMMETRIC LAYOUT
    ══════════════════════════════════════ -->
    <section class="story-asym py-32 sr">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row items-center gap-20">
          
          <div class="lg:w-1/2 relative">
            <div class="image-composition">
              <div class="img-main-wrap ag-float ag-float--medium">
                <img src="/assets/images/about/1.png" alt="St. Therese Excellence" class="img-main" />
                <div class="img-border-decor" />
              </div>
              <div class="img-sub-wrap ag-float ag-float--light" style="--float-delay: 0.5s">
                <img src="/assets/images/about/2.jpg" alt="Equipment" class="img-sub" />
                <div class="glass-overlay" />
              </div>
              <div class="experience-card ag-float--heavy">
                <span class="exp-val">25+</span>
                <span class="exp-lbl">Years of Experience</span>
              </div>
            </div>
          </div>

          <div class="lg:w-1/2 space-y-10 sr-child">
            <div class="badge-premium">Harnessing Our Medical Expertise</div>
            <h2 class="section-title-large">A central place at the service of <em>Health</em>.</h2>
            <p class="text-slate-600 text-xl leading-relaxed font-light">
              Located in the <span class="font-bold text-teal-800">St. Odile Parish</span>, the establishment was born from the vision of Sisters Felicitas Lukong and Sylvie Njume. 
            </p>
            <p class="text-slate-500 leading-relaxed">
              As the unique Catholic establishment in the district, we ensure a mission of care 
              based on rigor and empathy. The current administration, led by 
              <strong>Sr. Louisa Abid (Matron)</strong>, Sr. Comfort Lemyuy and Sr. Emeline Mengnjo, 
              perpetuates this legacy of excellence.
            </p>
            
            <div class="stats-row grid grid-cols-2 gap-8">
              <div class="luxury-stat">
                <div class="stat-icon"><Hospital :size="28" stroke-width="1.5" /></div>
                <div>
                  <div class="stat-num">7,154</div>
                  <div class="stat-label">Patients / Year (2022)</div>
                </div>
              </div>
              <div class="luxury-stat">
                <div class="stat-icon"><HandHeart :size="28" stroke-width="1.5" /></div>
                <div>
                  <div class="stat-num">1,381</div>
                  <div class="stat-label">Free Visits / Month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         EXPECTATIONS - BENTO GRID
    ══════════════════════════════════════ -->
    <section class="expectations-bento py-32 bg-slate-50/80 relative sr">
      <div class="container mx-auto px-4">
        <div class="section-header-left mb-16 sr-child">
          <div class="badge-premium">Prepare Your Visit</div>
          <h3 class="section-title-large">What You Need to Know</h3>
        </div>
        
        <div class="bento-grid">
          <div class="bento-item bento-main glass-premium ag-float--light">
            <div class="bento-icon"><Target :size="40" /></div>
            <h4>Prepare Your Documents</h4>
            <p>To reduce your waiting time, fill in your personal information in advance. A complete file ensures smooth processing.</p>
            <div class="bento-decor"><Sparkles :size="32" /></div>
          </div>
          
          <div class="bento-item bento-accent bg-teal-600 text-white ag-float--medium" style="--float-delay: 0.2s">
            <div class="bento-icon text-white"><Sparkles :size="40" /></div>
            <h4>Fragrance-Free Environment</h4>
            <p>We ensure everyone's comfort. Please avoid perfumes or scented creams during your visit.</p>
          </div>

          <div class="bento-item bento-info glass-premium ag-float--light" style="--float-delay: 0.4s">
            <div class="bento-icon"><Clock :size="40" /></div>
            <h4>Fasting Tests</h4>
            <p>Crowds are often higher in the morning as many tests require fasting.</p>
          </div>

          <div class="bento-item bento-cta glass-premium ag-float--medium" style="--float-delay: 0.6s">
            <div class="emergency-box">
              <span class="emergency-lbl">24/7 EMERGENCY</span>
              <span class="emergency-val">(+237) 678 06 11 26</span>
              <a href="tel:+237678061126" class="emergency-btn">Call Now</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         SPECIALIZED TESTS - DIAMOND CARDS
    ══════════════════════════════════════ -->
    <section class="specialized-luxury py-32 sr">
      <div class="container mx-auto px-4 text-center">
        <div class="badge-premium mb-6">World Class Diagnostics</div>
        <h2 class="section-title-large mb-20"><em>High Precision</em> Analysis</h2>
        
        <div class="diamond-grid-light">
          <div v-for="(test, i) in specializedTests" :key="i" 
               class="diamond-card-light ag-float" 
               :style="`--float-delay: ${i * 0.2}s; --float-dur: ${5 + i}s`">
            <div class="dc-shape">
              <div class="dc-inner">
                <div class="dc-icon-lux"><component :is="test.icon" :size="36" stroke-width="1.5" /></div>
                <h4 class="dc-name-lux">{{ test.name }}</h4>
                <p class="dc-desc-lux">{{ test.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         TABS - INTERACTIVE EXPERIENCE
    ══════════════════════════════════════ -->
    <section class="tabs-interactive py-32 sr">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="tabs-lux-container glass-premium-white sr-child">
          <div class="tabs-sidebar">
            <button 
              v-for="(tab, i) in tabs" 
              :key="tab.id"
              @click="selectTab(tab.id)"
              :class="['tab-lux-btn', { active: activeTab === tab.id }]"
            >
              <span class="tab-num">0{{ i + 1 }}</span>
              <span class="tab-label-lux">{{ tab.label }}</span>
              <ChevronRight v-if="activeTab === tab.id" class="tab-arrow" />
            </button>
          </div>
          
          <div class="tabs-main">
            <transition name="fade-up-lux" mode="out-in">
              <div :key="activeTab" class="tab-pane-lux">
                <div class="flex flex-col lg:flex-row gap-12 items-center">
                  <div class="lg:w-3/5 space-y-6 text-left">
                    <h4 class="tab-title-lux">{{ currentTab.title }}</h4>
                    <p class="tab-text-lux">{{ currentTab.text }}</p>
                    <div class="tab-meta flex items-center gap-4 text-teal-700 font-bold">
                      <span class="dot-pulse" />
                      Archdiocese Certified Quality
                    </div>
                  </div>
                  <div class="lg:w-2/5">
                    <div class="tab-img-frame ag-float--medium">
                      <img :src="currentTab.image" :alt="currentTab.title" class="tab-img-lux" />
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         LEADERSHIP TEAM - INTERACTIVE CARDS
    ══════════════════════════════════════ -->
    <section class="leadership-section py-32 sr">
      <div class="container mx-auto px-4">
        <div class="section-header-center text-center mb-20 sr-child">
          <div class="badge-premium mb-4">Leadership Team</div>
          <h2 class="section-title-large">The Faces Behind <em>Excellence</em></h2>
          <p class="section-sub max-w-2xl mx-auto">
            A dedicated team of professionals working hand in hand to ensure 
            the best care and resources for our patients and collaborators.
          </p>
        </div>

        <div class="team-grid">
          <div v-for="(member, i) in team" :key="i" 
               class="member-card ag-float" 
               :style="`--float-delay: ${i * 0.1}s; --float-dur: ${5 + i * 0.5}s`">
            <div class="member-img-wrap">
              <div class="member-img-placeholder">{{ member.initials }}</div>
              <div class="member-overlay">
                <div class="member-socials">
                  <span>✦</span>
                  <span>◈</span>
                  <span>◇</span>
                </div>
              </div>
            </div>
            <div class="member-info">
              <h4 class="member-name">{{ member.name }}</h4>
              <p class="member-role">{{ member.role }}</p>
            </div>
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
        <h2 class="cta-title-lux sr-child">Your health is our <br/> most beautiful mission.</h2>
        <p class="cta-sub-lux sr-child" style="--delay: 0.1s">
          "Helping To Deliver Answers For Health Questions." <br/>
          Global expertise, human proximity.
        </p>
        <div class="cta-actions-lux sr-child" style="--delay: 0.2s">
          <a href="/book" class="btn-premium-lux ag-float--light">Book an Appointment</a>
          <a href="/contact" class="btn-outline-lux">Contact Us</a>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  ChevronRight,
  Dna,
  Apple,
  Droplets,
  Sprout,
  Sparkles,
  Hospital,
  HandHeart,
  Target
} from 'lucide-vue-next'

// --- DATA ---
const activeTab = ref('history')
const specializedTests = [
  { icon: Dna, name: 'Genetic Tests', desc: 'Advanced DNA analysis for personalized care.' },
  { icon: Apple, name: 'Food Sensitivity', desc: 'Identify your body\'s reactions to your diet.' },
  { icon: Droplets, name: 'Hormonal Insights', desc: 'Complete check-ups for your overall health balance.' },
  { icon: Sprout, name: 'Naturopathic Tests', desc: 'Holistic approach combined with clinical rigor.' }
]

const team = [
  { name: 'Mike Dooley', role: 'Chief Executive', initials: 'MD' },
  { name: 'Michael Brian', role: 'Managing Director', initials: 'MB' },
  { name: 'Chris Wensel', role: 'Vice President', initials: 'CW' },
  { name: 'Richard Muldoone', role: 'Legal Officer', initials: 'RM' },
  { name: 'Maria Andaloro', role: 'HR Officer', initials: 'MA' },
  { name: 'Marian Chris', role: 'Global Sales', initials: 'MC' },
  { name: 'Jack Mudson', role: 'Manager', initials: 'JM' }
]

const tabs = [
  { id: 'history', label: 'History', title: 'Organic Growth', text: 'Located in St. Odile Parish of the Archdiocese of Yaoundé, the hospital became functional on Nov. 18, 2019. Born from the vision of Sisters Felicitas Lukong and Sylvie Njume, it is today the only Catholic establishment in the Mbankomo district.', image: '/assets/images/about/2.jpg' },
  { id: 'philosophy', label: 'Direction', title: 'A Dedicated Administration', text: 'Under the direction of Sr. Louisa Abid (Matron), accompanied by Sr. Comfort Lemyuy and Sr. Emeline Mengnjo, our administrative body ensures excellence in care and a humane welcome.', image: '/assets/images/about/4.jpg' },
  { id: 'quality', label: 'Quality', title: 'Commitment to Excellence', text: 'With 3 general practitioners and a team of 40 professionals, we maintain high standards of accuracy to deserve our patients\' trust every day.', image: '/assets/images/about/5.jpg' }
]

const currentTab = computed(() => tabs.find(t => t.id === activeTab.value)!)

// --- TABS AUTO-PLAY LOGIC ---
const autoPlayInterval = ref<any>(null)
function startAutoPlay() {
  stopAutoPlay()
  autoPlayInterval.value = setInterval(() => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab.value)
    const nextIndex = (currentIndex + 1) % tabs.length
    activeTab.value = tabs[nextIndex].id
  }, 5000)
}
function stopAutoPlay() {
  if (autoPlayInterval.value) clearInterval(autoPlayInterval.value)
}
function selectTab(id: string) {
  activeTab.value = id
  startAutoPlay() // Reset timer on manual click
}

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
  for(let i=0; i<50; i++) {
    pts.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random()-0.5)*0.25,
      vy: (Math.random()-0.5)*0.25,
      r: Math.random() * 2 + 0.3,
      alpha: Math.random() * 0.15 + 0.05
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
  startAutoPlay()
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  observer?.disconnect()
  stopAutoPlay()
})
</script>

<style scoped>
@reference "../style.css";

/* ══════════════════════════════════════
   TOKENS & CORE
   ══════════════════════════════════════ */
.about-page {
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
   BACKGROUND ELEMENTS
   ══════════════════════════════════════ */
.orb { position: fixed; border-radius: 50%; filter: blur(140px); opacity: 0.25; z-index: 0; pointer-events: none; transition: transform 0.2s ease-out; }
.orb-1 { width: 800px; height: 800px; background: #ccf2f4; top: -15%; right: -10%; }
.orb-2 { width: 600px; height: 600px; background: #fef3c7; bottom: -5%; left: -5%; }
.orb-3 { width: 400px; height: 400px; background: #e0f2fe; top: 45%; left: 35%; }

.particle-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: 0.5; }

/* ══════════════════════════════════════
   HERO
   ══════════════════════════════════════ */
.hero-about { min-height: 85vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 140px 20px 100px; position: relative; }
.hero-grid-bg { position: absolute; inset: 0; background-image: radial-gradient(rgba(13,148,136,0.1) 1px, transparent 1px); background-size: 50px 50px; mask-image: radial-gradient(ellipse at center, black, transparent); }

.floating-label { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2.5rem; }
.label-line { height: 1px; width: 40px; background: linear-gradient(90deg, transparent, var(--teal)); }
.label-line:last-child { background: linear-gradient(90deg, var(--teal), transparent); }
.label-txt { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3em; color: var(--teal); }

.hero-title { font-size: clamp(3rem, 7vw, 5.5rem); line-height: 1; font-weight: 900; margin-bottom: 2.5rem; }
.hero-subtitle { font-size: 1.25rem; color: #64748b; max-width: 700px; line-height: 1.8; font-weight: 300; }

.hero-scroll-indicator { margin-top: 5rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; color: #94a3b8; }
.mouse-icon { width: 24px; height: 40px; border: 2px solid #e2e8f0; border-radius: 20px; position: relative; }
.mouse-wheel { width: 4px; height: 8px; background: var(--teal); border-radius: 2px; position: absolute; top: 6px; left: 50%; transform: translateX(-50%); animation: scroll-anim 2s infinite; }
@keyframes scroll-anim { 0% { opacity: 1; transform: translate(-50%, 0); } 100% { opacity: 0; transform: translate(-50%, 15px); } }
.scroll-txt { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }

.ecg-divider-premium { width: 100%; position: absolute; bottom: 0; opacity: 0.1; }
.ecg-line { fill: none; stroke: var(--teal); stroke-width: 2; animation: ecg-sweep 15s linear infinite; }
@keyframes ecg-sweep { from { stroke-dashoffset: 2000; stroke-dasharray: 2000; } to { stroke-dashoffset: 0; stroke-dasharray: 2000; } }

/* ══════════════════════════════════════
   STORY
   ══════════════════════════════════════ */
.story-asym { position: relative; z-index: 5; }
.image-composition { position: relative; padding: 40px; }
.img-main-wrap { position: relative; border-radius: 4rem; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.12); z-index: 2; }
.img-main { width: 100%; height: 550px; object-fit: cover; }
.img-border-decor { position: absolute; inset: -15px; border: 1px solid rgba(201,168,76,0.2); border-radius: 4.5rem; pointer-events: none; }

.img-sub-wrap { position: absolute; bottom: -40px; right: -40px; width: 280px; height: 350px; border-radius: 3rem; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.1); z-index: 3; border: 8px solid white; }
.img-sub { width: 100%; height: 100%; object-fit: cover; }

.experience-card { position: absolute; top: 20px; left: -20px; background: white; padding: 2rem; border-radius: 2rem; box-shadow: 0 20px 40px rgba(0,0,0,0.06); border: 1px solid rgba(13,148,136,0.1); z-index: 4; display: flex; flex-direction: column; align-items: center; }
.exp-val { font-size: 3rem; font-weight: 900; color: var(--teal); font-family: 'Cormorant Garamond', serif; }
.exp-lbl { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; }

.badge-premium { display: inline-block; padding: 8px 20px; background: white; border: 1px solid rgba(13,148,136,0.15); border-radius: 999px; color: var(--teal); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
.section-title-large { font-size: clamp(2rem, 4vw, 3.8rem); font-family: 'Cormorant Garamond', serif; font-weight: 800; color: var(--teal-dark); line-height: 1.1; }
.section-title-large em { font-style: italic; color: var(--gold); }

.luxury-stat { display: flex; align-items: center; gap: 1.5rem; background: white; padding: 1.5rem; border-radius: 2rem; border: 1px solid rgba(0,0,0,0.03); box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
.stat-icon { font-size: 2rem; }
.stat-num { font-size: 2.2rem; font-weight: 900; color: var(--teal); line-height: 1; }
.stat-label { font-size: 0.75rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; margin-top: 4px; }

/* ══════════════════════════════════════
   BENTO GRID
   ══════════════════════════════════════ */
.bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 300px); gap: 2rem; }
.bento-item { border-radius: 3rem; padding: 3.5rem; display: flex; flex-direction: column; justify-content: flex-end; position: relative; overflow: hidden; transition: transform 0.4s ease; }
.bento-main { grid-column: span 2; }
.bento-accent { grid-row: span 2; }
.bento-icon { font-size: 3rem; margin-bottom: 2rem; }
.bento-item h4 { font-size: 1.6rem; font-weight: 800; margin-bottom: 1rem; }
.bento-item p { font-size: 0.95rem; color: inherit; opacity: 0.8; line-height: 1.6; }
.bento-decor { position: absolute; top: 2rem; right: 2rem; font-size: 2.5rem; color: var(--gold); opacity: 0.3; }

.emergency-box { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 1rem; }
.emergency-lbl { font-size: 0.75rem; font-weight: 900; letter-spacing: 0.2em; color: #ef4444; }
.emergency-val { font-size: 1.6rem; font-weight: 900; color: var(--teal-dark); }
.emergency-btn { background: var(--teal-dark); color: white; padding: 12px 30px; border-radius: 999px; font-weight: 700; font-size: 0.8rem; margin-top: 1rem; }

/* ══════════════════════════════════════
   DIAMOND CARDS
   ══════════════════════════════════════ */
.diamond-grid-light { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4rem; margin-top: 4rem; }
.diamond-card-light { width: 100%; aspect-ratio: 1; position: relative; }
.dc-shape { position: absolute; inset: 0; transform: rotate(45deg); background: white; border: 1px solid rgba(13,148,136,0.1); border-radius: 2.5rem; box-shadow: 0 15px 40px rgba(0,0,0,0.03); transition: all 0.5s ease; }
.diamond-card-light:hover .dc-shape { transform: rotate(45deg) scale(1.05) translateY(-10px); border-color: var(--teal); box-shadow: 0 25px 60px rgba(13,148,136,0.1); }
.dc-inner { position: absolute; inset: 0; transform: rotate(-45deg); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; }
.dc-icon-lux { font-size: 2.5rem; margin-bottom: 1rem; }
.dc-name-lux { font-weight: 800; color: var(--teal-dark); font-size: 1.1rem; margin-bottom: 0.5rem; }
.dc-desc-lux { font-size: 0.8rem; color: #94a3b8; line-height: 1.4; }

/* ══════════════════════════════════════
   TABS LUXURY
   ══════════════════════════════════════ */
.glass-premium-white { background: white; border-radius: 4rem; display: flex; overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.02); }
.tabs-sidebar { width: 300px; background: #f8fafc; padding: 3rem 0; border-right: 1px solid rgba(0,0,0,0.03); }
.tab-lux-btn { width: 100%; display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem 3rem; transition: all 0.3s; position: relative; }
.tab-lux-btn.active { background: white; color: var(--teal); }
.tab-lux-btn.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--teal);
  animation: tab-progress 5s linear forwards;
}
@keyframes tab-progress {
  from { height: 0; }
  to { height: 100%; }
}
.tab-num { font-size: 0.8rem; font-weight: 800; opacity: 0.3; }
.tab-label-lux { font-weight: 800; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.1em; }
.tab-arrow { margin-left: auto; width: 16px; color: var(--teal); }

.tabs-main { flex: 1; padding: 5rem; }
.tab-title-lux { font-size: 2.5rem; font-family: 'Cormorant Garamond', serif; font-weight: 800; color: var(--teal-dark); margin-bottom: 1.5rem; }
.tab-text-lux { font-size: 1.1rem; color: #64748b; line-height: 1.8; }
.tab-img-lux { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 3rem; }
.dot-pulse { width: 10px; height: 10px; background: var(--teal); border-radius: 50%; animation: dot-pulse 1.5s infinite; }
@keyframes dot-pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }

/* ══════════════════════════════════════
   TEAM
   ══════════════════════════════════════ */
.team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 2.5rem; }
.member-card { background: white; border-radius: 2.5rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.03); transition: all 0.4s ease; position: relative; padding: 1rem; }
.member-card:hover { transform: translateY(-10px); border-color: var(--teal); box-shadow: 0 30px 60px rgba(13,148,136,0.1); }

.member-img-wrap { width: 100%; aspect-ratio: 1; border-radius: 2rem; background: #f1f5f9; position: relative; overflow: hidden; }
.member-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 900; color: #cbd5e1; font-family: 'Cormorant Garamond', serif; }
.member-overlay { position: absolute; inset: 0; background: rgba(13,148,136,0.9); display: flex; align-items: center; justify-content: center; opacity: 0; transition: all 0.4s; transform: translateY(100%); }
.member-card:hover .member-overlay { opacity: 1; transform: translateY(0); }
.member-socials { display: flex; gap: 1.5rem; color: white; font-size: 1.2rem; }

.member-info { padding: 1.5rem 0.5rem 0.5rem; text-align: center; }
.member-name { font-size: 1.2rem; font-weight: 800; color: var(--teal-dark); margin-bottom: 0.2rem; }
.member-role { font-size: 0.75rem; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: 0.1em; }

/* ══════════════════════════════════════
   FINAL CTA
   ══════════════════════════════════════ */
.final-cta-lux { position: relative; background: #0f172a; color: white; border-radius: 6rem 6rem 0 0; }
.cta-lux-bg { position: absolute; inset: 0; background: radial-gradient(circle at 70% 30%, rgba(20,184,166,0.15), transparent 70%); }
.cta-icon-float { font-size: 4rem; color: var(--gold); margin-bottom: 2rem; opacity: 0.6; }
.cta-title-lux { font-size: clamp(2.5rem, 6vw, 4.5rem); font-family: 'Cormorant Garamond', serif; font-weight: 800; line-height: 1.1; margin-bottom: 2rem; }
.cta-sub-lux { font-size: 1.2rem; opacity: 0.7; max-width: 600px; margin: 0 auto 3.5rem; font-weight: 300; }

.btn-premium-lux { display: inline-block; padding: 18px 45px; background: var(--teal); color: white; border-radius: 999px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s; }
.btn-premium-lux:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(20,184,166,0.3); }
.btn-outline-lux { display: inline-block; padding: 18px 45px; border: 1px solid rgba(255,255,255,0.2); border-radius: 999px; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; margin-left: 1rem; transition: all 0.3s; }
.btn-outline-lux:hover { background: rgba(255,255,255,0.05); }

/* ══════════════════════════════════════
   GLASS & UTILS
   ══════════════════════════════════════ */
.glass-premium { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(25px); border: 1px solid white; box-shadow: 0 20px 60px rgba(0,0,0,0.03); }

.sr { 
  opacity: 0; 
  transform: translateY(60px); 
  filter: blur(10px);
  transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1); 
}
.sr--on { 
  opacity: 1; 
  transform: none; 
  filter: blur(0);
}

.sr-child { 
  opacity: 0; 
  transform: translateY(40px) scale(0.95); 
  filter: blur(5px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0s); 
}
.sr-child--on { 
  opacity: 1; 
  transform: none; 
  filter: blur(0);
}

.hero-title {
  opacity: 0;
  transform: translateY(30px);
  filter: blur(10px);
  transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
}
.hero-about .hero-title {
  opacity: 1;
  transform: none;
  filter: blur(0);
}

.fade-up-lux-enter-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-up-lux-enter-from { opacity: 0; transform: translateY(30px); }

@media (max-width: 1024px) {
  .hero-about { padding-top: 100px; text-align: center; }
  .bento-grid { grid-template-columns: 1fr; grid-template-rows: auto; }
  .bento-main { grid-column: span 1; }
  .bento-accent { grid-row: span 1; }
  .diamond-grid-light { grid-template-columns: repeat(2, 1fr); }
  .glass-premium-white { flex-direction: column; border-radius: 2rem; }
  .tabs-sidebar { width: 100%; display: flex; overflow-x: auto; padding: 1rem; }
  .tab-lux-btn { padding: 1rem 2rem; white-space: nowrap; }
  .tabs-main { padding: 2rem; }
  .story-asym .flex-col-reverse { flex-direction: column; }
  .img-main { height: 400px; }
  .img-sub-wrap { display: none; }
}
</style>
