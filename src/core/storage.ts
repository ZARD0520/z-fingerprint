export class StorageManager {
  private storage: Storage;
  
  constructor(type: 'local' | 'session' = 'local') {
    try {
      this.storage = type === 'local' ? localStorage : sessionStorage;
    } catch (e) {
      this.storage = this.createFallbackStorage();
    }
  }

  private createFallbackStorage(): Storage {
    const store = new Map<string, string>();
    return {
      getItem: (key) => store.get(key) || null,
      setItem: (key, value) => store.set(key, value),
      removeItem: (key) => store.delete(key),
      clear: () => store.clear(),
      length: store.size,
      key: (index) => Array.from(store.keys())[index]
    } as Storage;
  }

  get(key: string): string | null {
    return this.storage.getItem(key);
  }

  set(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch (e) {
      console.warn('Storage quota exceeded');
    }
  }
}