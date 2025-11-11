// import { Component, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { UsersService } from 'src/app/core/services/user/user.service';
// import { User } from 'src/app/core/models/user.model';
// import {
//   IonicModule,
//   LoadingController,
//   ModalController,
// } from '@ionic/angular';
// import { AlertService } from 'src/app/core/services/nativos/alert-controller.service';
// import { ToastService } from 'src/app/core/services/nativos/toast.service';
// import { verifyErrors } from 'src/app/shareds/utils/error-http-mapped';
// import { UserDetailPage } from '../user-detail/user-detail.page';
// import { BehaviorSubject, map, Observable, scan, switchMap, tap } from 'rxjs';

// @Component({
//   selector: 'app-users',
//   templateUrl: './users.page.html',
//   styleUrls: ['./users.page.scss'],
//   standalone: true,
//   imports: [CommonModule, FormsModule, IonicModule],
// })
// export class UsersPage {
//   private readonly userService = inject(UsersService);
//   private readonly alertControllerService = inject(AlertService);
//   private readonly toastControllerService = inject(ToastService);
//   private readonly loadingController = inject(LoadingController);
//   private readonly modalCtrl = inject(ModalController);

//   private readonly loadPage$ = new BehaviorSubject<{
//     page: number;
//     reset: boolean;
//   }>({
//     page: 1,
//     reset: true,
//   });
//   // Observable final da lista de usuários
//   public users$: Observable<User[]>;

//   page = 1;
//   total = 0;
//   currentPage = 1;

//   constructor() {
//     this.users$ = this.loadPage$.pipe(
//       switchMap(({ reset }) => {
//         const pageToLoad = reset ? 1 : this.currentPage;
//         return this.userService.getUsers(pageToLoad).pipe(
//           tap((res) => {
//             this.total = res.total; // total vem do serviço, não do Subject
//             if (reset) this.currentPage = 2;
//             else this.currentPage++;
//           }),
//           map((res) => ({ users: res.users, reset }))
//         );
//       }),
//       scan<{ users: User[]; reset: boolean }, User[]>(
//         (acc, { users, reset }) => (reset ? users : [...acc, ...users]),
//         []
//       )
//     );
//   }

//   loadUsers(reset: boolean = false) {
//     if (reset) {
//       this.page = 1;
//       this.loadPage$.next({ page: this.page, reset: true });
//     } else {
//       // A página já é incrementada no TAP (ou você precisa ajustar isso)
//       this.loadPage$.next({ page: this.page, reset: false });
//     }
//   }

//   loadMore(event: any) {
//     if ((this.page - 1) * 10 < this.total) {
//       // supondo 10 itens por página
//       this.loadUsers();
//       event.target.complete();
//     } else {
//       event.target.disabled = true;
//     }
//   }

//   async editUser(userId: number) {
//     console.log('Editar  users.page.ts:86', userId);
//     const modal = await this.modalCtrl.create({
//       component: UserDetailPage,
//       componentProps: { userId },
//     });

//     modal.onDidDismiss().then((result) => {
//       if (result.data?.updated) {
//         this.loadUsers(true);
//       }
//     });

//     await modal.present();
//   }

//   async deleteUser(userId: number) {
//     const resposta = await this.alertControllerService.open(
//       'Excluir item',
//       'Tem certeza que deseja excluir este item?',
//       'Confirmar',
//       'Cancelar'
//     );

//     if (resposta === 'Confirmar') {
//       const loading = await this.loadingController.create({
//         message: 'Excluindo usuário...',
//         spinner: 'circles',
//       });
//       await loading.present();

//       this.userService.deleteUser(userId).subscribe({
//         next: () => {
//           this.loadPage$.next({ page: 1, reset: true });

//           this.total--;

//           this.toastControllerService.showToast(
//             'Usuário excluído com sucesso!',
//             1000,
//             'checkmark-circle-outline'
//           );
//         },
//         error: (err) => {
//           const mappedError = verifyErrors(err);

//           this.toastControllerService.showToast(
//             mappedError.messageToUser,
//             3000,
//             'alert-circle-outline'
//           );
//         },
//         complete: () => {
//           loading.dismiss();
//         },
//       });
//     }
//   }
// }
