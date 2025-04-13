import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';

export interface LoginModel {
  Email: string;
  Password: string;
}

export interface UserTokenDataModel {
  Token?: string;
  token?: string;
}

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
  private baseUrl = `${environment.apiUrl}/api`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {

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

          this.storeToken(response, rememberMe);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(this.handleError)
      );
  }

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
          this.storeToken(response, true);
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
          this.storeToken(response, true);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.cookieService.delete('jwt', '/');
    
    localStorage.removeItem('debug_token');
    
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/sign-in']);
  }


  private storeToken(tokenData: UserTokenDataModel, rememberMe: boolean): void {

    const token = tokenData.Token || tokenData.token;

    console.log('Token data received:', { 
      hasToken: !!token, 
      tokenLength: token ? token.length : 0 
    });

    if (!token) {
      console.error('Attempted to store invalid token data:', tokenData);
      return;
    }

    const expiresInDays = rememberMe ? 7 : undefined; // 7 days if remember me is checked, otherwise session cookie
    const cookieOptions = {
      expires: expiresInDays ? new Date(new Date().getTime() + expiresInDays * 24 * 60 * 60 * 1000) : undefined,
      path: '/',
      secure: window.location.protocol === 'https:',  // Only over HTTPS in production
      sameSite: 'Lax' as const  // Using Lax for better compatibility
    };
    
    // Store the token string
    this.cookieService.set('jwt', token, cookieOptions);
    
    // For debugging - also store in localStorage
    localStorage.setItem('debug_token', token);
    
    console.log('Token stored in cookie', rememberMe ? 'for 7 days' : 'for this session');
  }

  // Get the stored JWT token
  getToken(): string {
    const token = this.cookieService.get('jwt');
    
    // If token not in cookie, try localStorage
    if (!token || token === 'undefined' || token === 'null') {
      const localToken = localStorage.getItem('debug_token');
      if (localToken) {
        console.log('Token found in localStorage but not in cookie');
        return localToken;
      }
    }
    
    return token;
  }

  hasValidToken(): boolean {
    const token = this.getToken();
    return !!token && token !== 'undefined' && token !== 'null';
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Invalid credentials';
      } else if (error.status === 400 && error.error) {
        errorMessage = error.error;
      } else if (error.status === 500) {
        errorMessage = 'Server error, please try again later';
      }
    }
    
    console.error('Auth service error:', error);
    return throwError(() => errorMessage);
  }
}