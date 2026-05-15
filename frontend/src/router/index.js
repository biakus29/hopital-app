import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ServicesView from '../views/ServicesView.vue'
import BookView from '../views/BookView.vue'
import ContactView from '../views/ContactView.vue'
import BlogView from '../views/BlogView.vue'
import BlogPostView from '../views/BlogPostView.vue'
import PolicyView from '../views/PolicyView.vue'
import ModernContentView from '../views/ModernContentView.vue'
import LegacyPageView from '../views/LegacyPageView.vue'

import { auth } from '../stores/auth'

// Admin pages — lazy-loaded so the public bundle stays slim
const AdminLogin       = () => import('../views/admin/LoginView.vue')
const AdminDashboard   = () => import('../views/admin/DashboardView.vue')
const AdminPostsList   = () => import('../views/admin/PostsListView.vue')
const AdminPostEdit    = () => import('../views/admin/PostEditView.vue')
const AdminEventsList  = () => import('../views/admin/EventsListView.vue')
const AdminEventEdit   = () => import('../views/admin/EventEditView.vue')
const AdminSubscribers = () => import('../views/admin/SubscribersView.vue')
const AdminBroadcasts  = () => import('../views/admin/BroadcastsView.vue')
const AdminInbox       = () => import('../views/admin/InboxView.vue')
const AdminUploads     = () => import('../views/admin/UploadsView.vue')
const AdminSettings    = () => import('../views/admin/SettingsView.vue')

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

  // --- Admin ---
  { path: '/admin/login',       component: AdminLogin,       meta: { layout: 'admin-bare' } },
  { path: '/admin',             component: AdminDashboard,   meta: { layout: 'admin', requiresAuth: true } },
  { path: '/admin/posts',       component: AdminPostsList,   meta: { layout: 'admin', requiresAuth: true } },
  { path: '/admin/posts/new',   component: AdminPostEdit,    meta: { layout: 'admin', requiresAuth: true } },
  { path: '/admin/posts/:id',   component: AdminPostEdit,    meta: { layout: 'admin', requiresAuth: true } },
  { path: '/admin/events',      component: AdminEventsList,  meta: { layout: 'admin', requiresAuth: true } },
  { path: '/admin/events/new',  component: AdminEventEdit,   meta: { layout: 'admin', requiresAuth: true } },
  { path: '/admin/events/:id',  component: AdminEventEdit,   meta: { layout: 'admin', requiresAuth: true } },
  { path: '/admin/subscribers', component: AdminSubscribers, meta: { layout: 'admin', requiresAuth: true } },
  { path: '/admin/broadcasts',  component: AdminBroadcasts,  meta: { layout: 'admin', requiresAuth: true } },
  { path: '/admin/inbox',       component: AdminInbox,       meta: { layout: 'admin', requiresAuth: true } },
  { path: '/admin/uploads',     component: AdminUploads,     meta: { layout: 'admin', requiresAuth: true } },
  { path: '/admin/settings',    component: AdminSettings,    meta: { layout: 'admin', requiresAuth: true } },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !auth.isLoggedIn.value) {
    return { path: '/admin/login', query: { next: to.fullPath } }
  }
  if (to.path === '/admin/login' && auth.isLoggedIn.value) {
    return { path: '/admin' }
  }
})

export default router
