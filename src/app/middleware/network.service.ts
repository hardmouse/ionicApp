import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject, Observable } from 'rxjs';

const { Network } = Plugins;

export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private status = new BehaviorSubject<ConnectionStatus>(ConnectionStatus.Offline);
  constructor() {
  }

  Initialize() {
    Network.getStatus().then(status => {
      console.log(`Initialize: status: ${status.connected}, type: ${status.connectionType}`)
      this.status.next(status.connected ? ConnectionStatus.Online : ConnectionStatus.Offline);
    });

    this.addNetworkListner();
  }

  private addNetworkListner() {
    Network.addListener('networkStatusChange', (status) => {
      console.log(`NetworkChange: status: ${status.connected}, type: ${status.connectionType}`)
      this.status.next(status.connected ? ConnectionStatus.Online : ConnectionStatus.Offline);
    });
  }

  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }

  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }
}
