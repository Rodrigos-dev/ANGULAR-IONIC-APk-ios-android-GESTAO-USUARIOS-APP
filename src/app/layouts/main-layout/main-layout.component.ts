import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { SidebarComponent } from 'src/app/components/side-bar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  imports: [IonRouterOutlet, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  private readonly router = inject(Router);

  onNavigate(route: string) {
    console.log(route, 'aaaa - main-layout.component.ts:16');
  }
}
