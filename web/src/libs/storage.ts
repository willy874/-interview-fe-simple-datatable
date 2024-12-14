import { computed, onMounted, onUnmounted, ref } from "vue"

class StorageOperator {
  private current: Storage
  private listeners: ((event: StorageEvent) => void)[] = []
  private batchListeners: ((event: StorageEvent[]) => void)[] = []
  private batchCount = 0
  private batchQueue: StorageEvent[] = []

  constructor(storage: Storage) {
    this.current = storage
  }

  getItem(key: string) {
    return this.current.getItem(key)
  }

  setItem(key: string, value: string) {
    const event = new StorageEvent('storage', {
      key,
      oldValue: value,
      newValue: this.getItem(key),
      url: window.location.href,
    })
    this.current.setItem(key, value)
    this.emit(event)
  }

  removeItem(key: string) {
    const event = new StorageEvent('storage', {
      key,
      oldValue: this.getItem(key),
      newValue: null,
      url: window.location.href,
    })
    this.current.removeItem(key)
    this.emit(event)
  }

  on(listener: (event: StorageEvent) => void) {
    this.listeners.push(listener)
    return () => {
      this.off(listener)
    }
  }

  off(listener: (event: StorageEvent) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener)
  }

  emit(event: StorageEvent) {
    this.listeners.forEach((listener) => listener(event))
    this.batchCount++
    Promise.resolve().then(() => {
      this.emitBatchUpdated(event)
    })
  }

  onBatchUpdated(listener: (events: StorageEvent[]) => void) {
    this.batchListeners.push(listener)
    return () => {
      this.batchListeners = this.batchListeners.filter((l) => l !== listener)
    }
  }

  emitBatchUpdated(event: StorageEvent) {
    this.batchQueue.push(event)
    this.batchCount--
    if (this.batchCount === 0) {
      this.batchListeners.forEach((listener) => listener(this.batchQueue))
      this.batchQueue = []
    }
  }
}

export const getStorage = () => {
  return {
    local: new StorageOperator(window.localStorage),
    session: new StorageOperator(window.sessionStorage),
  }
}

export { StorageOperator }

export const useLocalStorage = (key: string) => {
  const getValue = (): string | null => {
    const storage = getStorage().local
    return storage.getItem(key) || ''
  }

  const setValue = (value: string | null) => {
    const storage = getStorage().local
    if (typeof value === 'string') {
      storage.setItem(key, value)
    } else {
      storage.removeItem(key)
    }
  }

  const subscribe = (callback: (v: string | null) => void) => {
    const storage = getStorage().local
    return storage.on((event) => {
      if (event.key === key) {
        callback(event.newValue)
      }
    })
  }

  const result = ref(getValue())
  const onChange = (value: string | null) => {
    result.value = value
  }
  let onCleanup = () => {}
  onMounted(() => {
    if (result.value === null) {
      result.value = getValue()
    }
    onCleanup = subscribe(onChange)
  })
  onUnmounted(() => {
    onCleanup()
  })

  return computed({
    get: () => result.value,
    set: (value: string | null) => setValue(value),
  })
}
