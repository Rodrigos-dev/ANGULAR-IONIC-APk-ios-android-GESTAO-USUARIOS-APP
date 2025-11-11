import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, scan } from 'rxjs/operators';
import { UsersService } from '../services/user/user.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private readonly usersSubject = new BehaviorSubject<User[]>([]);
  private readonly totalSubject = new BehaviorSubject<number>(0);
  private page = 1;

  /** Observables públicos e reativos */
  public readonly users$: Observable<User[]> = this.usersSubject.asObservable();
  public readonly total$: Observable<number> = this.totalSubject.asObservable();

  constructor(private readonly userService: UsersService) {}

  /** Carrega usuários com paginação e reset opcional */
  loadUsers(reset: boolean = false): void {
    // Se for reset, limpamos e voltamos à página 1
    if (reset) {
      this.page = 1;
      this.usersSubject.next([]);
    }

    // Impede chamadas concorrentes
    const currentPage = this.page;

    this.userService
      .getUsers(currentPage)
      .pipe(
        tap((res) => {
          // Atualiza total
          this.totalSubject.next(res.total);

          // Mescla os usuários sem duplicar
          const current = reset ? [] : this.usersSubject.value;
          const ids = new Set(current.map((u) => u.id));
          const newUsers = res.users.filter((u) => !ids.has(u.id));
          const merged = [...current, ...newUsers];

          // Atualiza lista e página
          this.usersSubject.next(merged);
          this.page = currentPage + 1;
        })
      )
      .subscribe({
        error: (err) =>
          console.error(
            'Erro ao carregar usuários: - user-state.service.ts:51',
            err
          ),
      });
  }

  /** Atualiza um usuário dentro da lista */
  updateUserInList(updatedUser: User): void {
    const updatedList = this.usersSubject.value.map((u) =>
      u.id === updatedUser.id ? { ...u, ...updatedUser } : u
    );
    this.usersSubject.next(updatedList);
  }

  /** Remove um usuário da lista */
  removeUserFromList(userId: number): void {
    const updatedList = this.usersSubject.value.filter((u) => u.id !== userId);
    this.usersSubject.next(updatedList);
    this.totalSubject.next(this.totalSubject.value - 1);
  }

  /** Adiciona um novo usuário */
  addUserToList(newUser: User): void {
    const updatedList = [newUser, ...this.usersSubject.value];
    this.usersSubject.next(updatedList);
    this.totalSubject.next(this.totalSubject.value + 1);
  }

  /** Limpa o estado (opcional) */
  clearStore(): void {
    this.usersSubject.next([]);
    this.totalSubject.next(0);
    this.page = 1;
  }
}
