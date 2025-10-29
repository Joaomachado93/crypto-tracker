<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCryptoStore } from '@/store/cryptoStore'

const route = useRoute()
const router = useRouter()
const store = useCryptoStore()
const symbol = computed(() => String(route.params.symbol ?? ''))
const t = computed(() => store.map[symbol.value])
</script>

<template>
  <main class="p-6 max-w-3xl mx-auto">
    <button class="mb-4 px-3 py-2 rounded-xl bg-black text-white" @click="router.back()">Voltar</button>
    <div v-if="t" class="rounded-2xl p-6 shadow bg-white/70">
      <h1 class="text-2xl font-bold mb-2">{{ t.s }}</h1>
      <p class="text-3xl font-semibold mb-3">{{ t.c.toLocaleString() }}</p>
      <p :class="t.P >= 0 ? 'text-green-600' : 'text-red-600'">
        {{ t.p.toFixed(2) }} ({{ t.P.toFixed(2) }}%)
      </p>
      <p class="mt-4 text-sm text-gray-500">Última atualização: {{ new Date(t.E).toLocaleTimeString() }}</p>
    </div>
    <p v-else class="text-gray-500">Sem dados para {{ symbol }}</p>
  </main>
</template>
