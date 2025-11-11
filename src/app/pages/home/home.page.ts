import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '../../components/elements/button/button.component';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { catchError, EMPTY, finalize, firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpMappedError } from 'src/app/core/models/error-http-mapped.model';
import { verifyErrors } from 'src/app/shareds/utils/error-http-mapped';
import { ToastService } from 'src/app/core/services/nativos/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, ButtonComponent],
})
export class HomePage implements OnInit {
  public testButtonTitle = 'Tirar Foto (Teste)';
  public testButtonTitle2 = 'Tirar Foto (Teste2)';
  public testButtonIcon = 'camera-outline'; // Exemplo de ícone Ionicons
  constructor() {}
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    //this.loading = true;

    try {
      const user = await firstValueFrom(
        this.authService.getUsers().pipe(
          catchError((error: HttpErrorResponse) => {
            const erroMapeado: HttpMappedError = verifyErrors(error);
            this.toastService.showToast(erroMapeado.messageToUser);
            return EMPTY;
          }),
          finalize(() => {
            //this.loading = false;
          })
        )
      );

      console.log('Usuários carregados: - home.page.ts:46', user);
    } catch (err) {
      console.error('Erro ao buscar usuários: - home.page.ts:48', err);
    } finally {
      //this.loading = false;
    }
  }

  async handleButtonClick(event: any) {
    console.log('Botão Clicado (Teste) - home.page.ts:55');
    console.log('Mensagem de sucesso: O botão customizado está funcionando!');
    console.log('Evento recebido (payload): - home.page.ts:59', event);

    await this.loadUsers();

    // Você pode substituir a chamada original aqui, se quiser:
    // this.photo();
  }

  // Se a função 'photo()' for a original, ela pode ficar assim:
  public photo(): void {
    console.log('Função photo() original chamada! - home.page.ts:69');
    // Sua lógica original de tirar foto
  }
}
