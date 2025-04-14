import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { PetCard } from '../../models/pet-card.model';
import { AuthService } from '../../services/auth.service';
import { JwtService } from '../../services/jwt.service';
import { OrganisationService } from '../../services/organisation.service';
import { PetCardService } from '../../services/pet-card.service';
import { UserFavouritesService } from '../../services/user-favourites.service';
import { UserProfileModel, UserService } from '../../services/user.service';
import { CardComponent } from '../shared/card/card.component';
import { PawLoaderComponent } from '../shared/paw-loader/paw-loader.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, CardComponent, PawLoaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfileModel | null = null;
  loading: boolean = true;
  error: string | null = null;
  isCurrentUser: boolean = false;
  isOrganisationView: boolean = false;
  organisationId: string | null = null;

  // Pet Cards related properties
  userPetCards: PetCard[] = [];
  loadingPetCards: boolean = false;
  petCardError: string | null = null;

  // Favourite pet cards relaed properties
  userFavouritePetCards: PetCard[] = [];
  isLoadingFavouritePetCards: boolean = false;
  favouritePetCardsError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService,
    private petCardService: PetCardService,
    private userFavouritesService: UserFavouritesService,
    private organisationService: OrganisationService
  ) {}

  ngOnInit(): void {
    // Check if this is organization view or profile view
    this.isOrganisationView = this.router.url.includes('/organisations/');

    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id'); // This can be userId or organisationId

        if (!id) {
          this.error = 'Ідентифікатор не надано';
          this.loading = false;
          return of(null);
        }

        // If this is an organization view, we need to get the user profile of the organization owner
        if (this.isOrganisationView) {
          this.organisationId = id;
          return this.organisationService.getOrganisationById(id).pipe(
            switchMap(organisation => {
              if (!organisation || !organisation.ownerId) {
                this.error = 'Організація не знайдена або не має власника';
                this.loading = false;
                return of(null);
              }

              // Check if the current user is the owner of this organization
              const isLoggedIn = this.authService.isAuthenticated();
              const ownerId = organisation.ownerId;
              this.isCurrentUser = isLoggedIn && this.jwtService.isCurrentUserProfile(ownerId);

              // If current user is the owner, redirect to profile page
              if (this.isCurrentUser) {
                this.router.navigate(['/profile', ownerId]);
                return of(null);
              }

              // Now get the user profile of the organization owner
              return this.userService.getUserProfile(ownerId).pipe(
                catchError(err => {
                  console.error('Помилка при завантаженні профілю власника організації:', err);
                  this.error = 'Помилка при завантаженні профілю власника організації';
                  this.loading = false;
                  return of(null);
                })
              );
            }),
            catchError(err => {
              console.error('Помилка при завантаженні організації:', err);
              this.error = 'Помилка при завантаженні організації';
              this.loading = false;
              return of(null);
            })
          );
        }

        // If not organization view, proceed with normal profile view
        // Check if the viewed profile is the current user's profile
        const isLoggedIn = this.authService.isAuthenticated();
        this.isCurrentUser = isLoggedIn && this.jwtService.isCurrentUserProfile(id);

        return this.userService.getUserProfile(id).pipe(
          catchError(err => {
            console.error('Помилка при завантаженні профілю:', err);

            if (err.status === 404) {
              this.error = 'Профіль користувача не знайдено';
            } else {
              this.error = 'Помилка при завантаженні профілю. Спробуйте пізніше.';
            }

            this.loading = false;
            return of(null);
          })
        );
      })
    ).subscribe({
      next: (profile) => {
        if (profile) {
          this.userProfile = profile;
          // After profile loaded successfully, load user's pet cards
          this.loadUserPetCards();

          // Only load favorites if this is the current user's profile
          if (this.isCurrentUser) {
            this.loadUserFavouritePetCards();
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Непередбачена помилка в компоненті профілю:', err);
        this.error = 'Сталася непередбачена помилка. Спробуйте пізніше.';
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

  onUserFavouriteRemove = (): void => {
    this.userFavouritePetCards = [];
    this.isLoadingFavouritePetCards = true;
    this.favouritePetCardsError = null;
    this.loadUserFavouritePetCards();
  }

  loadUserFavouritePetCards(): void {
    if (!this.userProfile) return;

    // Only load favorites if this is the current user
    if (!this.isCurrentUser) {
      this.isLoadingFavouritePetCards = false;
      return;
    }

    this.isLoadingFavouritePetCards = true;
    this.favouritePetCardsError = null;

    this.userFavouritesService.getAllFavouriteCardsByUser().subscribe({
      next: (petCards) => {
        this.userFavouritePetCards = petCards;
        this.isLoadingFavouritePetCards = false;
      },
      error: (error) => {
        console.error(error);
        this.petCardError = 'Помилка при завантаженні збережених оголошень',
        this.isLoadingFavouritePetCards = false;
      }
    })
  }

  navigateToEditProfile(): void {
    if (this.userProfile) {
      this.router.navigate(['/profile/edit', this.userProfile.id]);
    }
  }

  navigateToCreatePetCard(): void {
    this.router.navigate(['/pets/add']);
  }

  transferPet(petId: number): void {
    this.router.navigate(['/pet/transfer'], { queryParams: { petId } });
  }

  deletePetCard(petId: number): void {
    this.petCardService.deletePetCard(petId).subscribe({
      next: () => {
        setTimeout(() => {
          this.loadingPetCards = true;
          this.loadUserPetCards();
        }, 100);
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
}
