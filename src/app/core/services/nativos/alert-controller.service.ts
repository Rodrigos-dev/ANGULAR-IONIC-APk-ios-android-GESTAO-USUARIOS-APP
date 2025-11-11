import { inject, Injectable } from '@angular/core';
import { AlertButton, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly alertController = inject(AlertController);

  async open(
    header: string,
    message: string,
    button1Text: string,
    button2Text?: string
  ): Promise<string> {
    return new Promise(async (resolve) => {
      const buttons: (string | AlertButton)[] | undefined = [
        {
          text: button1Text,
          cssClass: button2Text ? 'alert-button-1' : 'alert-button-1-full',
          htmlAttributes: {
            'aria-label': 'close',
          },
          handler: () => {
            resolve(button1Text);
          },
        },
      ];

      if (button2Text) {
        buttons.push({
          text: button2Text,
          cssClass: 'alert-button-2',
          htmlAttributes: {
            'aria-label': 'second-button',
          },
          handler: () => {
            resolve(button2Text);
          },
        });
      }

      const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: buttons,
        cssClass: 'custom-alert',
      });

      await alert.present();
    });
  }
}
