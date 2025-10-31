<script setup lang="ts">
  const props = withDefaults(defineProps<{
    label: string
    value: string | number
    color?: 'green' | 'red' | 'gray'
  }>(), {
    color: 'gray'
  })

  const colorClass = {
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    red: 'bg-rose-50 text-rose-700 ring-rose-200',
    gray: 'bg-gray-100 text-gray-700 ring-gray-200'
  }[props.color]
</script>

<template>
  <span
    class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ring-1"
    :class="colorClass"
    :aria-label="`stat:${label}`"
  >
    <span class="opacity-70">{{ label }}</span>
    <strong class="font-semibold">{{ value }}</strong>
  </span>
</template>
