import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
import type { BinanceTicker24h } from '@/types/binance'

export function useBinanceSocket(symbols: Ref<string[]> | string[]) {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const isReconnecting = ref(false)
  const lastError = ref<string | null>(null)
  const lastMessage = ref<BinanceTicker24h | null>(null)

  let backoff = 1000
  const maxBackoff = 30000
  let stopped = false

  const url = (syms: string[]) =>
    `wss://stream.binance.com:9443/ws/` +
    syms.map(s => `${s.toLowerCase()}@ticker`).join('/')

  const connect = () => {
    try { ws.value?.close() } catch {}
    ws.value = null
    lastError.value = null
    const list = Array.isArray(symbols) ? symbols : symbols.value
    if (!list.length) return

    const socket = new WebSocket(url(list))
    ws.value = socket

    socket.onopen = () => {
      isConnected.value = true
      isReconnecting.value = false
      backoff = 1000
    }
    socket.onmessage = (ev) => {
      try { lastMessage.value = JSON.parse(ev.data) }
      catch (e: any) { lastError.value = e?.message ?? 'parse error' }
    }
    const schedule = () => {
      if (stopped) return
      isConnected.value = false
      isReconnecting.value = true
      setTimeout(connect, backoff)
      backoff = Math.min(backoff * 2, maxBackoff)
    }
    socket.onerror = schedule
    socket.onclose = schedule
  }

  const stop = () => {
    stopped = true
    isReconnecting.value = false
    isConnected.value = false
    try { ws.value?.close() } catch {}
    ws.value = null
  }

  onMounted(connect)
  onUnmounted(stop)

  if (!Array.isArray(symbols)) {
    watch(symbols, () => { if (!stopped) connect() }, { deep: true })
  }

  const onOnline = () => !stopped && connect()
  const onOffline = () => (isConnected.value = false)
  if (typeof window !== 'undefined') {
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    onUnmounted(() => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    })
  }

  // 👇 adiciona isto no retorno
  return { ws, isConnected, isReconnecting, lastError, lastMessage, connect, stop }
}
