<script setup lang="ts">
defineProps<{ s: string; c: number; p: number; P: number }>()
const nfPrice = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const nfPct = new Intl.NumberFormat('en-US', { signDisplay: 'always', minimumFractionDigits: 2, maximumFractionDigits: 2 })
</script>

<template>
  <div class="flex items-center justify-between py-2 border-b">
    <span class="font-medium">{{ s }}</span>
    <div class="text-right">
      <div class="text-sm">{{ nfPrice.format(c) }}</div>
      <div :class="p >= 0 ? 'text-green-600' : 'text-red-600'" class="text-xs font-semibold">
        {{ nfPrice.format(p) }} ({{ nfPct.format(P) }}) <span>{{ p >= 0 ? '^' : 'V' }}</span>
      </div>
    </div>
  </div>
</template>
