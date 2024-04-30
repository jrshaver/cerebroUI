import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  Observable,
  catchError,
  of,
  tap,
  throwError
} from 'rxjs';
import {
  TokenService
} from './token.service';
import {
  constants
} from '../../config/constants';
import CryptoJS from 'crypto-js';
import {
  ToastService
} from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isUserLoggedIn: boolean = false;
  userUrl = constants.API_ENDPOINT + '/users';

  HTTP_HEADERS = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + constants.BEARER_TOKEN
  });

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    public toastService: ToastService) {}

  private static handleError(error: HttpErrorResponse): any {
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private static log(message: string): any {
    console.log(message);
  }

  login(loginData: any): Observable < any > {
    this.tokenService.removeToken();

    loginData.passwordHash = CryptoJS.SHA256(loginData.passwordHash).toString();

    return this.http.post < any > (this.userUrl + '/login', loginData, {
      headers: this.HTTP_HEADERS
    }).pipe(tap(response => {
        this.showLoggedInMessage();
        this.isUserLoggedIn = true;
        this.tokenService.saveToken(response._id);
        return of(this.isUserLoggedIn)
      }),
      catchError(AuthService.handleError)
    );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.isUserLoggedIn = false;
    this.toastService.show('You\'re signed out!', {
      title: 'Goodbye',
      classname: 'bg-success text-light'
    });
  }

  register(registerObject: any) {
    let userUrl = this.userUrl;
    let userData = JSON.parse(JSON.stringify(registerObject))
    userData.passwordHash = userData.passwordHash ? CryptoJS.SHA256(userData.passwordHash).toString() : '';
    return this.http.post < any > (userUrl, userData, {
      headers: this.HTTP_HEADERS
    }).pipe(tap((response) => {
        this.showLoggedInMessage();
        this.isUserLoggedIn = true;
        this.tokenService.saveToken(response._id);
        AuthService.log('register');
      }),
      catchError(AuthService.handleError)
    );
  }

  showLoggedInMessage(): void {
    this.toastService.show('You\'re signed in!', {
      title: 'Welcome',
      classname: 'bg-success text-light'
    });
  }

  updateUser(updateObject: any) {
    let userData = JSON.parse(JSON.stringify(updateObject));
    return this.http.put(this.userUrl, userData, {
      headers: this.HTTP_HEADERS
    }).pipe(
      tap(_ => AuthService.log('update')),
      catchError(AuthService.handleError)
    );
  }

  getUser(userId: string): Observable < any > {
    return this.http.get(this.userUrl, {
      headers: this.HTTP_HEADERS,
      params: { id: userId }
    }).pipe(
      tap(_ => AuthService.log('get')),
      catchError(AuthService.handleError)
    );
  }

}
