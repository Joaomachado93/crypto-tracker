import { describe, it, expect } from 'vitest'
import { parseTicker } from '@/utils/parseTicker'

describe('parseTicker', () => {
  it('normaliza payload combined', () => {
    const data = parseTicker({ data: { s: 'BTCUSDT', c: '1', p: '0.1', P: '10', E: 1 } })
    expect(data).toEqual({ s: 'BTCUSDT', c: 1, p: 0.1, P: 10, E: 1 })
  })
})
