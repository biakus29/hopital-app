<template>
  <div class="h-screen w-full bg-slate-100">
    <iframe
      :key="src"
      :src="src"
      class="h-full w-full border-0"
      :title="`Legacy page: ${legacyPage}`"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const legacyPage = computed(() => route.meta?.legacyPage ?? 'index.html')
const src = computed(() => `/legacy/${legacyPage.value}`)
</script>
