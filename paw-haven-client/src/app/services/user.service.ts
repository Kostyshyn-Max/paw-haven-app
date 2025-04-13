import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { JwtService } from './jwt.service';
import { environment } from '../../environments/environment';

export interface OrganisationModel {
  id: number;
  name: string;
  description: string;
  location: string;
  phoneNumber: string;
  donationCredentials: string;
}

export interface UserProfileModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isOrganisationOwner: boolean;
  profileImageUrl?: string;
  organisation?: OrganisationModel;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/api`;
  
  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  getUserProfile(userId: string): Observable<UserProfileModel> {
    console.log(`Fetching user profile with ID: ${userId}`);
    
    return this.http.get<UserProfileModel>(`${this.baseUrl}/user/profile/${userId}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching profile for user ID ${userId}:`, error);
          return throwError(() => error);
        })
      );
  }

  getCurrentUserProfile(): Observable<UserProfileModel> {
    const userId = this.jwtService.getUserId();
    
    if (!userId) {
      console.error('Cannot get current user profile: No user ID available from JWT');
      return throwError(() => new Error('User ID not available. Please log in again.'));
    }
    
    console.log('Fetching profile with user ID from JWT:', userId);
    return this.getUserProfile(userId);
  }
  
  updateUserProfile(userId: string, profileData: Partial<UserProfileModel>): Observable<UserProfileModel> {
    console.log(`Updating user profile with ID: ${userId}`);
    
    return this.http.put<UserProfileModel>(`${this.baseUrl}/user/update`, profileData)
      .pipe(
        catchError(error => {
          console.error(`Error updating profile for user ID ${userId}:`, error);
          return throwError(() => error);
        })
      );
  }
}