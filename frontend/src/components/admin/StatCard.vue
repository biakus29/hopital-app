<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{{ label }}</p>
        <p class="mt-2 text-3xl font-black text-slate-900">{{ value }}</p>
        <p v-if="hint" class="mt-1 text-xs text-slate-500">{{ hint }}</p>
      </div>
      <div :class="['grid h-10 w-10 place-items-center rounded-xl', accentBg]">
        <component :is="icon" :size="20" :class="accentText" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  value: [String, Number],
  hint:  { type: String, default: '' },
  icon:  { type: Object, default: null },
  accent:{ type: String, default: 'teal' } // teal | amber | blue | rose | slate
})

const accentBg = computed(() => ({
  teal:  'bg-teal-50',
  amber: 'bg-amber-50',
  blue:  'bg-blue-50',
  rose:  'bg-rose-50',
  slate: 'bg-slate-100'
}[props.accent] || 'bg-slate-100'))

const accentText = computed(() => ({
  teal:  'text-teal-600',
  amber: 'text-amber-600',
  blue:  'text-blue-600',
  rose:  'text-rose-600',
  slate: 'text-slate-600'
}[props.accent] || 'text-slate-600'))
</script>
