class LocalStorageMock {
  private store: Record<string, string> = {}
  getItem(k: string) { return this.store[k] ?? null }
  setItem(k: string, v: unknown) { this.store[k] = String(v) }
  removeItem(k: string) { delete this.store[k] }
  clear() { this.store = {} }
}
if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
  ;(globalThis as any).localStorage = new LocalStorageMock()
}
