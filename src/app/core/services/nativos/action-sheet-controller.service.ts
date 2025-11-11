import { inject, Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ActionSheetService {
  private readonly actionSheetController = inject(ActionSheetController);

  async openActionSheet(
    buttons: Array<{ text: string; handler: () => void; icon?: string }>,
    header: string = 'Escolha uma opção'
  ) {
    const actionSheet = await this.actionSheetController.create({
      header,
      buttons: [
        ...buttons,
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close',
          handler: () => {},
        },
      ],
    });

    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();
    return role;
  }
}
