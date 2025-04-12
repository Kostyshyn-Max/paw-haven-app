import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  
  const token = authService.getToken();
  
  
  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    
    
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        
        if (error.status === 401) {
          
          authService.logout();
          router.navigate(['/sign-in']);
        }
        
        return throwError(() => error);
      })
    );
  }
  
  
  return next(req);
};
