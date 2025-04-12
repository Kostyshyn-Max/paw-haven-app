import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { LoginModel, UserTokenDataModel } from '../models/auth.models';
import { Router } from '@angular/router';

// Add missing interfaces for registration
export interface UserCreateData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isOrganisationOwner: boolean;
}

export interface OrganisationCreateData {
  user: UserCreateData;
  name: string;
  description: string;
  organisationCategoryId: number;
  phoneNumber?: string;
  location?: string;
  donationCredentials?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/api';
  
  // Authentication state observable
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {
    // Check token status after the service is fully initialized
    setTimeout(() => {
      this.isAuthenticatedSubject.next(this.hasValidToken());
    }, 0);
  }

  login(email: string, password: string, rememberMe: boolean): Observable<UserTokenDataModel> {
    const loginData: LoginModel = {
      Email: email,
      Password: password
    };

    return this.http.post<UserTokenDataModel>(`${this.baseUrl}/user/login`, loginData)
      .pipe(
        tap(response => {
          this.storeTokens(response, rememberMe);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(this.handleError)
      );
  }

  // Add registration methods
  registerUser(userData: UserCreateData): Observable<UserTokenDataModel> {
    const registerData = {
      FirstName: userData.firstName,
      LastName: userData.lastName,
      Email: userData.email,
      Password: userData.password,
      IsOrganisationOwner: userData.isOrganisationOwner
    };

    return this.http.post<UserTokenDataModel>(`${this.baseUrl}/user/register/user`, registerData)
      .pipe(
        tap(response => {
          this.storeTokens(response, true);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(this.handleError)
      );
  }

  registerOrganisation(orgData: OrganisationCreateData): Observable<UserTokenDataModel> {
    const registerData = {
      User: {
        FirstName: orgData.user.firstName,
        LastName: orgData.user.lastName,
        Email: orgData.user.email,
        Password: orgData.user.password,
        IsOrganisationOwner: orgData.user.isOrganisationOwner
      },
      Name: orgData.name,
      Description: orgData.description,
      OrganisationCategoryId: orgData.organisationCategoryId,
      PhoneNumber: orgData.phoneNumber || null,
      Location: orgData.location || null,
      DonationCredentials: orgData.donationCredentials || null
    };

    return this.http.post<UserTokenDataModel>(`${this.baseUrl}/user/register/organisation`, registerData)
      .pipe(
        tap(response => {
          this.storeTokens(response, true);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    try {
      this.cookieService.delete('token', '/');
      this.cookieService.delete('refreshToken', '/');
      this.isAuthenticatedSubject.next(false);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Store tokens in cookies
  private storeTokens(tokenData: UserTokenDataModel, rememberMe: boolean): void {
    try {
      const expiresIn = rememberMe ? 30 : 1; // 30 days if remember me, 1 day if not
      this.cookieService.set('token', tokenData.Token, expiresIn);
      this.cookieService.set('refreshToken', tokenData.RefreshToken, expiresIn);
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  }

  // Get token for HTTP interceptor
  getToken(): string {
    try {
      return this.cookieService.get('token') || '';
    } catch (error) {
      console.error('Error getting token:', error);
      return '';
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  // Check if valid token exists
  private hasValidToken(): boolean {
    try {
      return !!this.cookieService.get('token');
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error || `Server error: ${error.status}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}