import { ref, watch, onUnmounted, type Ref } from 'vue'
import type { BinanceTicker24h } from '../types/binance'

const WS_BASE = 'wss://stream.binance.com:9443/ws'
const INITIAL_BACKOFF = 1000
const MAX_BACKOFF = 30000

export function useBinanceSocket(symbols: Ref<string[]>) {
  const socket = ref<WebSocket | null>(null)
  const lastMessage = ref<BinanceTicker24h | null>(null)
  const isConnected = ref(false)
  const isReconnecting = ref(false)
  const lastError = ref<string | null>(null)

  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let backoff = INITIAL_BACKOFF
  let gotFirstMessage = false
  let isConnecting = false

  const clearReconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  const scheduleReconnect = () => {
    if (reconnectTimer) return
    if (isConnecting) return
    if (socket.value) return

    isReconnecting.value = true
    const delay = Math.min(backoff, MAX_BACKOFF)
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null
      connect()
      backoff = Math.min(backoff * 2, MAX_BACKOFF)
    }, delay)
  }

  const connect = () => {
    if (isConnecting) return
    isConnecting = true

    clearReconnect()
    if (socket.value) {
      try {
        socket.value.onclose = null
        socket.value.close()
      } catch {}
      socket.value = null
    }

    gotFirstMessage = false

    const url = `${WS_BASE}/${symbols.value.map(s => `${s.toLowerCase()}@ticker`).join('/')}`
    const ws = new WebSocket(url)
    socket.value = ws

    ws.onopen = () => {
      isConnected.value = true
      lastError.value = null
      backoff = INITIAL_BACKOFF
      clearReconnect()
      isConnecting = false
    }

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data as string)
        if (data?.e === '24hrTicker') {
          lastMessage.value = data as BinanceTicker24h
          if (!gotFirstMessage) {
            gotFirstMessage = true
            isReconnecting.value = false
          }
        }
      } catch {
        lastError.value = 'Erro ao processar mensagem.'
      }
    }

    ws.onerror = () => {
      lastError.value = 'Erro de WebSocket.'
    }

    ws.onclose = () => {
      isConnected.value = false
      isConnecting = false
      socket.value = null
      scheduleReconnect()
    }
  }

  // a ligar
  watch(
    symbols,
    () => {
      connect();
    },
    { immediate: true, deep: true }
  )


  onUnmounted(() => {
    clearReconnect()
    if (socket.value) {
      try {
        socket.value.onclose = null
        socket.value.close()
      } catch {}
      socket.value = null
    }
  })

  return { lastMessage, isConnected, isReconnecting, lastError, connect }
}
