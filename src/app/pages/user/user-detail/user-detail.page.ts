// import { Component, Input, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   FormsModule,
//   ReactiveFormsModule,
//   FormBuilder,
//   FormGroup,
//   Validators,
//   AbstractControl,
// } from '@angular/forms';
// import { IonicModule, ModalController } from '@ionic/angular';
// import { UsersService } from 'src/app/core/services/user/user.service';
// import { ToastService } from 'src/app/core/services/nativos/toast.service';
// import { verifyErrors } from 'src/app/shareds/utils/error-http-mapped';
// import { ButtonComponent } from 'src/app/components/elements/button/button.component';
// import { InputComponent } from 'src/app/components/elements/input/input.component';
// import {
//   InputSelectComponent,
//   SelectOption,
// } from 'src/app/components/elements/input-select/input-select.component';
// import { tap } from 'rxjs/operators';
// import { UserStateService } from 'src/app/core/globals/user-state.service';

// // Interface para tipagem do usuário
// interface UserData {
//   id: number;
//   name: string;
//   email: string;
//   roleUser: string;
//   document: string;
//   createdAt: string;
//   updatedAt: string;
// }

// @Component({
//   selector: 'app-user-detail',
//   templateUrl: './user-detail.page.html',
//   styleUrls: ['./user-detail.page.scss'],
//   standalone: true, // Mantido standalone
//   imports: [
//     CommonModule,
//     FormsModule,
//     IonicModule,
//     ButtonComponent,
//     ReactiveFormsModule,
//     InputComponent,
//     InputSelectComponent,
//   ],
// })
// export class UserDetailPage implements OnInit {
//   private readonly userService = inject(UsersService);
//   private readonly toastService = inject(ToastService);
//   private readonly modalController = inject(ModalController);
//   private readonly fb = inject(FormBuilder);

//   private readonly userStore = inject(UserStateService);

//   // Armazena o usuário completo, principalmente para o document (apenas leitura) e id.
//   public user: Partial<UserData> = {};

//   // O FormGroup para gerenciar o formulário
//   public userForm!: FormGroup;
//   public initialFormValue: any = {};

//   roleOptions: SelectOption[] = [
//     { value: 'user', label: 'Usuário' },
//     { value: 'admin', label: 'Administrador' },
//   ];

//   public dataLoaded: boolean = false;
//   public isLoading = false;

//   @Input() userId!: number;

//   ngOnInit() {
//     this.initializeForm();
//     this.loadUser();
//   }

//   //1. Inicializa o formulário com os validadores
//   private initializeForm(): void {
//     const validRoles = this.roleOptions.map((r) => r.value);

//     this.userForm = this.fb.group({
//       name: ['', [Validators.minLength(3)]],
//       email: ['', [Validators.email]], // Email e formato de email obrigatórios
//       roleUser: ['', [this.userService.roleValidator(validRoles)]],
//     });
//   }

//   // private roleValidator(validRoles: string[]) {
//   //   //valida as opcoes do role
//   //   return (control: AbstractControl) => {
//   //     if (!validRoles.includes(control.value)) {
//   //       return { invalidRole: true };
//   //     }
//   //     return null;
//   //   };
//   // }

//   handleRoleChange(newRole: string) {
//     //passa o valor do novo role selecionado
//     const control = this.userForm.get('roleUser');
//     control?.setValue(newRole);
//     control?.markAsDirty(); // garante que o form fique dirty
//   }

//   get canSave(): boolean {
//     //para verificar se o formulario foi alterado e liberar o botao
//     return this.userForm.dirty && this.userForm.valid;
//   }

//   loadUser() {
//     //carrega o usuario
//     this.isLoading = true;
//     this.userService
//       .getUserById(this.userId)
//       .pipe(
//         tap((res: UserData) => {
//           // Armazena todos os dados, inclusive os não reativos (document)
//           this.user = res;

//           // 2. Preenche o formulário com os valores e reseta o estado.
//           this.userForm.setValue({
//             name: res.name || '',
//             email: res.email || '',
//             roleUser: res.roleUser || '',
//           });

//           this.initialFormValue = this.userForm.value;

//           // Marca como 'pristine' após carregar os dados para que o form.dirty comece como false
//           this.userForm.markAsPristine();
//         })
//       )
//       .subscribe({
//         error: (err) => {
//           const mappedError = verifyErrors(err);
//           this.toastService.showToast(
//             mappedError.messageToUser,
//             5000,
//             'alert-circle-outline'
//           );
//           this.isLoading = false;
//         },
//         complete: () => (this.isLoading = false),
//       });
//   }

//   // A função handleRoleChange não é mais necessária, pois o Reactive Form gerencia o valor diretamente.
//   // Ela foi removida.

//   async saveChanges() {
//     //altera os dados dos campos apenas que foram alterados
//     const currentValues = this.userForm.value;
//     const initialData = this.initialFormValue;
//     const updateData: Partial<typeof currentValues> = {};

//     for (const key of Object.keys(currentValues)) {
//       // verifica o dado que mudou e retorna apenas ele update patch
//       if (currentValues[key] !== initialData[key]) {
//         updateData[key] = currentValues[key];
//       }
//     }

//     try {
//       this.isLoading = true;

//       this.userService.updateUser(this.user.id!, updateData).subscribe({
//         next: (res) => {
//           this.initialFormValue = { ...this.initialFormValue, ...updateData };
//           this.userForm.markAsPristine();
//           this.closeModal(true);

//           this.toastService.showToast(
//             'Dados atualizados com sucesso!',
//             3000,
//             'checkmark-circle-outline'
//           );
//         },
//         error: (err) => {
//           const mappedError = verifyErrors(err);
//           this.toastService.showToast(
//             mappedError.messageToUser,
//             5000,
//             'alert-circle-outline'
//           );
//         },
//         complete: () => (this.isLoading = false),
//       });
//     } catch (err) {
//       this.isLoading = false;
//       const mappedError = verifyErrors(err as any);
//       this.toastService.showToast(
//         mappedError.messageToUser,
//         5000,
//         'alert-circle-outline'
//       );
//     }
//   }

//   getFieldError(field: string): string | null {
//     //pega os erros do formulario para enviar para o note
//     const control = this.userForm.get(field);
//     if (!control || !control.touched || !control.errors) return null;

//     if (control.hasError('required')) {
//       return 'Este campo é obrigatório';
//     }
//     if (control.hasError('email')) {
//       return 'E-mail inválido';
//     }
//     if (control.hasError('minlength')) {
//       const requiredLength = control.getError('minlength').requiredLength;
//       return `Mínimo de ${requiredLength} caracteres`;
//     }

//     return null;
//   }

//   closeModal(updated: boolean = false) {
//     this.modalController.dismiss({ updated });
//   }
// }

import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { UsersService } from 'src/app/core/services/user/user.service';
import { ToastService } from 'src/app/core/services/nativos/toast.service';
import { verifyErrors } from 'src/app/shareds/utils/error-http-mapped';
import { ButtonComponent } from 'src/app/components/elements/button/button.component';
import { InputComponent } from 'src/app/components/elements/input/input.component';
import {
  InputSelectComponent,
  SelectOption,
} from 'src/app/components/elements/input-select/input-select.component';
import { filter, take, tap, timeout } from 'rxjs/operators';
import { UserStateService } from 'src/app/core/globals/user-state.service';
import { Store } from '@ngrx/store';
import {
  selectSelectedUser,
  selectSelectedUserError,
  selectSelectedUserLoading,
  selectUpdateUserError,
  selectUpdateUserLoading,
} from 'src/app/store/users/users.selectors';
import {
  clearSelectedUser,
  loadUserById,
  updateUser,
} from 'src/app/store/users/users.actions';
import { HttpErrorResponse } from '@angular/common/http';

// Interface para tipagem do usuário
interface UserData {
  id: number;
  name: string;
  email: string;
  roleUser: string;
  document: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
  standalone: true, // Mantido standalone
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ButtonComponent,
    ReactiveFormsModule,
    InputComponent,
    InputSelectComponent,
  ],
})
export class UserDetailPage implements OnInit {
  private readonly userService = inject(UsersService);
  private readonly toastService = inject(ToastService);
  private readonly modalController = inject(ModalController);
  private readonly fb = inject(FormBuilder);

  private readonly userStore = inject(UserStateService);
  private readonly store = inject(Store);

  @Input() userId!: number;

  // Observables do user selecionado
  user$ = this.store.select(selectSelectedUser);
  loading$ = this.store.select(selectSelectedUserLoading);
  error$ = this.store.select(selectSelectedUserError);
  canSaveVar = false;

  updateLoading$ = this.store.select(selectUpdateUserLoading);
  updateError$ = this.store.select(selectUpdateUserError);

  // O FormGroup para gerenciar o formulário
  public userForm!: FormGroup;
  public initialFormValue: any = {};

  roleOptions: SelectOption[] = [
    { value: 'user', label: 'Usuário' },
    { value: 'admin', label: 'Administrador' },
  ];

  public dataLoaded: boolean = false;
  //public isLoading = false;

  ngOnInit() {
    this.initializeForm();
    this.loadUser();
  }

  loadUser() {
    if (this.userId) {
      this.store.dispatch(loadUserById({ id: this.userId }));
    }

    // ✅ SUBSTITUI o loadUser() - Observa o user$ do NgRx
    this.user$
      .pipe(
        filter((user) => user !== null),
        take(1)
      )
      .subscribe({
        next: (user) => {
          this.fillFormWithUserData(user!);
        },
        error: (err) => {
          const mappedError = verifyErrors(err);
          this.toastService.showToast(
            mappedError.messageToUser,
            5000,
            'alert-circle-outline'
          );
        },
      });

    // Observa mudanças no form para habilitar/desabilitar salvar
    this.userForm.valueChanges.subscribe(() => {
      this.canSaveVar = this.userForm.valid && this.userForm.dirty;
    });
  }

  // MÉTODO PARA PREENCHER O FORM (substitui o tap do seu código)
  private fillFormWithUserData(user: UserData) {
    // 1. Preenche o formulário com os valores
    this.userForm.setValue({
      name: user.name || '',
      email: user.email || '',
      roleUser: user.roleUser || '',
    });

    this.initialFormValue = this.userForm.value;

    // 2. Marca como 'pristine' após carregar os dados
    this.userForm.markAsPristine();
  }

  ionViewWillLeave() {
    // Limpa o user selecionado ao fechar o modal
    this.store.dispatch(clearSelectedUser());
  }

  //1. Inicializa o formulário com os validadores
  private initializeForm(): void {
    const validRoles = this.roleOptions.map((r) => r.value);

    this.userForm = this.fb.group({
      name: ['', [Validators.minLength(3)]],
      email: ['', [Validators.email]], // Email e formato de email obrigatórios
      roleUser: ['', [this.userService.roleValidator(validRoles)]],
    });
  }

  handleRoleChange(newRole: string) {
    //passa o valor do novo role selecionado
    const control = this.userForm.get('roleUser');
    control?.setValue(newRole);
    control?.markAsDirty(); // garante que o form fique dirty
  }

  // async saveChanges() {
  //   //altera os dados dos campos apenas que foram alterados
  //   const currentValues = this.userForm.value;
  //   const initialData = this.initialFormValue;
  //   const updateData: Partial<typeof currentValues> = {};

  //   for (const key of Object.keys(currentValues)) {
  //     // verifica o dado que mudou e retorna apenas ele update patch
  //     if (currentValues[key] !== initialData[key]) {
  //       updateData[key] = currentValues[key];
  //     }
  //   }

  //   try {
  //     this.isLoading = true;

  //     this.userService.updateUser(this.userId, updateData).subscribe({
  //       next: (res) => {
  //         this.initialFormValue = { ...this.initialFormValue, ...updateData };
  //         this.userForm.markAsPristine();
  //         this.closeModal(true);

  //         this.toastService.showToast(
  //           'Dados atualizados com sucesso!',
  //           3000,
  //           'checkmark-circle-outline'
  //         );
  //       },
  //       error: (err) => {
  //         const mappedError = verifyErrors(err);
  //         this.toastService.showToast(
  //           mappedError.messageToUser,
  //           5000,
  //           'alert-circle-outline'
  //         );
  //       },
  //       complete: () => (this.isLoading = false),
  //     });
  //   } catch (err) {
  //     this.isLoading = false;
  //     const mappedError = verifyErrors(err as any);
  //     this.toastService.showToast(
  //       mappedError.messageToUser,
  //       5000,
  //       'alert-circle-outline'
  //     );
  //   }
  // }

  async saveChanges() {
    // Mantém a mesma lógica de detectar mudanças
    const currentValues = this.userForm.value;
    const initialData = this.initialFormValue;
    const updateData: Partial<typeof currentValues> = {};

    for (const key of Object.keys(currentValues)) {
      if (currentValues[key] !== initialData[key]) {
        updateData[key] = currentValues[key];
      }
    }

    // Verifica se há dados para atualizar
    if (Object.keys(updateData).length === 0) {
      this.toastService.showToast(
        'Nenhuma alteração foi feita.',
        3000,
        'information-circle-outline'
      );
      return;
    }

    try {
      // SUBSTITUI: this.userService.updateUser()
      // POR: NgRx Action
      this.store.dispatch(
        updateUser({
          id: this.userId,
          data: updateData,
        })
      );

      //Observa o resultado da operação UPDATE
      const subscription = this.store
        .select(selectUpdateUserLoading)
        .pipe(
          filter((loading) => !loading), // Espera loading terminar
          take(1),
          timeout(10000)
        )
        .subscribe({
          next: () => {
            subscription.unsubscribe();
            // Verifica se houve erro no UPDATE
            this.store
              .select(selectUpdateUserError)
              .pipe(take(1))
              .subscribe((err) => {
                if (err) {
                  const mapped = verifyErrors({
                    message: err,
                  } as HttpErrorResponse);
                  this.toastService.showToast(
                    mapped.messageToUser,
                    3000,
                    'alert-circle-outline'
                  );
                } else {
                  // SUCESSO
                  this.toastService.showToast(
                    'Dados atualizados com sucesso!',
                    3000,
                    'checkmark-circle-outline'
                  );

                  // Atualiza o initialFormValue com as mudanças
                  this.initialFormValue = {
                    ...this.initialFormValue,
                    ...updateData,
                  };
                  this.userForm.markAsPristine();

                  // Fecha o modal - o toast de sucesso é mostrado pelo Effect
                  this.closeModal(true);
                }
              });
          },
          error: () => {
            subscription.unsubscribe();
            this.toastService.showToast(
              'Timeout na operação',
              5000,
              'alert-circle-outline'
            );
          },
        });
    } catch (err) {
      // Tratamento de erro local (se houver)
      const mappedError = verifyErrors(err as any);
      this.toastService.showToast(
        mappedError.messageToUser,
        5000,
        'alert-circle-outline'
      );
    }
  }

  getFieldError(field: string): string | null {
    //pega os erros do formulario para enviar para o note
    const control = this.userForm.get(field);
    if (!control || !control.touched || !control.errors) return null;

    if (control.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    if (control.hasError('email')) {
      return 'E-mail inválido';
    }
    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `Mínimo de ${requiredLength} caracteres`;
    }

    return null;
  }

  closeModal(updated: boolean = false) {
    this.modalController.dismiss({ updated });
  }
}
