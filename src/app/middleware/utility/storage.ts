import { Plugins } from "@capacitor/core";
import { CacheData } from './cachedata';

const { Storage } = Plugins;

export async function set(key: string, value: CacheData): Promise<void> {
    await Storage.set({
        key: key,
        value: JSON.stringify(value)
    });
}

export async function get(key: string): Promise<CacheData> {
    const item = await Storage.get({ key: key });
    return JSON.parse(item.value);
}

export async function remove(key: string): Promise<void> {
    await Storage.remove({
        key: key
    });
}