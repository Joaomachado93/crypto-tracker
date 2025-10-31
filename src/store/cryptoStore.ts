import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BinanceTicker24h } from '../types/binance'

export type Ticker = {
  s: string
  c: number
  p: number
  P: number
  E: number
}

function formatSymbol(s: string) {
  return String(s || '').toUpperCase()
}

export const useCryptoStore = defineStore('crypto', () => {
  const symbols = ref<string[]>(['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT'])
  const tickBySymbol = ref<Record<string, Ticker>>({})

  function upsert(raw: BinanceTicker24h) {
    const s = formatSymbol(raw.s)
    tickBySymbol.value[s] = {
      s,
      c: Number(raw.c),
      p: Number(raw.p),
      P: Number(raw.P),
      E: raw.E,
    }
  }

  const list = computed(() =>
    symbols.value
      .map(s => tickBySymbol.value[formatSymbol(s)])
      .filter((t): t is Ticker => Boolean(t))
      // order %
      .sort((a, b) => b.P - a.P)
  )

  const lastUpdatedAt = computed(() => {
    const ms = Math.max(0, ...Object.values(tickBySymbol.value).map(t => t.E))
    return ms ? new Date(ms) : null
  })

  return { symbols, tickBySymbol, list, lastUpdatedAt, upsert }
})
