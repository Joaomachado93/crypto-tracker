<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  color?: 'green'|'red'|'gray'
  compact?: boolean
}>()
</script>

<template>
  <div :aria-label="`stat:${label}`" :class="['inline-flex items-center px-3 py-1 rounded-full', compact ? 'text-xs' : 'text-sm']">
    <span class="opacity-80">{{ label }}</span>
    <span class="ml-2 font-semibold">{{ value }}</span>
  </div>
</template>
