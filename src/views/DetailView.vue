<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCryptoStore } from '@/store/cryptoStore'
import { useBinanceSocket } from '@/composables/useBinanceSocket'
import StatPill from '@/components/StatPill.vue'

const route = useRoute()
const symbol = computed(() => String(route.params.symbol ?? 'BTCUSDT').toUpperCase())

const store = useCryptoStore()
const { tickBySymbol } = storeToRefs(store)

const syms = computed(() => [symbol.value])
const { lastMessage, isConnected, isReconnecting, lastError } = useBinanceSocket(syms)
watch(lastMessage, m => { if (m?.s) store.upsert(m) })

const nf = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const t = computed(() => tickBySymbol.value[symbol.value] ?? null)
const deltaPct = computed(() => (t.value ? `${t.value.P.toFixed(2)}%` : '—'))
const deltaColor = computed(() => {
  if (!t.value) return 'gray'
  return t.value.p >= 0 ? 'green' : 'red'
})
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">{{ symbol }}</h1>
      <RouterLink to="/" class="text-sm underline">Voltar</RouterLink>
    </div>

    <div class="text-xs">
      <span v-if="isConnected" class="text-emerald-600">Ligado</span>
      <span v-else-if="isReconnecting" class="text-amber-600">A ligar…</span>
      <span v-else class="text-rose-600">Desligado</span>
      <span v-if="lastError"> — {{ lastError }}</span>
    </div>

    <!-- StatPill ack -->
    <StatPill :label="'24h'" :value="deltaPct" :color="deltaColor" />

    <div v-if="t" class="grid grid-cols-2 gap-3">
      <div class="p-3 rounded-2xl shadow bg-white">
        <div class="text-xs text-gray-500">Preço</div>
        <div class="text-lg font-semibold">{{ nf.format(t.c) }}</div>
      </div>

      <div class="p-3 rounded-2xl shadow bg-white">
        <div class="text-xs text-gray-500">24h</div>
        <div :class="t.p >= 0 ? 'text-green-600' : 'text-red-600'" class="text-lg font-semibold">
          {{ nf.format(t.p) }} ({{ t.P.toFixed(2) }}%)
        </div>
      </div>
    </div>

    <div v-else class="text-sm text-gray-500">Loading....</div>
  </div>
</template>
