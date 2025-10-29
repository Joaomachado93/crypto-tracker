import { describe, it, expect } from 'vitest'
import { pctChange, toNumberSafe } from '@/utils/math'

describe('math utils', () => {
  it('pctChange works', () => {
    expect(pctChange(110, 100)).toBeCloseTo(10)
    expect(pctChange(90, 100)).toBeCloseTo(-10)
    expect(pctChange(100, 0)).toBe(0)
  })

  it('toNumberSafe', () => {
    expect(toNumberSafe('1.23')).toBeCloseTo(1.23)
    expect(toNumberSafe('abc', 7)).toBe(7)
  })
})
