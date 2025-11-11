import { Injectable, signal } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { UsersService } from '../services/user/user.service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersStoreService {
  constructor(private readonly userService: UsersService) {}

  // Lista de usuários como signal
  _users = signal<User[]>([]);
  users = this._users.asReadonly(); // signal somente leitura para fora

  // Total de usuários
  _total = signal(0);
  total = this._total.asReadonly();

  // Página atual
  _page = signal(1);

  // Carrega usuários do backend
  loadUsers(reset: boolean = false, event?: any) {
    const pageToLoad = reset ? 1 : this._page();
    this.userService.getUsers(pageToLoad).subscribe((res) => {
      this._total.set(res.total);

      if (reset) {
        this._users.set(res.users);
        this._page.set(2);
      } else {
        const ids = new Set(this._users().map((u) => u.id));
        this._users.update((curr) => [
          ...curr,
          ...res.users.filter((u) => !ids.has(u.id)),
        ]);
        this._page.update((p) => p + 1);
      }

      // para o spinner diretamente aqui
      event?.target.complete();
      if (reset && event) event.target.disabled = false;
    });
  }

  // Deletar usuário
  deleteUser(userId: number) {
    return this.userService.deleteUser(userId).pipe(
      tap(() => {
        this._users.update((curr) => curr.filter((u) => u.id !== userId));
        this._total.update((t) => t - 1);
      })
    );
  }

  // Resetar lista
  reset() {
    this._users.set([]);
    this._page.set(1);
  }
}
