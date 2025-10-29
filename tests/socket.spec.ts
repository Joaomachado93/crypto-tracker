import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useBinanceSocket } from '@/composables/useBinanceSocket'

class WSStub {
  static instances: WSStub[] = []
  onopen?: () => void
  onmessage?: (e: MessageEvent) => void
  onclose?: () => void
  constructor(public url: string) {
    WSStub.instances.push(this)
    setTimeout(() => this.onopen?.(), 0)
  }
  close() { setTimeout(() => this.onclose?.(), 0) }
  __emit(data: any) {
    this.onmessage?.({ data: JSON.stringify(data) } as any)
  }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('WebSocket', WSStub as any)
  WSStub.instances = []
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  WSStub.instances = []
})

describe('useBinanceSocket', () => {
  it('recebe mensagens e atualiza lastMessage', async () => {
    const symbols = ref(['BTCUSDT','ETHUSDT'])
    const { lastMessage, isConnected, connect } = useBinanceSocket(symbols)

    connect() // 👈 chama manualmente
    await nextTick()
    vi.runAllTimers()

    expect(WSStub.instances.length).toBe(1)

    const payload = { s: 'BTCUSDT', p: '100.00', P: '0.50', c: '64001.00', E: 1730198401234 }
    WSStub.instances[0].__emit(payload)
    await nextTick()

    expect(isConnected.value).toBeTruthy()
    expect(lastMessage.value?.s).toBe('BTCUSDT')
    expect(lastMessage.value?.c).toBe('64001.00')
  })

  it('reconecta após close', async () => {
    const symbols = ref(['BTCUSDT'])
    const { isConnected, isReconnecting, connect } = useBinanceSocket(symbols)

    connect() // 👈 chama manualmente
    await nextTick()
    vi.runAllTimers()

    WSStub.instances[0].close()
    vi.advanceTimersByTime(1000)

    expect(isConnected.value).toBe(false)
    expect(isReconnecting.value).toBe(true)

    vi.advanceTimersByTime(1000)
    expect(WSStub.instances.length).toBe(2)
  })
})
