<script setup>
defineProps({
  title: { type: String, default: '' }
})
</script>

<template>
  <section class="hero-mesh min-h-screen py-24 md:py-32">
    <div class="container mx-auto px-4 max-w-3xl">
      <h1 class="text-4xl md:text-5xl font-bold mb-8">{{ title }}</h1>
      <div class="card-premium space-y-4 text-slate-600 leading-relaxed">
        <p>This page is a placeholder for legal text in the Vue migration.</p>
        <p>Update this content with your final policy wording before production.</p>
      </div>
    </div>
  </section>
</template>
