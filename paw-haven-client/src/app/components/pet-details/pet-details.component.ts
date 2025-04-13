import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PetCardDetails } from '../../models/pet-card.model';
import { PetCardService } from '../../services/pet-card.service';

@Component({
  selector: 'app-pet-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-details.component.html',
  styleUrl: './pet-details.component.scss'
})
export class PetDetailsComponent {
  petDetails: PetCardDetails | null = null;
  isLoading: boolean = false;
  selectedPhotoIndex: number = 0;

  constructor (
    private route: ActivatedRoute,
    private petCardService: PetCardService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.route.params.subscribe(params => {
      const petId = params["id"];

      if (petId) {
        this.petCardService.getPetCardDetailsById(petId).subscribe({
          next: (petDetails) => {
            this.petDetails = petDetails;
            this.isLoading = false;
          },
          error: (error) => {
            console.error(error);
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        })
      }
    })
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

  nextImage(): void {
    this.selectedPhotoIndex = (this.selectedPhotoIndex - 1 + this.petDetails!.photos.length) % this.petDetails!.photos.length;
  }

  prevImage(): void {
    this.selectedPhotoIndex = (this.selectedPhotoIndex + 1) % this.petDetails!.photos.length;
  }
}
