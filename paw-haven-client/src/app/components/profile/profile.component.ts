import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService, UserProfileModel } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { JwtService } from '../../services/jwt.service';
import { switchMap, of, catchError } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfileModel | null = null;
  loading: boolean = true;
  error: string | null = null;
  isCurrentUser: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const userId = params.get('id');

        if (userId) {
          // Check if the viewed profile is the current user's profile
          this.isCurrentUser = this.jwtService.isCurrentUserProfile(userId);
          return this.userService.getUserProfile(userId).pipe(
            catchError(err => {
              console.error('Error loading profile by ID:', err);

              if (err.status === 404) {
                this.error = 'User profile not found.';
              } else {
                this.error = 'Error loading profile. Please try again later.';
              }

              this.loading = false;
              return of(null);
            })
          );
        } else {
          // No ID in URL means we're viewing our own profile
          const currentUserId = this.jwtService.getUserId();

          if (!currentUserId) {
            this.isCurrentUser = false;
            this.loading = false;
            this.error = 'Unable to retrieve user information.';
            return of(null);
          }

          this.isCurrentUser = true;
          console.log('Loading current user profile with ID:', currentUserId);

          return this.userService.getUserProfile(currentUserId).pipe(
            catchError(err => {
              console.error('Error loading current user profile:', err);

              this.error = 'Error loading your profile. Please try again later.';
              this.loading = false;
              return of(null);
            })
          );
        }
      })
    ).subscribe({
      next: (profile) => {
        if (profile) {
          this.userProfile = profile;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Unhandled error in profile component:', err);
        this.error = 'An unexpected error occurred. Please try again later.';
        this.loading = false;
      }
    });
  }

  navigateToEditProfile(): void {
    if (this.userProfile) {
      this.router.navigate(['/profile/edit', this.userProfile.id]);
    }
  }
}
