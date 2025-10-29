import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BinanceTicker24h } from '@/types/binance'

export type Ticker = {
  s: string
  c: number
  p: number
  P: number
  E: number
}

export const useCryptoStore = defineStore('crypto', () => {
  const symbols = ref<string[]>(['BTCUSDT','ETHUSDT','BNBUSDT','SOLUSDT','ADAUSDT'])
  const map = ref<Record<string, Ticker>>({})

  function upsert(raw: BinanceTicker24h) {
    const s = raw.s
    const c = Number(raw.c)
    const p = Number(raw.p)
    const P = Number(raw.P)
    map.value[s] = { s, c, p, P, E: raw.E }
  }

  const list = computed(() =>
    symbols.value
      .map(s => map.value[s])
      .filter(Boolean)
      .sort((a, b) => (a!.s < b!.s ? -1 : 1))
  )

  const lastUpdatedAt = computed(() => {
    const ms = Math.max(0, ...Object.values(map.value).map(t => t.E))
    return ms ? new Date(ms) : null
  })

  return { symbols, map, list, lastUpdatedAt, upsert }
})
