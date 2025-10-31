<script setup lang="ts">
defineProps<{
  s: string
  c: number
  p: number
  pct: number
}>()
</script>

<template>
  <div class="w-full flex items-center justify-between gap-3">
    <div class="font-semibold">{{ s }}</div>

    <div class="text-right">
      <div class="text-sm">{{ c.toLocaleString('en-US', { maximumFractionDigits: 2 }) }}</div>
      <div
        class="text-xs"
        :class="p >= 0 ? 'text-emerald-600' : 'text-rose-600'"
      >
        {{ p.toLocaleString('en-US', { maximumFractionDigits: 2 }) }}
        ({{ pct.toFixed(2) }}%)
      </div>
    </div>
  </div>
</template>
