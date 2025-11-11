import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, fromEvent, Subscription } from 'rxjs';

import { LINKS_HOME } from 'src/app/shareds/utils/links-home';
import { sizeScreemConst } from 'src/app/shareds/consts/size-screem';
import {
  PopoverMenuComponent,
  PopoverMenuItem,
} from '../popover-menu/popover-menu.component';
import { NavLink } from 'src/app/core/models/nav-link.model';
import { UserDetailPage } from 'src/app/pages/user/user-detail/user-detail.page';
import { UsersStoreService } from 'src/app/core/globals/user-signal-state';
import { IonicModule, ModalController } from '@ionic/angular';
import { StorageKeys } from 'src/app/shareds/consts/storage-keys';
import { UserAuth } from 'src/app/core/models/user.model';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserRegisterPage } from 'src/app/pages/user/user-register/user-register.page';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, PopoverMenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);

  private readonly modalCtrl = inject(ModalController);
  private readonly usersStoreService = inject(UsersStoreService);
  private readonly storage = inject(StorageService);
  private readonly authService = inject(AuthService);

  @Output() navigateRoute = new EventEmitter<string>();

  // Usamos IonContent ou ElementRef se precisarmos manipular o scroll
  @ViewChild('menuLinksContainer') menuLinksContainer!: ElementRef;

  //RESPONSIVIDADE
  breakpointMobileMax = sizeScreemConst.breakpointMobileMax;

  // Variáveis de Estado
  links: NavLink[] = LINKS_HOME;
  currentUrl: string = '';
  isMobile: boolean = false;
  userImageUrl: string | null = null; // Use string | null para a imagem
  notificationCount: number = 2;

  // Controle de Menu e Scroll
  expandedMenu: string | null = null;
  showScrollLeft: boolean = false;
  showScrollRight: boolean = true;
  private resizeSub!: Subscription;

  // Para o popover dO AVATAR
  isMenuOpen = false;
  menuEvent: any;
  avatarMenuItems: PopoverMenuItem[] = [
    {
      label: 'Perfil',
      icon: 'person-outline',
      style: { '--color': 'var(--cor-verde-medio)' },
      action: () => this.goToProfile(),
    },
    {
      label: 'Sair',
      icon: 'log-out-outline',
      style: { '--color': 'var(--cor-vermelho)' },
      color: 'danger',
      action: () => this.logout(),
    },
  ];

  // Para o popover dos links com filhos (desktop)
  linkPopoverItems: PopoverMenuItem[] = [];
  isLinkPopoverOpen = false;
  linkPopoverEvent: any;

  ngOnInit() {
    this.checkScreenSize();

    if (isPlatformBrowser(this.platformId)) {
      this.resizeSub = fromEvent(window, 'resize').subscribe(() => {
        this.checkScreenSize();
      });

      this.currentUrl = this.router.url;
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.currentUrl = event.urlAfterRedirects;
          this.cdr.detectChanges();
        });
    }
  }

  ngAfterViewInit() {
    // Adicionar listener de scroll (apenas para desktop)
    if (!this.isMobile) {
      setTimeout(() => {
        this.addScrollListener();
        this.checkScroll();
      }, 500);
    }
  }

  ngOnDestroy() {
    this.resizeSub?.unsubscribe();
  }

  // Lógica de Tela
  checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= this.breakpointMobileMax; // Ajuste para sua constante

      if (wasMobile !== this.isMobile) {
        this.cdr.detectChanges();
      }
    }
  }

  toggleExpandedMenu(menuId: string) {
    this.expandedMenu = this.expandedMenu === menuId ? null : menuId;
  }

  closeMenu() {
    this.expandedMenu = null;
    this.isMenuOpen = false;
  }

  isParentActive(link: NavLink): boolean {
    if (!link.children) return false;
    return link.children.some((child) =>
      this.currentUrl.startsWith(child.path ?? '')
    );
  }

  // Lógica do Scroll Desktop (Mantida do seu código)
  addScrollListener(): void {
    if (this.menuLinksContainer?.nativeElement) {
      this.menuLinksContainer.nativeElement.addEventListener('scroll', () => {
        this.checkScroll();
      });
    }
  }

  scrollMenu(amount: number): void {
    const el = this.menuLinksContainer?.nativeElement;
    if (el) {
      el.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(() => this.checkScroll(), 350);
    }
  }

  checkScroll(): void {
    // Seu código de checkScroll original (usando setTimeout para NG0100)
    const el = this.menuLinksContainer?.nativeElement;
    if (el) {
      const scrollWidth = el.scrollWidth;
      const offsetWidth = el.offsetWidth;
      const scrollLeft = el.scrollLeft;

      const isScrollActive = scrollWidth > offsetWidth;
      let newShowScrollLeft = false;
      let newShowScrollRight = false;

      if (isScrollActive) {
        newShowScrollLeft = scrollLeft > 5;
        newShowScrollRight = scrollWidth - offsetWidth - scrollLeft > 5;
      }

      this.zone.run(() => {
        this.showScrollLeft = newShowScrollLeft;
        this.showScrollRight = newShowScrollRight;
        this.cdr.detectChanges();
      });
    }
  }

  // Funções de Ação (Apenas para simular)
  async goToProfile() {
    const userStorage = await this.storage.getSecureStorage<UserAuth>(
      StorageKeys.USER
    );
    const userId = userStorage?.user?.id;
    return this.profileUser(Number(userId));
  }
  async logout() {
    await this.authService.logout();
  }

  openMenu(event: any) {
    this.menuEvent = event;
    this.isMenuOpen = true;
  }

  navigate(route: string) {
    if (!route) return;

    if (route === 'users/register') {
      this.registerUser();
    } else {
      this.router.navigate([route]);
    }

    this.closeMenu();
  }

  //para exibir os items do menu em desktop menu cadastro configuracoes etc
  openLinkPopover(ev: any, children: any[]) {
    console.log(children, 'aaaa - sidebar.component.ts:233');
    this.linkPopoverItems = children.map((child) => ({
      label: child.label,
      route: child.path,
      icon: child.icon,
    }));
    this.linkPopoverEvent = ev;
    this.isLinkPopoverOpen = true;
  }

  //para menu daa navegacoes pegar click
  onChildClick(item: any) {
    console.log('Filho clicado: - sidebar.component.ts:245', item);
    this.navigate(item.route);
  }

  closeLinkPopover() {
    this.isLinkPopoverOpen = false;
  }

  onLinkPopoverSelect(item: PopoverMenuItem) {
    if (item.route) this.navigate(item.route);
    else if (item.action) item.action?.();
    this.closeLinkPopover();
  }

  async profileUser(userId: number) {
    const modal = await this.modalCtrl.create({
      component: UserDetailPage,
      componentProps: { userId },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.updated) this.usersStoreService.loadUsers(true);
    });

    await modal.present();
  }

  async registerUser() {
    const modal = await this.modalCtrl.create({
      component: UserRegisterPage,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.updated) this.usersStoreService.loadUsers(true);
    });

    await modal.present();
  }
}
