<script setup lang="ts">
defineProps<{ connected: boolean; reconnecting: boolean; error: string | null }>()
</script>

<template>
  <div
    class="px-3 py-1 text-xs"
    :class="
      connected
        ? 'bg-emerald-100 text-emerald-800'
        : reconnecting
        ? 'bg-amber-100 text-amber-800'
        : 'bg-rose-100 text-rose-800'
    "
  >
    <span v-if="connected">Ligado</span>
    <span v-else-if="reconnecting">A Ligar</span>
    <span v-else>Sem Ligação</span>
    <span v-if="error"> — {{ error }}</span>
  </div>
</template>
