import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  Observable,
  tap,
  catchError,
  throwError,
  BehaviorSubject,
  filter,
  take,
  switchMap,
} from 'rxjs';
import { LoginRequest, LoginResponse, UserInfo, TokenPayload } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = '/api/auth';
  private readonly ACCESS_TOKEN_KEY = 'ems_access_token';
  private readonly REFRESH_TOKEN_KEY = 'ems_refresh_token';

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  private _isAuthenticated = signal(this.hasValidToken());
  private _currentUser = signal<UserInfo | null>(this.extractUserFromToken());

  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  readonly displayName = computed(() => this._currentUser()?.displayName ?? 'User');

  // ─── Login / Logout ────────────────────────────────────

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        this.storeTokens(response.accessToken, response.refreshToken);
        this._isAuthenticated.set(true);
        this._currentUser.set(this.extractUserFromToken());
      }),
      catchError((error) => {
        this._isAuthenticated.set(false);
        return throwError(() => error);
      }),
    );
  }

  logout(): void {
    this.clearTokens();
    this._isAuthenticated.set(false);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  // ─── Token Management ──────────────────────────────────

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  refreshAccessToken(): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/refresh`, {
        refreshToken: this.getRefreshToken(),
      })
      .pipe(
        tap((response) => {
          this.storeTokens(response.accessToken, response.refreshToken);
          this._isAuthenticated.set(true);
          this._currentUser.set(this.extractUserFromToken());
        }),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        }),
      );
  }

  handleTokenRefresh(): Observable<string> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.refreshAccessToken().pipe(
        switchMap((response) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.accessToken);
          return [response.accessToken];
        }),
        catchError((error) => {
          this.isRefreshing = false;
          return throwError(() => error);
        }),
      );
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => [token!]),
    );
  }

  // ─── Token Utilities ───────────────────────────────────

  isTokenExpired(token?: string | null): boolean {
    const t = token ?? this.getAccessToken();
    if (!t) return true;

    try {
      const payload = this.decodeToken(t);
      return payload.exp * 1000 < Date.now() + 30_000;
    } catch {
      return true;
    }
  }

  private hasValidToken(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  private decodeToken(token: string): TokenPayload {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  }

  private extractUserFromToken(): UserInfo | null {
    const token = this.getAccessToken();
    if (!token || this.isTokenExpired(token)) return null;

    try {
      const payload = this.decodeToken(token);
      return {
        username: payload.username,
        displayName: payload.username,
        roles: payload.roles ?? [],
      };
    } catch {
      return null;
    }
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}
