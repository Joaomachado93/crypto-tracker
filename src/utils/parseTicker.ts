import type { BinanceTicker24h } from '@/types/binance'

// saída normalizada
export type Ticker = { s: string; c: number; p: number; P: number; E: number }

type Envelope = { data: BinanceTicker24h }

function isEnvelope(x: unknown): x is Envelope {
  return typeof x === 'object' && x !== null && 'data' in x
}

function toTicker(src: BinanceTicker24h): Ticker {
  return {
    s: String(src.s),
    c: Number(src.c),
    p: Number(src.p),
    P: Number(src.P),
    E: Number(src.E),
  }
}

export function parseTicker(raw: BinanceTicker24h | Envelope): Ticker {
  const payload = isEnvelope(raw) ? raw.data : raw
  return toTicker(payload)
}

export default parseTicker
