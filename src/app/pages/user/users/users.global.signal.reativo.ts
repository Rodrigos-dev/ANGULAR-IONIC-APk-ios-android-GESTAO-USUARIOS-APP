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
// import { UsersStoreService } from 'src/app/core/globals/user-signal-state';

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
//   private readonly usersStoreService = inject(UsersStoreService);

//   usersList = this.usersStoreService.users;
//   total = this.usersStoreService.total;

//   ngOnInit() {
//     this.usersStoreService.loadUsers(true);
//   }

//   loadMore(event: any) {
//     if (this.usersList().length < this.total()) {
//       this.usersStoreService.loadUsers(false, event);
//     } else {
//       event.target.complete();
//       event.target.disabled = true;
//     }
//   }

//   async editUser(userId: number) {
//     console.log('Editar - users.page.ts:49', userId);
//     const modal = await this.modalCtrl.create({
//       component: UserDetailPage,
//       componentProps: { userId },
//     });

//     modal.onDidDismiss().then((result) => {
//       if (result.data?.updated) this.usersStoreService.loadUsers(true);
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

//       this.usersStoreService.deleteUser(userId).subscribe({
//         next: () => {
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
