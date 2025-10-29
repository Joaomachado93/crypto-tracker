import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useBinanceSocket } from '@/composables/useBinanceSocket'

// ── WebSocket stub controlável ───────────────────────────────────
class WSStub {
  static instances: WSStub[] = []
  onopen?: () => void
  onmessage?: (e: MessageEvent) => void
  onclose?: () => void
  onerror?: () => void

  constructor(public url: string) {
    WSStub.instances.push(this)
    // simula onopen async
    setTimeout(() => this.onopen?.(), 0)
  }
  close() {
    // simula onclose async
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
  // silenciar avisos de lifecycle fora de componente
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  WSStub.instances = []
  warnSpy?.mockRestore()
})

describe('useBinanceSocket', () => {
  it('recebe mensagens e atualiza lastMessage', async () => {
    const symbols = ref(['BTCUSDT', 'ETHUSDT'])
    // ⚠️ o composable deve expor connect()
    const { lastMessage, isConnected, connect } = useBinanceSocket(symbols)

    // em Node, chamamos manualmente
    connect()
    await nextTick()
    vi.runAllTimers() // processa onopen

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
    // raw vem como string; normalização acontece na store/util
    expect(lastMessage.value?.c).toBe('64001.00')
  })

  it('reconecta após close (sem loop infinito)', async () => {
    const symbols = ref(['BTCUSDT'])
    const { isConnected, isReconnecting, connect } = useBinanceSocket(symbols)

    connect()
    await nextTick()
    vi.runAllTimers() // processa onopen

    // fecha a ligação → agenda reconexão com backoff inicial (1000ms)
    WSStub.instances[0].close()

    // ⛔️ NÃO usar vi.runAllTimers() aqui
    // ✅ avança só o primeiro backoff
    vi.advanceTimersByTime(1000)

    // nova instância criada na reconexão
    expect(WSStub.instances.length).toBe(2)
    // estados coerentes (durante a janela de reconexão)
    expect(isConnected.value === false || isReconnecting.value === true).toBeTruthy()
  })
})
