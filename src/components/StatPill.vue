<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  color?: 'green' | 'red' | 'blue' | 'gray'
}>()
</script>

<template>
  <div
    class="inline-flex items-center justify-center gap-2 rounded-full px-3 py-1 text-sm font-medium shadow-sm border"
    :class="{
      'bg-green-500/10 text-green-600 border-green-500/30': color === 'green',
      'bg-red-500/10 text-red-600 border-red-500/30': color === 'red',
      'bg-blue-500/10 text-blue-600 border-blue-500/30': color === 'blue',
      'bg-gray-500/10 text-gray-600 border-gray-500/30': !color
    }"
  >
    <span>{{ label }}</span>
    <span class="font-semibold">{{ value }}</span>
  </div>
</template>
