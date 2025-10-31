import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useBinanceSocket } from '@/composables/useBinanceSocket'

class WSStub {
  static instances: WSStub[] = []
  onopen?: () => void
  onmessage?: (e: MessageEvent) => void
  onclose?: () => void
  onerror?: () => void

  constructor(public url: string) {
    WSStub.instances.push(this)
    setTimeout(() => this.onopen?.(), 0)
  }
  close() {
    setTimeout(() => this.onclose?.(), 0)
  }
  __emit(data: any) {
    this.onmessage?.({ data: JSON.stringify(data) } as any)
  }
}

let warnSpy: ReturnType<typeof vi.spyOn> | undefined

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('WebSocket', WSStub as any)
  WSStub.instances = []
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  WSStub.instances = []
  warnSpy?.mockRestore()
})

describe('useBinanceSocket', () => {
  it('last Message', async () => {
    const symbols = ref(['BTCUSDT', 'ETHUSDT'])
    const { lastMessage, isConnected, connect } = useBinanceSocket(symbols)

    connect()
    await nextTick()
    vi.runAllTimers()

    expect(WSStub.instances.length).toBe(1)

    WSStub.instances[0].__emit({
      e: '24hrTicker',
      E: 1730198401234,
      s: 'BTCUSDT',
      p: '100.00',
      P: '0.50',
      c: '64001.00',
    })
    await nextTick()

    expect(isConnected.value).toBeTruthy()
    expect(lastMessage.value?.s).toBe('BTCUSDT')
    expect(lastMessage.value?.c).toBe('64001.00' as any)
  })

  it('Tentar ligar após close sem ficar em loop ', async () => {
    const symbols = ref(['BTCUSDT'])
    const { isConnected, isReconnecting, connect } = useBinanceSocket(symbols)

    connect()
    await nextTick()
    vi.runAllTimers()

    WSStub.instances[0].close()

     vi.runOnlyPendingTimers()

    vi.advanceTimersToNextTimer()

    expect(WSStub.instances.length).toBe(2)

    expect(isConnected.value === false || isReconnecting.value === true).toBeTruthy()
  })
})
