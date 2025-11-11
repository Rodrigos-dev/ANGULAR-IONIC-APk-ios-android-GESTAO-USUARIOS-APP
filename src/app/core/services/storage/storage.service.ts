import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly storage = inject(Storage);

  private _storage: Storage | null = null;

  async setSecureStorage(key: string, value: string | object): Promise<void> {
    const storedValue =
      typeof value === 'object' ? JSON.stringify(value) : value;
    await SecureStoragePlugin.set({ key, value: storedValue });
  }

  async getSecureStorage<T = string>(key: string): Promise<T | null> {
    try {
      const result = await SecureStoragePlugin.get({ key });
      const raw = result.value;

      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as T;
      }
    } catch (error) {
      console.log(
        `Exception while doing something: ${error} - storage.service.ts:30`
      );
      return null;
    }
  }

  async removeSecureStorage(key: string): Promise<void> {
    await SecureStoragePlugin.remove({ key });
  }

  async keysSecureStorage(key: string): Promise<boolean> {
    try {
      const result = await SecureStoragePlugin.get({ key });
      return !!result.value;
    } catch (error: any) {
      console.log(
        `Exception while doing something: ${error} - storage.service.ts:44`
      );
      return false;
    }
  }

  async create() {
    this._storage = await this.storage.create();
  }

  async setIonicStorage(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  async getIonicStorage(key: string): Promise<any> {
    return await this._storage?.get(key);
  }

  async removeIonicStorage(key: string): Promise<void> {
    await this._storage?.remove(key);
  }

  async keysIonicStorage(): Promise<string[]> {
    return (await this._storage?.keys()) || [];
  }

  async hasKeyIonicStorage(key: string): Promise<boolean> {
    const keys = await this._storage?.keys();
    return keys ? keys.some((k) => k === key) : false;
  }

  async clearIonicStorage(): Promise<void> {
    await this._storage?.clear();
  }
}
