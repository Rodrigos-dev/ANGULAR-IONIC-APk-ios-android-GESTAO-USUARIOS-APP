import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  getMessage(): string {
    return 'Hello Jest!';
  }

  add(a: number, b: number): number {
    return a + b;
  }
}
