import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

export interface JwtPayload {

  iss?: string; 
  aud?: string; 
  exp?: number; 
  
  
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string; 
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string; 
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string; 
  firstName?: string;
  lastName?: string;
  

  sub?: string;
  id?: string;
  userId?: string;
  nameid?: string;
  email?: string;
  role?: string | string[];
  isOrganisationOwner?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor(private cookieService: CookieService) { }


  decodeToken(): JwtPayload | null {
    try {
      const token = this.cookieService.get('jwt');
      
      if (!token || token.trim() === '') {
        console.log('No valid token found in cookies');
        return null;
      }
      

      if (token === 'undefined' || token === 'null') {
        console.log('Token is "undefined" or "null" string, not valid');
        return null;
      }
      
      
      if (!token.includes('.') || token.split('.').length !== 3) {
        console.log('Token format invalid - not a standard JWT (should have 3 parts separated by dots)');
        
        
        if (token.startsWith('{') && token.endsWith('}')) {
          try {
            const parsedToken = JSON.parse(token);
            console.log('Token parsed as JSON');
            return parsedToken;
          } catch (jsonError) {
            console.error('Failed to parse token as JSON:', jsonError);
          }
        } else {
          console.log('Token is not in JSON format');
        }
        
        return null;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log('Token decoded successfully');
        return decoded;
      } catch (decodeError) {
        console.error('JWT decode error:', decodeError);
        return null;
      }
    } catch (error) {
      console.error('Error accessing or processing token:', error);
      return null;
    }
  }


  getUserId(): string | null {
    try {
      const decodedToken = this.decodeToken();
      if (!decodedToken) {
        return null;
      }
      
      
      const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || 
                     decodedToken.sub || 
                     decodedToken.id || 
                     decodedToken.userId || 
                     decodedToken.nameid ||
                     null;
      
      return userId;
    } catch (error) {
      console.error('Error getting user ID from token:', error);
      return null;
    }
  }
  

  getUserRole(): string | null {
    try {
      const decodedToken = this.decodeToken();
      if (!decodedToken) {
        return null;
      }
      

      const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
                   (Array.isArray(decodedToken.role) ? decodedToken.role[0] : decodedToken.role) ||
                   null;
      
      return role;
    } catch (error) {
      console.error('Error getting user role from token:', error);
      return null;
    }
  }
  

  isOrganizationOwner(): boolean {
    const role = this.getUserRole();
    return role === 'OrganisationOwner';
  }


  isCurrentUserProfile(profileId: string): boolean {
    try {
      const currentUserId = this.getUserId();
      return !!currentUserId && currentUserId === profileId;
    } catch (error) {
      console.error('Error checking if current user is profile owner:', error);
      return false;
    }
  }
  

  isTokenExpired(): boolean {
    const decodedToken = this.decodeToken();
    if (!decodedToken || !decodedToken.exp) return true;
    
    const expiryTime = decodedToken.exp * 1000; 
    const currentTime = Date.now();
    
    return currentTime > expiryTime;
  }
}