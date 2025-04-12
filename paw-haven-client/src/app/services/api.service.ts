import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { LoginModel, RegisterUserModel, UserTokenDataModel, RefreshTokenModel } from '../models/auth.models';
import { OrganisationCategory } from '../models/organisation.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api';
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  // Auth endpoints
  login(loginData: LoginModel): Observable<UserTokenDataModel> {
    return this.http.post<UserTokenDataModel>(`${this.baseUrl}/user/login`, loginData)
      .pipe(
        tap(response => this.storeTokens(response)),
        catchError(this.handleError)
      );
  }

  register(registerData: RegisterUserModel): Observable<UserTokenDataModel> {
    return this.http.post<UserTokenDataModel>(`${this.baseUrl}/user/register/user`, registerData)
      .pipe(
        tap(response => this.storeTokens(response)),
        catchError(this.handleError)
      );
  }

  refreshToken(): Observable<UserTokenDataModel> {
    const refreshData: RefreshTokenModel = {
      OldToken: this.cookieService.get('token'),
      RefreshToken: this.cookieService.get('refreshToken')
    };

    return this.http.post<UserTokenDataModel>(`${this.baseUrl}/user/refresh`, refreshData)
      .pipe(
        tap(response => this.storeTokens(response)),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.cookieService.delete('token');
    this.cookieService.delete('refreshToken');
  }

  // Organization categories
  getOrganisationCategories(): Observable<OrganisationCategory[]> {
    return this.http.get<OrganisationCategory[]>(`${this.baseUrl}/organisationcategory`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Helper methods
  private storeTokens(tokenData: UserTokenDataModel): void {
    // Store tokens in cookies (consider setting secure and HTTP only flags in production)
    this.cookieService.set('token', tokenData.Token, { expires: new Date(new Date().getTime() + 15 * 60 * 1000) }); // 15 minutes
    this.cookieService.set('refreshToken', tokenData.RefreshToken, { expires: 30 }); // 30 days is typical
    this.refreshTokenSubject.next(tokenData.Token);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  // Method to handle token refresh when a request fails with 401
  handleUnauthorizedError(request: any, next: any) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.refreshToken().pipe(
        switchMap((token: UserTokenDataModel) => {
          this.isRefreshing = false;
          return next.handle(this.addTokenHeader(request));
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.logout();
          return throwError(() => error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        switchMap(token => {
          if (token) {
            return next.handle(this.addTokenHeader(request));
          }
          return throwError(() => new Error('No token available'));
        })
      );
    }
  }

  private addTokenHeader(request: any) {
    const token = this.cookieService.get('token');
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Get token for HTTP interceptor
  getToken(): string {
    return this.cookieService.get('token');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.cookieService.get('token');
  }
}


