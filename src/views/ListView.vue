<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useCryptoStore } from '../store/cryptoStore'
import { useBinanceSocket } from '../composables/useBinanceSocket'
import CoinRow from '../components/CoinRow.vue'
import StatusBar from '../components/StatusBar.vue'

const store = useCryptoStore()
const { list, symbols } = storeToRefs(store)
const { isConnected, isReconnecting, lastError, lastMessage } = useBinanceSocket(symbols)
watch(lastMessage, m => { if (m?.s) store.upsert(m) })
</script>

<template>
  <section class="max-w-6xl mx-auto w-full px-4 py-6">
    <div class="mb-4">
      <StatusBar :connected="isConnected" :reconnecting="isReconnecting" :error="lastError" />
    </div>

    <ul
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      aria-label="Cryptocurrencies live list"
    >
      <li v-for="item in list" :key="item.s" class="h-full">
        <RouterLink
          :to="{ name: 'detail', params: { symbol: item.s } }"
          class="block h-full group"
        >
          <div
            class="flex h-full items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition shadow-sm"
          >
            <CoinRow :s="item.s" :c="item.c" :p="item.p" :P="item.P" />
          </div>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
