import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PetCardDetails, PetCard } from '../../models/pet-card.model';
import { PetCardService } from '../../services/pet-card.service';
import { UserFavouritesService } from '../../services/user-favourites.service';
import { AuthService } from '../../services/auth.service';
import { PawLoaderComponent } from '../shared/paw-loader/paw-loader.component';
import { CardComponent } from '../shared/card/card.component';

@Component({
  selector: 'app-pet-details',
  standalone: true,
  imports: [CommonModule, PawLoaderComponent, CardComponent],
  templateUrl: './pet-details.component.html',
  styleUrl: './pet-details.component.scss'
})
export class PetDetailsComponent implements OnInit {
  petDetails: PetCardDetails | null = null;
  isLoading: boolean = false;
  selectedPhotoIndex: number = 0;
  isFavorite: boolean = false;
  isAuthenticated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petCardService: PetCardService,
    private userFavouritesService: UserFavouritesService,
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.checkAuthentication();

    this.route.params.subscribe(params => {
      const petId = params["id"];

      if (petId) {
        this.loadPetDetails(petId);
      }
    });
  }

  checkAuthentication(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  loadPetDetails(petId: number): void {
    this.petCardService.getPetCardDetailsById(petId).subscribe({
      next: (petDetails) => {
        this.petDetails = petDetails;
        this.isLoading = false;
        
        if (this.isAuthenticated) {
          this.checkIfFavorite(petId);
        }
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  checkIfFavorite(petId: number): void {
    this.userFavouritesService.isUserSavedACard(petId).subscribe({
      next: (isSaved) => {
        this.isFavorite = isSaved;
      },
      error: (error) => {
        console.error('Error checking favorite status:', error);
      }
    });
  }

  toggleFavorite(): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    if (!this.petDetails) return;
    
    if (this.isFavorite) {
      this.userFavouritesService.removeFavourite(this.petDetails.id).subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (error) => {
          console.error('Error removing from favorites:', error);
        }
      });
    } else {
      this.userFavouritesService.addFavourite(this.petDetails.id).subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (error) => {
          console.error('Error adding to favorites:', error);
        }
      });
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

  // Метод для вибору конкретного зображення з мініатюр
  selectImage(index: number): void {
    if (!this.petDetails || !this.petDetails.photos || index < 0 || index >= this.petDetails.photos.length) return;
    this.selectedPhotoIndex = index;
  }

  nextImage(): void {
    if (!this.petDetails || !this.petDetails.photos || !this.petDetails.photos.length) return;
    this.selectedPhotoIndex = (this.selectedPhotoIndex + 1) % this.petDetails.photos.length;
  }

  prevImage(): void {
    if (!this.petDetails || !this.petDetails.photos || !this.petDetails.photos.length) return;
    this.selectedPhotoIndex = (this.selectedPhotoIndex - 1 + this.petDetails.photos.length) % this.petDetails.photos.length;
  }

  getAgeText(months: number): string {
    if (months < 12) {
      const lastTwoDigits = months % 100;
      const lastDigit = months % 10;

      if (lastTwoDigits === 11) {
        return `${months} місяців`;
      }

      if (lastDigit === 1) {
        return `${months} місяць`;
      } else if (lastDigit >= 2 && lastDigit <= 4) {
        return `${months} місяці`;
      } else {
        return `${months} місяців`;
      }
    }

    const years = Math.floor(months / 12);
    const lastTwoDigits = years % 100;
    const lastDigit = years % 10;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return `${years} років`;
    }

    if (lastDigit === 1) {
      return `${years} рік`;
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      return `${years} роки`;
    } else {
      return `${years} років`;
    }
  }

  goBack(): void {
    this.location.back();
  }
  
  // Convert PetCardDetails to PetCard for the card component
  convertToPetCard(details: PetCardDetails): PetCard {
    return {
      id: details.id,
      name: details.name,
      age: details.age,
      location: details.location,
      petPhoto: details.photos && details.photos.length > 0 
        ? { petPhotoLink: details.photos[0].petPhotoLink } 
        : { petPhotoLink: 'assets/images/placeholder-pet.jpg' },
      petType: details.petType
    };
  }
}
