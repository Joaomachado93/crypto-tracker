<script setup lang="ts">
import { useFormats } from '@/composables/useFormats'
const props = defineProps<{ symbol: string; last: number; change: number; changePct: number }>()
const { price, sign, arrow, colorClass, percent } = useFormats()
</script>

<template>
  <div class="flex items-center justify-between py-3">
    <div class="flex items-center gap-3">
      <div class="h-9 w-9 rounded-full bg-slate-800 grid place-items-center font-bold">
        {{ symbol.slice(0, 3) }}
      </div>
      <div>
        <div class="font-medium">{{ symbol }}</div>
        <div class="text-xs text-slate-400">Spot</div>
      </div>
    </div>

    <div class="text-right">
      <div class="text-lg">$ {{ price(last, 2) }}</div>
      <div class="text-sm" :class="colorClass(change)">
        <span class="mr-1">{{ arrow(change) }}</span>
        {{ sign(change) }}{{ Math.abs(change).toFixed(2) }} ({{ percent(changePct) }})
      </div>
    </div>
  </div>
</template>
