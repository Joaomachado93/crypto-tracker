<script setup lang="ts">
defineProps<{
  connected: boolean
  reconnecting: boolean
  error: string | null
}>()
</script>

<template>
  <div class="text-xs">
    <span v-if="connected" class="text-emerald-600">Ligado</span>
    <span v-else-if="reconnecting" class="text-amber-600">A Ligar</span>
    <span v-else class="text-rose-600">Desligado</span>
    <span v-if="error"> — {{ error }}</span>
  </div>
</template>
