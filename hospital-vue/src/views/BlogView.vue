<template>
  <main class="blog-page" ref="pageRef">
    <!-- ══════════════════════════════════════
         FOND DYNAMIQUE (ANTIGRAVITY LAYER 0)
    ══════════════════════════════════════ -->
    <div class="dynamic-orbs">
      <div class="orb orb-1" :style="orbStyle(0.04)" />
      <div class="orb orb-2" :style="orbStyle(-0.02)" />
      <div class="orb orb-3" :style="orbStyle(0.01)" />
    </div>
    <canvas ref="particleCanvas" class="particle-canvas" aria-hidden="true" />

    <!-- ══════════════════════════════════════
         HERO SECTION - THE JOURNAL
    ══════════════════════════════════════ -->
    <section class="hero-blog">
      <div class="hero-mesh-bg" />
      <div class="container mx-auto px-4 text-center max-w-5xl relative z-10">
        <div class="floating-label sr-child">
          <span class="label-line" />
          <span class="label-txt">The Health Journal</span>
          <span class="label-line" />
        </div>
        
        <h1 class="hero-title" ref="titleRef">
          Advice, News <br/>
          <span class="text-teal-600 italic font-serif">& Updates</span>
        </h1>
        
        <p class="hero-subtitle ag-float ag-float--light">
          Stay informed on the latest medical advances, our partnerships 
          and prevention advice for your community.
        </p>
      </div>
      
      <div class="ecg-divider-premium">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
          <polyline class="ecg-line" points="0,20 100,20 110,4 120,36 130,2 140,38 150,20 300,20 310,4 320,36 330,2 340,38 350,20 1200,20" />
        </svg>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         FEATURED POST
    ══════════════════════════════════════ -->
    <section class="featured-section py-20 sr">
      <div class="container mx-auto px-4">
        <article class="featured-card glass-premium sr-child">
          <div class="flex flex-col lg:flex-row gap-12 items-center">
            <div class="lg:w-1/2 overflow-hidden rounded-[2rem] ag-float--medium">
              <img :src="featuredPost.image" :alt="featuredPost.title" class="featured-img" />
            </div>
            <div class="lg:w-1/2 space-y-6">
              <span class="post-category">{{ featuredPost.category }}</span>
              <h2 class="text-3xl md:text-5xl font-bold text-teal-900 leading-tight">
                {{ featuredPost.title }}
              </h2>
              <p class="text-slate-600 text-lg leading-relaxed">
                {{ featuredPost.desc }}
              </p>
              <div class="flex items-center gap-4 pt-4">
                <div class="author-avatar">{{ featuredPost.authorInitials }}</div>
                <div>
                  <div class="font-bold text-slate-900">{{ featuredPost.author }}</div>
                  <div class="text-sm text-slate-500">{{ featuredPost.date }}</div>
                </div>
              </div>
              <button class="btn-read-more">Read Article</button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         BLOG GRID
    ══════════════════════════════════════ -->
    <section class="blog-grid-section py-20 sr">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <article v-for="(post, i) in posts" :key="i" 
                   class="post-card-lux ag-float" 
                   :style="`--float-delay: ${i * 0.15}s; --float-dur: ${6 + i * 0.5}s`">
            <div class="post-img-wrap">
              <img :src="post.image" :alt="post.title" class="post-img" />
              <div class="post-date-badge">{{ post.date }}</div>
            </div>
            <div class="post-content-lux">
              <span class="post-cat-mini">{{ post.category }}</span>
              <h3 class="post-title-lux">{{ post.title }}</h3>
              <p class="post-desc-lux">{{ post.desc }}</p>
              <button type="button" class="post-link-lux">Continue Reading</button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         NEWSLETTER SECTION
    ══════════════════════════════════════ -->
    <section class="newsletter-section py-32 bg-teal-900 text-white relative overflow-hidden sr">
      <div class="newsletter-bg-decor ag-float--heavy">✦</div>
      <div class="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <h2 class="text-3xl md:text-5xl font-bold mb-6 sr-child">Stay tuned to your health</h2>
        <p class="text-teal-100 text-lg mb-10 sr-child" style="--delay: 0.1s">
          Subscribe to receive alerts, news and medical advice 
          directly in your mailbox.
        </p>
        <form class="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto sr-child" style="--delay: 0.2s" @submit.prevent>
          <input type="text" placeholder="Your Name" class="news-input" />
          <input type="email" placeholder="Your Email" class="news-input" />
          <button class="btn-news-submit">Subscribe</button>
        </form>
        <p class="mt-6 text-xs text-teal-300 opacity-60">We respect your privacy. Unsubscribe possible at any time.</p>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         FINAL CONTACT CTA
    ══════════════════════════════════════ -->
    <section class="blog-contact py-24 sr">
      <div class="container mx-auto px-4 text-center">
        <div class="badge-premium mb-6">Any Questions?</div>
        <h2 class="section-title-large mb-10">We are here to <em>help you</em>.</h2>
        <RouterLink to="/contact" class="btn-premium-lux ag-float--light">Contact Us</RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

// --- DATA ---
const featuredPost = {
  title: "Partnership to Increase COVID-19 Testing Capacity",
  desc: "With 200 access points across the country and a comprehensive logistics network, we are a major partner in the pandemic response.",
  category: "News",
  author: "Martin King",
  authorInitials: "MK",
  date: "27 Jan 2023",
  image: "/assets/images/blog/grid/1.jpg"
}

const posts = [
  {
    title: "Pathogen Passage Prevention",
    desc: "Taking precautions against the pandemic of the century and protecting our vulnerable communities.",
    category: "Prevention",
    date: "27 Jan 2022",
    image: "/assets/images/blog/grid/2.jpg"
  },
  {
    title: "Genetic Mutations and Viral Spread",
    desc: "Analysis of gene evolution and how mutations affect transmission.",
    category: "Research",
    date: "27 Jan 2022",
    image: "/assets/images/blog/grid/3.jpg"
  },
  {
    title: "No Cough, No Problem? COVID-19 Symptoms",
    desc: "Understanding medication concerns and atypical symptoms of the virus.",
    category: "Health",
    date: "27 Jan 2022",
    image: "/assets/images/blog/grid/4.jpg"
  },
  {
    title: "Christmas Celebration at St. Therese",
    desc: "A moment of joy shared between children, patients and hospital staff.",
    category: "Community",
    date: "25 Dec 2025",
    image: "/assets/images/gallery/chrismas/1.jpeg"
  },
  {
    title: "Understanding Your Lab Results",
    desc: "How to read your analysis report and when to consult a doctor immediately.",
    category: "Education",
    date: "12 Jan 2026",
    image: "/assets/images/blog/grid/5.jpg"
  },
  {
    title: "Maternal Health and Pediatric Care",
    desc: "New programs dedicated to mothers and children of the Nomayos district.",
    category: "Programs",
    date: "05 Feb 2026",
    image: "/assets/images/blog/grid/6.jpg"
  }
]

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
  for(let i=0; i<40; i++) {
    pts.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random()-0.5)*0.15,
      vy: (Math.random()-0.5)*0.15,
      r: Math.random() * 1.5 + 0.5,
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

.blog-page {
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
.hero-blog { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 140px 20px 60px; position: relative; }
.hero-mesh-bg { position: absolute; inset: 0; background-image: radial-gradient(rgba(13,148,136,0.1) 1px, transparent 1px); background-size: 50px 50px; mask-image: radial-gradient(ellipse at center, black, transparent); }

.floating-label { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; }
.label-line { height: 1px; width: 40px; background: linear-gradient(90deg, transparent, var(--teal)); }
.label-txt { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3em; color: var(--teal); }

.hero-title { font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 1.1; font-weight: 900; margin-bottom: 2rem; }
.hero-subtitle { font-size: 1.15rem; color: #64748b; max-width: 700px; line-height: 1.7; font-weight: 300; }

.ecg-divider-premium { width: 100%; position: absolute; bottom: 0; opacity: 0.1; }
.ecg-line { fill: none; stroke: var(--teal); stroke-width: 2; }

/* ══════════════════════════════════════
   FEATURED POST
   ══════════════════════════════════════ */
.featured-card { padding: 4rem; border-radius: 4rem; overflow: hidden; position: relative; z-index: 10; border: 1px solid white; box-shadow: 0 40px 100px rgba(0,0,0,0.05); }
.featured-img { width: 100%; height: 450px; object-fit: cover; border-radius: 2.5rem; box-shadow: 0 20px 50px rgba(0,0,0,0.1); }

.post-category { display: inline-block; padding: 6px 14px; background: rgba(13,148,136,0.1); color: var(--teal); border-radius: 999px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
.author-avatar { width: 48px; height: 48px; background: var(--teal); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: 'Cormorant Garamond', serif; }

.btn-read-more { padding: 12px 30px; background: var(--teal); color: white; border-radius: 999px; font-weight: 700; font-size: 0.85rem; transition: all 0.3s; }
.btn-read-more:hover { background: var(--teal-dark); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(13,148,136,0.2); }

/* ══════════════════════════════════════
   BLOG GRID
   ══════════════════════════════════════ */
.post-card-lux { background: white; border-radius: 3rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.03); transition: all 0.4s ease; box-shadow: 0 15px 40px rgba(0,0,0,0.02); }
.post-card-lux:hover { transform: translateY(-12px); border-color: var(--teal); box-shadow: 0 40px 80px rgba(13,148,136,0.08); }

.post-img-wrap { width: 100%; height: 260px; position: relative; overflow: hidden; }
.post-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.post-card-lux:hover .post-img { transform: scale(1.08); }
.post-date-badge { position: absolute; bottom: 20px; right: 20px; background: white; padding: 6px 14px; border-radius: 999px; font-size: 0.65rem; font-weight: 800; color: #64748b; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }

.post-content-lux { padding: 2.5rem; }
.post-cat-mini { font-size: 0.65rem; font-weight: 900; color: var(--gold); text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 0.8rem; }
.post-title-lux { font-size: 1.3rem; font-weight: 800; color: var(--teal-dark); line-height: 1.4; margin-bottom: 1rem; }
.post-desc-lux { font-size: 0.9rem; color: #64748b; line-height: 1.6; margin-bottom: 1.5rem; }
.post-link-lux { font-size: 0.8rem; font-weight: 800; color: var(--teal); transition: all 0.3s; }
.post-link-lux { background: transparent; border: 0; padding: 0; cursor: pointer; }
.post-link-lux:hover { letter-spacing: 0.05em; }

/* ══════════════════════════════════════
   NEWSLETTER
   ══════════════════════════════════════ */
.newsletter-section { border-radius: 4rem; margin: 4rem 2rem; }
.newsletter-bg-decor { position: absolute; top: -50px; right: -50px; font-size: 10rem; opacity: 0.05; }
.news-input { flex: 1; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 1.2rem; padding: 1.2rem 1.5rem; color: white; transition: all 0.3s; }
.news-input::placeholder { color: rgba(255,255,255,0.5); }
.news-input:focus { outline: none; background: rgba(255,255,255,0.15); border-color: var(--teal); }
.btn-news-submit { background: white; color: var(--teal-dark); padding: 1.2rem 2.5rem; border-radius: 1.2rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s; }
.btn-news-submit:hover { background: var(--teal); color: white; transform: translateY(-3px); }

/* ══════════════════════════════════════
   UTILS
   ══════════════════════════════════════ */
.glass-premium { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(25px); }

.sr { opacity: 0; transform: translateY(40px); transition: 1s cubic-bezier(0.16, 1, 0.3, 1); }
.sr--on { opacity: 1; transform: none; }
.sr-child { opacity: 0; transform: translateY(20px); transition: 0.7s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0s); }
.sr-child--on { opacity: 1; transform: none; }

.hero-title { opacity: 0; transform: translateY(20px); transition: 1s ease-out; }
.blog-page .hero-title { opacity: 1; transform: none; }

.badge-premium { display: inline-block; padding: 8px 20px; background: white; border: 1px solid rgba(13,148,136,0.15); border-radius: 999px; color: var(--teal); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
.section-title-large { font-size: clamp(2rem, 4vw, 3.5rem); font-family: 'Cormorant Garamond', serif; font-weight: 800; color: var(--teal-dark); line-height: 1.1; }
.section-title-large em { font-style: italic; color: var(--gold); }

.btn-premium-lux { display: inline-block; padding: 18px 45px; background: var(--teal); color: white; border-radius: 999px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s; }
.btn-premium-lux:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(20,184,166,0.3); }

.ag-float { animation: float 6s ease-in-out infinite; }
.ag-float--light { --amp: 10px; animation-duration: 5s; }
.ag-float--medium { --amp: 15px; animation-duration: 7s; }
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(calc(-1 * var(--amp, 10px))); }
}

@media (max-width: 1024px) {
  .featured-card { padding: 2rem; border-radius: 2rem; }
  .featured-img { height: 300px; }
  .hero-blog { padding-top: 100px; }
}
@media (max-width: 640px) {
  .newsletter-section { margin: 2rem 1rem; border-radius: 2rem; padding: 3rem 1.5rem; }
}
</style>
