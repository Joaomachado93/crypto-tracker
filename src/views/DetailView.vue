<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCryptoStore } from '../store/cryptoStore'
import { useBinanceSocket } from '../composables/useBinanceSocket'
import StatPill from '../components/StatPill.vue' 
const route = useRoute()
const symbol = computed(() => String(route.params.symbol ?? 'BTCUSDT').toUpperCase())

const store = useCryptoStore()
const { map } = storeToRefs(store)

const syms = computed(() => [symbol.value])
const { lastMessage, isConnected, isReconnecting, lastError } = useBinanceSocket(syms)

watch(lastMessage, (m) => { if (m?.s) store.upsert(m) })

const nf = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// attention for render StatPill
const deltaPct = computed(() => {
  const t = map.value?.[symbol.value]
  return typeof t?.P === 'number' ? `${t.P.toFixed(2)}%` : '—'
})
const deltaColor = computed<'green' | 'red' | 'gray'>(() => {
  const t = map.value?.[symbol.value]
  if (typeof t?.p !== 'number') return 'gray'
  return t.p >= 0 ? 'green' : 'red'
})
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">{{ symbol }}</h1>
      <RouterLink to="/" class="text-sm underline">Voltar</RouterLink>
    </div>

    <!-- status -->
    <div class="text-xs">
      <span v-if="isConnected" class="text-emerald-600">Conectado</span>
      <span v-else-if="isReconnecting" class="text-amber-600">A reconectar…</span>
      <span v-else class="text-rose-600">Desconectado</span>
      <span v-if="lastError"> — {{ lastError }}</span>
    </div>

    <div>
      <StatPill
        v-if="map[symbol]"
        :label="'Δ (24h)'"
        :value="map[symbol].P.toFixed(2) + '%'"
        :color="map[symbol].p >= 0 ? 'green' : 'red'"
      />

    </div>

    <!-- Cards -->
    <div v-if="map[symbol]" class="grid grid-cols-2 gap-3">
      <div class="p-3 rounded-2xl shadow bg-white">
        <div class="text-xs text-gray-500">Preço</div>
        <div class="text-lg font-semibold">{{ nf.format(map[symbol].c) }}</div>
      </div>

      <div class="p-3 rounded-2xl shadow bg-white">
        <div class="text-xs text-gray-500">Δ (24h)</div>
        <div :class="map[symbol].p >= 0 ? 'text-green-600' : 'text-red-600'" class="text-lg font-semibold">
          {{ nf.format(map[symbol].p) }} ({{ map[symbol].P.toFixed(2) }}%)
        </div>
      </div>
    </div>

    <div v-else class="text-sm text-gray-500">A carregar dados…</div>
  </div>
</template>
