import { Injectable } from '@angular/core';
import 'capacitor-secure-storage-plugin';
import { Plugins } from '@capacitor/core';

const { SecureStoragePlugin } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {

  constructor() { }

  set = async ( key: string, value: string ) =>
  {
    const storage = await SecureStoragePlugin.set({ key, value });
    return storage;
  }
  
  get = async ( key: string ) =>
  {
    const storage = await SecureStoragePlugin.get({ key });
    return storage;
  }


  remove = async ( key: string ) =>
  {
    const storage = await SecureStoragePlugin.remove({ key });
    return storage;
  }

  clear = async ( key: string ) =>
  {
    const storage = await SecureStoragePlugin.clear({ key });
    return storage;
  }
}
