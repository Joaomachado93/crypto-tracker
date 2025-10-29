import { formatNumber, formatPrice } from '@/utils/math'

export function useFormats() {
  // UI formatting helpers
  const price = (n: number, d = 2) => formatPrice(n, d)
  const num = (n: number, d = 2) => formatNumber(n, d)
  const sign = (n: number) => (n > 0 ? '+' : n < 0 ? '−' : '')
  const arrow = (n: number) => (n > 0 ? '▲' : n < 0 ? '▼' : '•')
  const colorClass = (n: number) => (n > 0 ? 'text-emerald-400' : n < 0 ? 'text-rose-400' : 'text-slate-400')
  const percent = (n: number) => `${n.toFixed(2)}%`

  return { price, num, sign, arrow, colorClass, percent }
}
