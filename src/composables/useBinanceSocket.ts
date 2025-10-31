import { ref, watch, onUnmounted, type Ref } from 'vue'
import type { BinanceTicker24h } from '@/types/binance'

const WS_BASE = 'wss://stream.binance.com:9443/ws'

export function useBinanceSocket(symbols: Ref<string[]>) {
  const socket = ref<WebSocket | null>(null)
  const lastMessage = ref<BinanceTicker24h | null>(null)
  const isConnected = ref(false)
  const isReconnecting = ref(false)
  const lastError = ref<string | null>(null)

  // counter connection
  let reconnectTimeout: number | undefined
  let backoff = 1000

  function connect() {
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }

    const url = `${WS_BASE}/${symbols.value.map(s => s.toLowerCase() + '@ticker').join('/')}`
    const ws = new WebSocket(url)
    socket.value = ws

    ws.onopen = () => {
      isConnected.value = true
      isReconnecting.value = false
      lastError.value = null
      backoff = 1000 // reset backoff
    }

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.e === '24hrTicker') lastMessage.value = data
      } catch {
        lastError.value = 'Erro ao processar mensagem.'
      }
    }

    ws.onerror = (e) => {
      lastError.value = 'Erro de WebSocket.'
      console.error('WebSocket error:', e)
    }

    ws.onclose = () => {
      isConnected.value = false
      isReconnecting.value = true
      reconnect()
    }
  }

  function reconnect() {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = window.setTimeout(() => {
      connect()
      //until 30s
      backoff = Math.min(backoff * 2, 30000)
    }, backoff)
  }

  watch(symbols, () => connect(), { immediate: true })

  onUnmounted(() => {
    socket.value?.close()
    clearTimeout(reconnectTimeout)
  })

  return { lastMessage, isConnected, isReconnecting, lastError, connect }
}
