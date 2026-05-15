import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ServicesView from '../views/ServicesView.vue'
import BookView from '../views/BookView.vue'
import ContactView from '../views/ContactView.vue'
import BlogView from '../views/BlogView.vue'
import BlogPostView from '../views/BlogPostView.vue'
import PortalView from '../views/PortalView.vue'
import PolicyView from '../views/PolicyView.vue'
import ModernContentView from '../views/ModernContentView.vue'
import LegacyPageView from '../views/LegacyPageView.vue'

const modern = (path, pageKey) => ({
  path,
  component: ModernContentView,
  props: { pageKey }
})

const legacy = (path, legacyPage) => ({
  path,
  component: LegacyPageView,
  meta: { layout: 'legacy', legacyPage }
})

const routes = [
  { path: '/', component: HomeView },
  { path: '/index.html', redirect: '/' },

  { path: '/about', component: AboutView },
  { path: '/about-us', component: AboutView },

  { path: '/services', component: ServicesView },
  { path: '/tests-services', component: ServicesView },

  { path: '/book', component: BookView },
  { path: '/tests-book-visit', component: BookView },

  { path: '/contact', component: ContactView },
  { path: '/contact-us', component: ContactView },

  { path: '/blog', component: BlogView },
  { path: '/blog/:slug', component: BlogPostView },
  modern('/blog-single-post', 'blogSingle'),

  { path: '/portal', component: PortalView, meta: { layout: 'portal' } },
  { path: '/provider-login', component: PortalView, meta: { layout: 'portal' } },

  modern('/team', 'team'),
  modern('/careers', 'careers'),
  modern('/faqs', 'faqs'),
  modern('/find-lab', 'findLab'),
  modern('/why-us', 'whyUs'),
  modern('/testimonials', 'testimonials'),
  modern('/gallery-chrismas', 'gallery'),
  modern('/tests-results', 'results'),
  modern('/tests-billing', 'billing'),
  modern('/tests-accreditation', 'accreditation'),
  modern('/tests-prepare-test', 'prepareTest'),
  modern('/tests-provider-registration', 'providerRegistration'),
  modern('/tests-single-test', 'singleTest'),
  modern('/research-grid', 'researchGrid'),
  modern('/research-modern', 'researchModern'),
  modern('/research-single', 'researchSingle'),
  modern('/supplies', 'supplies'),
  modern('/supplies-single', 'suppliesSingle'),
  modern('/shopping-cart', 'cart'),

  { path: '/privacy', component: PolicyView, props: { title: 'Privacy Policy' } },
  { path: '/terms', component: PolicyView, props: { title: 'Terms of Service' } },

  legacy('/legacy', 'index.html'),
  legacy('/legacy/about-us', 'about-us.html'),
  legacy('/legacy/tests-services', 'tests-services.html'),
  legacy('/legacy/tests-book-visit', 'tests-book-visit.html'),
  legacy('/legacy/contact-us', 'contact-us.html'),
  legacy('/legacy/blog', 'blog.html'),
  legacy('/legacy/blog-single-post', 'blog-single-post.html'),
  legacy('/legacy/provider-login', 'provider-login.html'),
  legacy('/legacy/team', 'team.html'),
  legacy('/legacy/careers', 'careers.html'),
  legacy('/legacy/faqs', 'faqs.html'),
  legacy('/legacy/find-lab', 'find-lab.html'),
  legacy('/legacy/why-us', 'why-us.html'),
  legacy('/legacy/testimonials', 'testimonials.html'),
  legacy('/legacy/gallery-chrismas', 'gallery-chrismas.html'),
  legacy('/legacy/tests-results', 'tests-results.html'),
  legacy('/legacy/tests-billing', 'tests-billing.html'),
  legacy('/legacy/tests-accreditation', 'tests-accreditation.html'),
  legacy('/legacy/tests-prepare-test', 'tests-prepare-test.html'),
  legacy('/legacy/tests-provider-registration', 'tests-provider-registration.html'),
  legacy('/legacy/tests-single-test', 'tests-single-test.html'),
  legacy('/legacy/research-grid', 'research-grid.html'),
  legacy('/legacy/research-modern', 'research-modern.html'),
  legacy('/legacy/research-single', 'research-single.html'),
  legacy('/legacy/supplies', 'supplies.html'),
  legacy('/legacy/supplies-single', 'supplies-single.html'),
  legacy('/legacy/shopping-cart', 'shopping-cart.html'),

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})
