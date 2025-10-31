import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
import type { BinanceTicker24h } from '../types/binance'

type CombinedMsg = { stream: string; data: BinanceTicker24h }

export function useBinanceSocket(symbols: Ref<string[]> | string[]) {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const isReconnecting = ref(false)
  const lastError = ref<string | null>(null)
  const lastMessage = ref<BinanceTicker24h | null>(null)

  let backoff = 1000
  const maxBackoff = 30000
  let stopped = false
  let retryTimer: ReturnType<typeof setTimeout> | undefined
  const hasWindow = typeof window !== 'undefined'

  const buildUrl = (syms: string[]) => {
    const streams = syms.map((s) => `${s.toLowerCase()}@ticker`).join('/')
    return `wss://stream.binance.com:9443/stream?streams=${streams}`
  }

  const cleanup = () => {
    if (retryTimer) {
      clearTimeout(retryTimer)
      retryTimer = undefined
    }
    try {
      ws.value?.close()
    } catch {}
    ws.value = null
  }

  const scheduleReconnect = () => {
    if (stopped) return
    isConnected.value = false
    isReconnecting.value = true

    const base = Math.min(backoff, maxBackoff)

    const isTest = typeof import.meta !== 'undefined' && (import.meta as any).vitest
    const jitter = isTest ? 0 : Math.floor(Math.random() * 300)

    retryTimer = setTimeout(connect, base + jitter)
    backoff = Math.min(backoff * 2, maxBackoff)
  }

  const connect = () => {
    cleanup() // garante 1 WS ativo
    lastError.value = null
    const list = Array.isArray(symbols) ? symbols : symbols.value
    if (!list.length) return

    const socket = new WebSocket(buildUrl(list))
    ws.value = socket

    socket.onopen = () => {
      if (stopped) return
      isConnected.value = true
      isReconnecting.value = false
      backoff = 1000
    }

    socket.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data as string)
        const data: BinanceTicker24h =
          msg && typeof msg === 'object' && 'data' in msg ? (msg as CombinedMsg).data : (msg as BinanceTicker24h)
        if (stopped) return
        if (data && data.s) lastMessage.value = data
      } catch (e: any) {
        lastError.value = e?.message ?? 'Parse error'
      }
    }

    socket.onerror = () => {
      if (stopped) return
      lastError.value = 'WebSocket error'
    }

    socket.onclose = () => {
      if (stopped) return
      scheduleReconnect()
    }
  }

  const stop = () => {
    stopped = true
    isReconnecting.value = false
    cleanup()
  }

  if (!Array.isArray(symbols)) {
    watch(
      symbols,
      () => {
        cleanup()
        connect()
      },
      { deep: true }
    )
  }

  const onOnline = () => !stopped && connect()
  const onOffline = () => (isConnected.value = false)

  onMounted(() => {
    connect()
    if (hasWindow) {
      window.addEventListener('online', onOnline)
      window.addEventListener('offline', onOffline)
    }
  })

  onUnmounted(() => {
    if (hasWindow) {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
    stop()
  })

  return { ws, isConnected, isReconnecting, lastError, lastMessage, connect, stop }
}
