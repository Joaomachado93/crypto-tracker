import { describe, it, expect } from 'vitest'
import { parseTicker } from '@/utils/parseTicker'

describe('parseTicker', () => {
  it('converte strings Binance para números e mantém campos base', () => {
    const raw = {
      e: '24hrTicker',
      E: 1730198400000,
      s: 'BTCUSDT',
      p: '123.45',
      P: '1.23',
      c: '64000.12',
    } as any

    const t = parseTicker(raw)
    expect(t.s).toBe('BTCUSDT')
    expect(t.c).toBe(64000.12)
    expect(t.p).toBe(123.45)
    expect(t.P).toBe(1.23)
    expect(t.E).toBe(1730198400000)
  })
})
