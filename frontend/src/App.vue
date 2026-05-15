<template>
  <component :is="layoutComponent">
    <RouterView />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from './layouts/MainLayout.vue'
import BareLayout from './layouts/BareLayout.vue'
import AdminLayout from './layouts/AdminLayout.vue'

const route = useRoute()

const layoutComponent = computed(() => {
  const layout = route.meta?.layout
  if (layout === 'admin') return AdminLayout
  if (layout === 'admin-bare') return BareLayout   // login page = bare
  if (layout === 'legacy') return BareLayout
  return MainLayout
})
</script>
