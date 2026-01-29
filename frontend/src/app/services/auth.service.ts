import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { Token } from '../models/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:3100/api';
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  createOrUpdate(credentials: any) {
    return this.http.post(this.url + '/user/create', credentials);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  get currentUser() {
    const token = this.getToken();
    if (!token) return null;
    try {
      return this.jwtHelper.decodeToken(token);
    } catch (err) {
      return null;
    }
  }

  authenticate(credentials: any) {
    return this.http.post<Token>(this.url + '/user/auth', {
      login: credentials.login,
      password: credentials.password
    }).pipe(
      map((result: any) => {
        if (result && result.token && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', result.token);
          return true;
        }
        return false;
      })
    );
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch {
      return false;
    }
  }

  logout() {
    const user = this.currentUser;
    const userId = user?._id || user?.id || user?.userId;

    return this.http.delete(`${this.url}/user/logout/${userId}`).pipe(
      map(() => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('token');
        }
      })
    );
  }
}