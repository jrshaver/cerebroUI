import { EventEmitter, Injectable, Output } from '@angular/core';

const ACCESS_TOKEN = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  @Output() tokenEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  getToken(): string {
    return localStorage.getItem(ACCESS_TOKEN)!;
  }

  saveToken(token: any): void {
    localStorage.setItem(ACCESS_TOKEN, token);
    this.tokenEvent.emit(token);
  }

  removeToken(): void {
    localStorage.removeItem(ACCESS_TOKEN);
  }

}
