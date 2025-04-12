import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the token from the auth service
    const token = this.authService.getToken();
    
    // Clone the request and add the authorization header if token exists
    if (token) {
      const authReq = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      
      // Return the authenticated request
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          // Handle 401 Unauthorized errors
          if (error.status === 401) {
            // Token is invalid or expired
            this.authService.logout();
            this.router.navigate(['/sign-in']);
          }
          
          return throwError(() => error);
        })
      );
    }
    
    // If there's no token, just pass the request through
    return next.handle(request);
  }
}