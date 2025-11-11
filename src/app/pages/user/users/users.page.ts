import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from 'src/app/core/services/user/user.service';
import { User } from 'src/app/core/models/user.model';
import {
  IonicModule,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { AlertService } from 'src/app/core/services/nativos/alert-controller.service';
import { ToastService } from 'src/app/core/services/nativos/toast.service';
import { verifyErrors } from 'src/app/shareds/utils/error-http-mapped';
import { UserDetailPage } from '../user-detail/user-detail.page';
import { UsersStoreService } from 'src/app/core/globals/user-signal-state';
import { Store } from '@ngrx/store';
import {
  selectDeleteUserError,
  selectDeleteUserLoading,
  selectUsersHasMore,
  selectUsersList,
  selectUsersLoading,
  selectUsersLoadingMore,
  selectUsersState,
} from 'src/app/store/users/users.selectors';
import {
  deleteUser,
  loadMoreUsers,
  loadUsers,
} from 'src/app/store/users/users.actions';
import { filter, Observable, take, timeout } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class UsersPage {
  private readonly userService = inject(UsersService);
  private readonly alertControllerService = inject(AlertService);
  private readonly toastControllerService = inject(ToastService);
  private readonly loadingController = inject(LoadingController);
  private readonly modalCtrl = inject(ModalController);
  private readonly usersStoreService = inject(UsersStoreService);

  private readonly store = inject(Store);

  // Observables reativos
  users$: Observable<User[]> = this.store.select(selectUsersList);
  loading$: Observable<boolean> = this.store.select(selectUsersLoading);
  loadingMore$: Observable<boolean> = this.store.select(selectUsersLoadingMore);
  hasMore$: Observable<boolean> = this.store.select(selectUsersHasMore);

  ionViewDidEnter() {
    this.loadInitialUsers();
  }

  loadInitialUsers() {
    this.store.dispatch(loadUsers());
  }

  retry() {
    this.loadInitialUsers();
  }

  // Load More simplificado
  loadMore(event: any) {
    this.hasMore$.pipe(take(1)).subscribe((hasMore) => {
      if (hasMore) {
        this.store.dispatch(loadMoreUsers()); //Dispatch simples
      } else {
        event.target.complete();
        event.target.disabled = true;
      }
    });
  }

  async editUser(userId: number) {
    console.log('Editar - users.page.ts:82', userId);
    const modal = await this.modalCtrl.create({
      component: UserDetailPage,
      componentProps: { userId },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.updated) this.store.dispatch(loadUsers());
    });

    await modal.present();
  }

  async deleteUser(userId: number) {
    const confirm = await this.alertControllerService.open(
      'Excluir item',
      'Tem certeza que deseja excluir este item?',
      'Confirmar',
      'Cancelar'
    );

    if (confirm === 'Confirmar') {
      const loading = await this.loadingController.create({
        message: 'Excluindo usuário...',
        spinner: 'circles',
      });
      await loading.present();

      // ✅ Dispatch da action
      this.store.dispatch(deleteUser({ id: userId }));

      // ✅ CORREÇÃO: Observa o estado ESPECÍFICO do delete
      const subscription = this.store
        .select(selectDeleteUserLoading)
        .pipe(
          filter((loading) => !loading), // Espera o loading do delete terminar
          take(1),
          timeout(10000) // Timeout de segurança
        )
        .subscribe({
          next: () => {
            subscription.unsubscribe();
            loading.dismiss();

            // ✅ Verifica se houve erro no DELETE específico
            this.store
              .select(selectDeleteUserError)
              .pipe(take(1))
              .subscribe((error) => {
                if (error) {
                  const mapped = verifyErrors({
                    message: error,
                  } as HttpErrorResponse);
                  this.toastControllerService.showToast(
                    mapped.messageToUser,
                    3000,
                    'alert-circle-outline'
                  );
                } else {
                  // ✅ SUCESSO no delete
                  this.toastControllerService.showToast(
                    'Usuário excluído com sucesso!',
                    1000,
                    'checkmark-circle-outline'
                  );
                }
              });
          },
          error: () => {
            subscription.unsubscribe();
            loading.dismiss();
            this.toastControllerService.showToast(
              'Timeout na operação',
              3000,
              'alert-circle-outline'
            );
          },
        });
    }
  }
}
