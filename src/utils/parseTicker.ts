
export type Ticker = {
  s: string
  c: number
  p: number
  P: number
  E: number
}

export function parseTicker(raw: any) {
  const msg = raw && typeof raw === 'object' && 'data' in raw ? raw.data : raw
  return {
    s: String(msg.s),
    c: Number(msg.c),
    p: Number(msg.p),
    P: Number(msg.P),
    E: Number(msg.E),
  }
}