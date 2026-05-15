<template>
  <main class="bg-slate-50 pb-20">
    <section class="bg-slate-950 text-white">
      <div class="mx-auto max-w-4xl px-4 py-14">
        <RouterLink to="/blog" class="text-sm font-semibold text-teal-300 hover:text-teal-200">← Back to blog</RouterLink>
        <h1 class="mt-4 text-4xl font-black">{{ post?.title || 'Article' }}</h1>
        <p class="mt-3 text-slate-300">{{ post?.category || 'News' }} · {{ formatDate(post?.publishedAt) }}</p>
      </div>
    </section>

    <section class="mx-auto mt-10 max-w-4xl px-4">
      <div v-if="loading" class="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500">Loading article...</div>
      <div v-else-if="error" class="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">{{ error }}</div>
      <article v-else-if="post" class="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <img :src="post.coverImage || '/assets/images/blog/grid/1.jpg'" :alt="post.title" class="h-72 w-full object-cover" />
        <div class="p-8 md:p-10">
          <p v-if="post.excerpt" class="mb-5 text-lg text-slate-700">{{ post.excerpt }}</p>
          <div class="prose prose-slate max-w-none whitespace-pre-wrap">{{ post.content }}</div>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(false)
const error = ref('')
const post = ref(null)

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { dateStyle: 'medium' })
}

async function loadPost() {
  loading.value = true
  error.value = ''
  post.value = null
  try {
    const res = await fetch(`/api/posts/${route.params.slug}`)
    if (!res.ok) {
      if (res.status === 404) throw new Error('Article not found.')
      throw new Error('Failed to load article.')
    }
    post.value = await res.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unexpected error.'
  } finally {
    loading.value = false
  }
}

onMounted(loadPost)
</script>
