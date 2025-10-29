import type { BinanceTicker24h } from '@/types/binance'

export type Ticker = {
  s: string
  c: number
  p: number
  P: number
  E: number
}

export function parseTicker(raw: BinanceTicker24h): Ticker {
  return {
    s: raw.s,
    c: Number(raw.c),
    p: Number(raw.p),
    P: Number(raw.P),
    E: raw.E,
  }
}
