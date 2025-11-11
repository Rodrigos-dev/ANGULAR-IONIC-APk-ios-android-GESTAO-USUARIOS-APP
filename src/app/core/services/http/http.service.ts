import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly http = inject(HttpClient);

  post<T>(url: string, body: any): Observable<T> {
    return this.http
      .post<T>(url, body)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  get<T>(url: string): Observable<T> {
    return this.http
      .get<T>(url)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http
      .put<T>(url, body)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  patch<T>(url: string, body: any): Observable<T> {
    return this.http
      .patch<T>(url, body)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  delete<T>(url: string): Observable<T> {
    return this.http
      .delete<T>(url)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }
}
