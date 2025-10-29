<script setup lang="ts">
import { watchEffect } from 'vue'
import { useCryptoStore } from '@/store/cryptoStore'
import { useBinanceSocket } from '@/composables/useBinanceSocket'

const store = useCryptoStore()
const { lastMessage, isConnected, isReconnecting, lastError } = useBinanceSocket(store.symbols)

watchEffect(() => {
  if (lastMessage.value?.s) store.upsert(lastMessage.value as any)
})
</script>

<template>
  <main class="p-4 max-w-5xl mx-auto">
    <header class="flex items-center gap-3 mb-4">
      <div class="text-lg font-semibold">Criptomoedas ({{ store.symbols.length }})</div>
      <span v-if="isConnected" class="text-green-600 text-sm">Conectado</span>
      <span v-else-if="isReconnecting" class="text-amber-600 text-sm">A reconectar…</span>
      <span v-else class="text-gray-500 text-sm">Desligado</span>
      <span v-if="lastError" class="text-red-600 text-sm">Erro: {{ lastError }}</span>
    </header>

    <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <li v-for="t in store.list" :key="t!.s" class="rounded-xl p-4 shadow bg-white/70">
        <RouterLink :to="{ name: 'detail', params: { symbol: t!.s }}">
          <div class="flex items-center justify-between">
            <div class="font-medium">{{ t!.s }}</div>
            <div class="text-right">
              <div class="font-semibold">{{ t!.c.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</div>
              <div :class="t!.P >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ t!.p.toFixed(2) }} ({{ t!.P.toFixed(2) }}%)
              </div>
            </div>
          </div>
        </RouterLink>
      </li>
    </ul>
  </main>
</template>
