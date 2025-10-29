<script setup lang="ts">
const props = defineProps<{ connected: boolean; reconnecting: boolean; error?: string | null }>()
</script>

<template>
  <div class="sticky top-0 z-10 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur">
    <div class="mx-auto max-w-5xl px-4 py-2 text-sm flex items-center gap-3">
      <span :class="connected ? 'text-emerald-400' : reconnecting ? 'text-amber-400' : 'text-rose-400'">
        <span class="inline-block h-2 w-2 rounded-full mr-2"
              :class="connected ? 'bg-emerald-400' : reconnecting ? 'bg-amber-400' : 'bg-rose-400'" />
        {{ connected ? 'Live' : reconnecting ? 'Reconnecting…' : 'Offline' }}
      </span>
      <span v-if="error" class="text-rose-400">{{ error }}</span>
    </div>
  </div>
</template>
