import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { AppRoutes } from 'src/app/shareds/consts/rotas';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SplashPage implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  public platForm = inject(Platform);

  ngOnInit() {
    setTimeout(async () => {
      const isLoggedIn = await this.authService.isLoggedUser();

      if (isLoggedIn) {
        this.router.navigateByUrl(AppRoutes.USER, {
          replaceUrl: true,
        });
      } else this.router.navigateByUrl(AppRoutes.LOGIN, { replaceUrl: true });
    }, 1000);
  }
}
