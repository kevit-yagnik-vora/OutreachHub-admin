import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import User from '../models/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface RefreshResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loggedIn = new BehaviorSubject<boolean>(
    !!this.tokenService.getAccessToken()
  );
  private currentUser = new BehaviorSubject<User | null>(
    this.tokenService.getUser()
  );

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        switchMap((response: LoginResponse) => {
          this.tokenService.saveTokens(
            response.access_token,
            response.refresh_token
          );
          const decoded: any = jwtDecode(response.access_token);
          const userId = decoded?.userId;
          return this.http.get<User>(`${this.apiUrl}/user/${userId}`);
        }),
        tap((user: User) => {
          if (user) {
            this.tokenService.saveUser(user);
            this.currentUser.next(user);
            this.loggedIn.next(true);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.tokenService.clearAll();
    this.loggedIn.next(false);
    this.currentUser.next(null);
    this.router.navigate(['/auth/login']);
  }

  refresh(): Observable<RefreshResponse> {
    const refresh_token = this.tokenService.getRefreshToken();
    if (!refresh_token) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }
    return this.http
      .post<RefreshResponse>(`${this.apiUrl}/auth/refresh`, { refresh_token })
      .pipe(
        switchMap((response) => {
          this.tokenService.saveTokens(response.access_token, refresh_token);

          const decoded: any = jwtDecode(response.access_token);
          const userId = decoded?.userId;
          return this.http.get<User>(`${this.apiUrl}/user/${userId}`).pipe(
            tap((user) => {
              this.tokenService.saveUser(user);
              this.currentUser.next(user);
              this.loggedIn.next(true);
            }),
            map(() => ({ access_token: response.access_token }))
          );
        })
      );
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const expiry = decoded.exp * 1000;
      return Date.now() > expiry;
    } catch (e) {
      return true;
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.status === 401) {
      errorMessage = 'Invalid credentials or session expired.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
