import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastController = inject(ToastController);

  async showToast(
    message: string,
    duration: number = 5000,
    icon: string = 'alert-circle-outline'
  ) {
    const toast = await this.toastController.create({
      message,
      icon,
      duration,
      buttons: [
        {
          text: 'Fechar',
          role: 'Fechar',
        },
      ],
      cssClass: 'custom-toast',
    });
    await toast.present();
  }
}
