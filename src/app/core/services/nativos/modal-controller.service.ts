import { inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly modalCtrl = inject(ModalController);

  async open(
    component: any,
    props: any = {},
    cssClass: string = '',
    showBackdrop: boolean = false
  ) {
    const modal = await this.modalCtrl.create({
      component,
      showBackdrop,
      componentProps: props,
      cssClass,
    });

    await modal.present();
    return modal;
  }

  async fechar(data: any = null) {
    await this.modalCtrl.dismiss(data);
  }
}
