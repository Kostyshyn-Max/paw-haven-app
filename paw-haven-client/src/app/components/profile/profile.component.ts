import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService, UserProfileModel } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { JwtService } from '../../services/jwt.service';
import { PetCardService } from '../../services/pet-card.service';
import { switchMap, of, catchError } from 'rxjs';
import { PetCard } from '../../models/pet-card.model';
import { CardComponent } from '../shared/card/card.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfileModel | null = null;
  loading: boolean = true;
  error: string | null = null;
  isCurrentUser: boolean = false;
  
  // Pet Cards related properties
  userPetCards: PetCard[] = [];
  loadingPetCards: boolean = false;
  petCardError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService,
    private petCardService: PetCardService
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
          // After profile loaded successfully, load user's pet cards
          this.loadUserPetCards();
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

  loadUserPetCards(): void {
    if (!this.userProfile) return;
    
    this.loadingPetCards = true;
    this.petCardError = null;
    
    console.log('Loading pet cards for user ID:', this.userProfile.id);
    
    // Use a search endpoint to get pet cards by owner ID
    this.petCardService.getAllPetCards().subscribe({
      next: (petCards) => {
        console.log('All pet cards loaded:', petCards);
        
        // Filter pet cards by owner ID - using string comparison to be safe
        this.userPetCards = petCards.filter(card => {
          const cardOwnerId = card.ownerId ? card.ownerId.toString() : null;
          const profileId = this.userProfile?.id ? this.userProfile.id.toString() : null;
          
          const isMatch = cardOwnerId === profileId;
          console.log(`Comparing card owner: ${cardOwnerId} with profile: ${profileId}, match: ${isMatch}`);
          
          return isMatch;
        });
        
        console.log('Filtered user pet cards:', this.userPetCards);
        this.loadingPetCards = false;
      },
      error: (err) => {
        console.error('Error loading user pet cards:', err);
        this.petCardError = 'Помилка при завантаженні оголошень користувача.';
        this.loadingPetCards = false;
      }
    });
  }

  navigateToEditProfile(): void {
    if (this.userProfile) {
      this.router.navigate(['/profile/edit', this.userProfile.id]);
    }
  }
  
  navigateToCreatePetCard(): void {
    this.router.navigate(['/pet/add']);
  }
}
