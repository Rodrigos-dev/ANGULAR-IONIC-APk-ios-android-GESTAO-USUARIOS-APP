// import { Component, inject, OnInit } from '@angular/core';
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
// import { firstValueFrom, Observable } from 'rxjs';
// import { UserStateService } from 'src/app/core/globals/user-state.service';

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

//   private readonly userStore = inject(UserStateService);

//   // arquivo exemplo usando uma obeservable para a lista de usuarios edicao de um usuario deletar usuario
//   // tudo por variavel gloabl no userstore
//   //esse arquivo nao esta em uso apenas eh um exemplo e faz exatamente a mesma coisa que o users.page.ts faz porem lah a observable
//   ///esta apenas no arquivo

//   users2$!: Observable<User[]>;
//   total2$!: Observable<number>;

//   page = 1;
//   total = 0;
//   currentPage = 1;

//   ngOnInit() {
//     this.users2$ = this.userStore.users$;
//     this.total2$ = this.userStore.total$;
//     this.userStore.loadUsers(true);
//   }

//   async loadMore(event: any) {
//     // Evita múltiplas subscrições
//     const total = await firstValueFrom(this.total2$);
//     const users = await firstValueFrom(this.users2$);

//     if (users.length < total) {
//       this.userStore.loadUsers();
//     } else {
//       event.target.disabled = true;
//     }

//     // Finaliza o loading visual
//     event.target.complete();
//   }

//   async editUser(userId: number) {
//     console.log('Editar      users.page.ts:291 - users.global.observable.reativo.ts:68', userId);
//     const modal = await this.modalCtrl.create({
//       component: UserDetailPage,
//       componentProps: { userId },
//     });

//     modal.onDidDismiss().then((result) => {
//       if (result.data?.updated) {
//         console.log('faca algo com o retorno - users.global.observable.reativo.ts:76');
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
//           this.userStore.removeUserFromList(userId);

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
