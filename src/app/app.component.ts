import { Component, inject, OnInit } from '@angular/core';
import { IonRouterOutlet, Platform, IonApp } from '@ionic/angular/standalone';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly platform = inject(Platform);

  isMobile: boolean = false;

  ngOnInit() {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready().then(() => {
      setTimeout(() => {
        //Só esconde o splash quando o app estiver PRONTO
        SplashScreen.hide();
      }, 1000);

      this.isMobile =
        this.platform.is('android') ||
        this.platform.is('ios') ||
        this.platform.is('mobileweb') ||
        this.platform.is('capacitor');

      if (this.isMobile) {
        document.body.classList.add('mobile-device');
      } else {
        document.body.classList.add('desktop-device');
      }

      setTimeout(() => {
        const safeAreaBottom = getComputedStyle(
          document.documentElement
        ).getPropertyValue('--ion-safe-area-bottom');

        if (safeAreaBottom === '0px' || !safeAreaBottom.trim()) {
          console.warn('Bottom Safe Area é 0px. Forçando para 34px.');
          document.documentElement.style.setProperty(
            '--ion-safe-area-bottom',
            '34px'
          );
        }
      }, 500);
    });
  }
}
