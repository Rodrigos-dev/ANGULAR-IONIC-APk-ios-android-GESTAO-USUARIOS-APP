import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { ToastService } from '../nativos/toast.service';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private previousNetworkState: boolean | null = null;

  constructor(private readonly toastService: ToastService) {
    this.initNetworkState();
  }

  verifyNetworkState() {
    Network.addListener('networkStatusChange', (status) => {
      if (status.connected !== this.previousNetworkState) {
        this.treatNetworkChange(status);
        this.previousNetworkState = status.connected;
      }
    });
  }

  async getConnectionType(): Promise<string> {
    const status = await Network.getStatus();
    return status.connectionType;
  }

  private treatNetworkChange(status: { connected: boolean }) {
    this.toastService.showToast(
      status.connected
        ? 'Sem conexão com a internet, você está no modo offline agora'
        : 'Conexão com a internet reestabelecida, você está online agora',
      5000,
      'wifi-outline'
    );
  }

  async initNetworkState() {
    const status = await Network.getStatus();
    this.previousNetworkState = status.connected;
    this.verifyNetworkState();
  }
}
