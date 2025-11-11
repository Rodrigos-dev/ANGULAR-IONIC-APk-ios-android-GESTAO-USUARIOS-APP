import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, NavController, ModalController } from '@ionic/angular';
import { ButtonComponent } from 'src/app/components/elements/button/button.component';
import { InputComponent } from 'src/app/components/elements/input/input.component';
import { catchError, EMPTY, finalize, firstValueFrom } from 'rxjs';
import { AppRoutes } from 'src/app/shareds/consts/rotas';
import { verifyErrors } from 'src/app/shareds/utils/error-http-mapped';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageKeys } from 'src/app/shareds/consts/storage-keys';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ToastService } from 'src/app/core/services/nativos/toast.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { Login } from 'src/app/core/models/auth.model';
import { HttpMappedError } from 'src/app/core/models/error-http-mapped.model';
import { UserRegisterPage } from '../../user/user-register/user-register.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
  ],
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly navCtrl = inject(NavController);

  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly storage = inject(StorageService);
  private readonly modalController = inject(ModalController);

  inputForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });
  loading: boolean = false;

  async login() {
    const body: Login = {
      email: this.inputForm.value.email,
      password: this.inputForm.value.senha,
    };

    this.loading = true;

    const user = await firstValueFrom(
      this.authService.login(body).pipe(
        catchError((error: HttpErrorResponse) => {
          const erroMapeado: HttpMappedError = verifyErrors(error);
          this.toastService.showToast(erroMapeado.messageToUser);
          return EMPTY;
        }),
        finalize(() => {
          this.loading = false;
        })
      )
    );

    if (user?.access_token) {
      this.storage.setSecureStorage(StorageKeys.USER, user);
      this.navCtrl.navigateRoot(AppRoutes.USER);
    }
  }

  async registerUser() {
    const modal = await this.modalController.create({
      component: UserRegisterPage,
    });

    // modal.onDidDismiss().then((result) => {

    // });

    await modal.present();
  }
}
