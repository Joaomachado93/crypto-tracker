export function toNumberSafe(x: unknown, fallback = 0): number {
  const n = typeof x === 'string' ? Number(x) : typeof x === 'number' ? x : NaN
  return Number.isFinite(n) ? n : fallback
}

export function pctChange(current: number, open: number): number {
  if (!Number.isFinite(current) || !Number.isFinite(open) || open === 0) return 0
  return ((current - open) / open) * 100
}

export function formatPrice(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return '-'
  return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export function formatNumber(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return '-'
  return n.toLocaleString(undefined, { maximumFractionDigits: decimals })
}
