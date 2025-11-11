import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service'; // seu wrapper para HttpClient
import { StorageService } from '../storage/storage.service';
import { environment } from 'src/environments/environment';
import { User, UserResponse } from '../../models/user.model';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly baseUrl = `${environment.urlBase}/user`;

  constructor(
    private readonly httpService: HttpService,
    private readonly storage: StorageService
  ) {}

  getUsers(page = 1, limit = 10): Observable<UserResponse> {
    console.log('aaaa - user.service.ts:21');
    const url = `${this.baseUrl}?page=${page}&limit=${limit}`;
    return this.httpService.get<UserResponse>(url);
  }

  getUserById(id: number): Observable<User> {
    const url = `${this.baseUrl}/${id}`;
    return this.httpService.get<User>(url);
  }

  createUser(data: Partial<User>): Observable<User> {
    return this.httpService.post<User>(this.baseUrl, data);
  }

  updateUser(id: number, data: Partial<User>): Observable<User> {
    const url = `${this.baseUrl}/${id}`;
    return this.httpService.patch<User>(url, data);
  }

  deleteUser(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.httpService.delete<void>(url);
  }

  roleValidator(validRoles: string[]) {
    //valida as opcoes do role
    return (control: AbstractControl) => {
      if (!validRoles.includes(control.value)) {
        return { invalidRole: true };
      }
      return null;
    };
  }
}
