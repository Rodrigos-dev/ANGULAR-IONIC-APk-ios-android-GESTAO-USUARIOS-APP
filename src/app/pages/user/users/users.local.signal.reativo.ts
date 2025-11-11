// import { Component, computed, inject, OnInit, signal } from '@angular/core';
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

// @Component({
//   selector: 'app-users',
//   templateUrl: './users.page.html',
//   styleUrls: ['./users.page.scss'],
//   standalone: true,
//   imports: [CommonModule, FormsModule, IonicModule],
// })
// export class UsersPage implements OnInit {
//   private readonly userService = inject(UsersService);
//   private readonly alertControllerService = inject(AlertService);
//   private readonly toastControllerService = inject(ToastService);
//   private readonly loadingController = inject(LoadingController);
//   private readonly modalCtrl = inject(ModalController);

//   page = signal(1);
//   total = signal(0);
//   reset = signal(true);
//   users = signal<User[]>([]);
//   usersList = computed(() => this.users());

//   ngOnInit() {
//     this.loadUsers(true);
//   }

//   loadUsers(reset: boolean = false) {
//     const page = reset ? 1 : this.page();

//     this.userService.getUsers(page).subscribe((res) => {
//       this.total.set(res.total);

//       if (reset) {
//         this.users.set(res.users);
//         this.page.set(2);
//       } else {
//         const ids = new Set(this.users().map((u) => u.id));
//         this.users.update((curr) => [
//           ...curr,
//           ...res.users.filter((u) => !ids.has(u.id)),
//         ]);
//         this.page.update((p) => p + 1);
//       }
//     });
//   }

//   loadMore(event: any) {
//     const total = this.total();
//     const loaded = this.users().length;

//     if (loaded < total) {
//       this.loadUsers();
//       event.target.complete();
//     } else {
//       event.target.disabled = true;
//     }
//   }

//   async editUser(userId: number) {
//     console.log('Editar  users.page.ts:109 - users.local.signal.reativo.ts:73', userId);
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
//     const confirm = await this.alertControllerService.open(
//       'Excluir item',
//       'Tem certeza que deseja excluir este item?',
//       'Confirmar',
//       'Cancelar'
//     );

//     if (confirm === 'Confirmar') {
//       const loading = await this.loadingController.create({
//         message: 'Excluindo usuário...',
//         spinner: 'circles',
//       });
//       await loading.present();

//       this.userService.deleteUser(userId).subscribe({
//         next: () => {
//           // remove o usuário da lista local reativamente
//           this.users.update((list) => list.filter((u) => u.id !== userId));
//           this.total.update((t) => t - 1);

//           this.toastControllerService.showToast(
//             'Usuário excluído com sucesso!',
//             1000,
//             'checkmark-circle-outline'
//           );
//         },
//         error: (err) => {
//           const mapped = verifyErrors(err);
//           this.toastControllerService.showToast(
//             mapped.messageToUser,
//             3000,
//             'alert-circle-outline'
//           );
//         },
//         complete: () => loading.dismiss(),
//       });
//     }
//   }
// }
