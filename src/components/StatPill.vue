<script setup lang="ts">
const props = defineProps<{ label: string; value: string }>()
</script>

<template>
  <div class="text-xs rounded-full bg-slate-800 px-2 py-1 text-slate-200">
    <span class="text-slate-400 mr-1">{{ label }}:</span>{{ value }}
  </div>
</template>
