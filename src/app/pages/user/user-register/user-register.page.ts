import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ButtonComponent } from 'src/app/components/elements/button/button.component';
import { InputComponent } from 'src/app/components/elements/input/input.component';
import { InputSelectComponent } from 'src/app/components/elements/input-select/input-select.component';
import { roleOptions } from 'src/app/shareds/consts/user';
import { UsersService } from 'src/app/core/services/user/user.service';
import { passwordMatchValidator } from 'src/app/shareds/utils/forms-validators';
import { documentValidator } from 'src/app/shareds/utils/documentValidation';
import { StorageKeys } from 'src/app/shareds/consts/storage-keys';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { UserAuth } from 'src/app/core/models/user.model';
import { verifyErrors } from 'src/app/shareds/utils/error-http-mapped';
import { ToastService } from 'src/app/core/services/nativos/toast.service';
import { Store } from '@ngrx/store';
import {
  selectCreateUserError,
  selectCreateUserLoading,
  selectUsersError,
  selectUsersLoading,
} from 'src/app/store/users/users.selectors';
import { filter, take, timeout } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { createUser } from 'src/app/store/users/users.actions';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.page.html',
  styleUrls: ['./user-register.page.scss'],
  standalone: true,
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
export class UserRegisterPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UsersService);
  private readonly storage = inject(StorageService);
  private readonly toastService = inject(ToastService);
  private readonly modalController = inject(ModalController);

  private readonly store = inject(Store); // NOVO
  // ✅ NOVOS OBSERVABLES
  loading$ = this.store.select(selectUsersLoading);
  error$ = this.store.select(selectUsersError);

  roleOptions = roleOptions;
  public userRegisterForm!: FormGroup;
  userLogedRole: 'user' | 'admin' = 'user';

  constructor() {}

  ngOnInit() {
    this.initializeForm();
    this.verifyTypeRoleUser();
  }

  async verifyTypeRoleUser() {
    //PEGA O USUARIO NO STORAGE
    const userStorage = await this.storage.getSecureStorage<UserAuth>(
      StorageKeys.USER
    );
    this.userLogedRole =
      userStorage?.user.roleUser === 'admin' ? 'admin' : 'user';
  }

  private initializeForm(): void {
    //INICIA O FORMULARIO E VALIDA OS FORMULARIOS
    const validRoles = this.roleOptions.map((r) => r.value);
    const passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>/\\]).*$/; // Padrão da DTO

    this.userRegisterForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required, // Adicionado (conforme DTO)
            Validators.minLength(3), // Já existente
          ],
        ],
        email: [
          '',
          [
            Validators.required, // Adicionado (conforme DTO)
            Validators.email, // Já existente
          ],
        ],
        roleUser: [
          'user',
          [
            Validators.required,
            this.userService.roleValidator(validRoles), // Validador existente
          ],
        ],
        document: [
          '',
          [
            Validators.required, // Conforme DTO
            documentValidator(), // Validador customizado de CPF/CNPJ
          ],
        ],
        password: [
          '',
          [
            Validators.required, // Conforme DTO
            Validators.minLength(6), // Conforme DTO e existente
            Validators.pattern(passwordPattern), // Conforme DTO
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required, // Conforme DTO e existente
          ],
        ],
      },
      {
        // Validador de grupo (cross-field) para verificar se 'senha' e 'confirmSenha' são iguais
        validators: passwordMatchValidator(),
      }
    );
  }

  handleRoleChange(newRole: string) {
    //FUNCAO PARA VERIFICAR OS DADOS DO ION-SELECT E PASSAR PARA O FORMULARIO
    const control = this.userRegisterForm.get('roleUser');
    control?.markAsDirty();
    control?.markAsTouched();
  }

  getErrorMessage(controlName: string): string | null {
    //FUNCAO QUE PEGA OS ERROS
    const control = this.userRegisterForm.get(controlName);

    // Validação cross-field (senha)
    if (
      controlName === 'confirmPassword' &&
      this.userRegisterForm.errors?.['passwordMismatch'] &&
      control?.touched // <-- ADICIONADO AQUI! Garante que o campo foi tocado.
    ) {
      return 'As senhas não coincidem.';
    }

    if (!control || !control.invalid || !control.touched) {
      return null;
    }

    const errors = control.errors;

    if (errors?.['required']) {
      return 'Este campo é obrigatório.';
    }
    if (errors?.['minlength']) {
      return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;
    }
    if (errors?.['email']) {
      return 'Por favor, insira um e-mail válido.';
    }
    if (errors?.['pattern']) {
      return 'A senha deve conter pelo menos um número e um caractere especial.';
    }
    if (errors?.['invalidDocument']) {
      return 'CPF/CNPJ inválido.';
    }
    // Adicione aqui a mensagem para o seu validador de role, se necessário.
    if (errors?.['invalidRole']) {
      return 'A função selecionada é inválida ou não permitida.';
    }

    return null;
  }

  // Propriedade para controlar o botão 'Salvar Alterações' (conforme solicitação)
  get canSave(): boolean {
    //FUNCAO QUE VALIDA O FORMULARIO
    return this.userRegisterForm.valid;
  }

  // register() {
  //   if (this.userRegisterForm.invalid) {
  //     this.userRegisterForm.markAllAsTouched();
  //     console.error(
  //       'Formulário inválido. Verifique os campos antes de enviar.'
  //     );
  //     return;
  //   }

  //   // Desestrutura o formulário, renomeando 'senha' para 'password' e 'confirmSenha' para 'confirmPassword'
  //   const userdata = this.userRegisterForm.value;

  //   // Chama o serviço para criar o usuário
  //   this.userService.createUser(userdata).subscribe({
  //     next: (user) => {
  //       // Sucesso: Aqui você pode exibir uma notificação e/ou navegar para outra página.
  //       this.closeModal(true);
  //       this.toastService.showToast(
  //         'Usúario criado com sucesso!',
  //         3000,
  //         'checkmark-circle-outline'
  //       );
  //       this.userRegisterForm.reset(); // Opcional: Limpa o formulário após o sucesso
  //     },
  //     error: (err) => {
  //       const mappedError = verifyErrors(err);
  //       this.toastService.showToast(
  //         mappedError.messageToUser,
  //         5000,
  //         'alert-circle-outline'
  //       );
  //     },
  //   });
  // }

  closeModal(updated: boolean = false) {
    this.modalController.dismiss({ updated });
  }

  register() {
    if (this.userRegisterForm.invalid) {
      this.userRegisterForm.markAllAsTouched();
      console.error(
        'Formulário inválido. Verifique os campos antes de enviar.'
      );
      return;
    }

    const userdata = this.userRegisterForm.value;

    // ✅ Dispatch da action
    this.store.dispatch(createUser({ userData: userdata }));

    // ✅ AGORA observa o estado ESPECÍFICO do create
    const subscription = this.store
      .select(selectCreateUserLoading)
      .pipe(
        filter((loading) => !loading), // Espera o loading do create terminar
        take(1),
        timeout(10000)
      )
      .subscribe({
        next: () => {
          subscription.unsubscribe();

          // ✅ Verifica se houve erro no CREATE
          this.store
            .select(selectCreateUserError)
            .pipe(take(1))
            .subscribe((error) => {
              if (error) {
                const mappedError = verifyErrors({
                  message: error,
                } as HttpErrorResponse);
                this.toastService.showToast(
                  mappedError.messageToUser,
                  5000,
                  'alert-circle-outline'
                );
              } else {
                // ✅ SUCESSO no create
                this.closeModal(true);
                this.toastService.showToast(
                  'Usuário criado com sucesso!',
                  3000,
                  'checkmark-circle-outline'
                );
                this.userRegisterForm.reset();
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
  }

  // ✅ NOVO: Configurar listeners do NgRx
  private setupNgRxListeners() {
    // Observa sucesso na criação
    this.store
      .select(selectUsersLoading)
      .pipe
      // Quando loading vai de true para false (operação terminou)
      ()
      .subscribe((loading) => {
        if (!loading) {
          // Verifica se foi sucesso (sem erro)
          this.store
            .select(selectUsersError)
            .pipe(take(1))
            .subscribe((error) => {
              if (!error) {
                // ✅ SUCESSO - Fecha modal e mostra toast
                this.closeModal(true);
                this.toastService.showToast(
                  'Usuário criado com sucesso!',
                  3000,
                  'checkmark-circle-outline'
                );
                this.userRegisterForm.reset();
              }
            });
        }
      });

    // Observa erros
    this.error$
      .pipe(
        filter((error) => error !== null)
        //takeUntilDestroyed() // Se estiver usando Angular 16+
      )
      .subscribe((error) => {
        const mappedError = verifyErrors({
          message: error,
        } as HttpErrorResponse);
        this.toastService.showToast(
          mappedError.messageToUser,
          5000,
          'alert-circle-outline'
        );
      });
  }
}
