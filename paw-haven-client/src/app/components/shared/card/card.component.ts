import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PetCard } from '../../../models/pet-card.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() pet!: PetCard;

  constructor (
    private router: Router
  ) {}

  getPetImageUrl(): string {
    if (this.pet.petPhoto && this.pet.petPhoto.petPhotoLink) {
      return this.pet.petPhoto.petPhotoLink;
    }

    if (this.pet.petType && this.pet.petType.title) {
      const petType = this.pet.petType.title.toLowerCase();
      if (petType.includes('кіт') || petType.includes('кот') || petType.includes('кош')) {
        return 'assets/images/defaults/cat-default.svg';
      } else if (petType.includes('соб') || petType.includes('пес')) {
        return 'assets/images/default-dog.jpg';
      } else if (petType.includes('крол')) {
        return 'assets/images/default-rabbit.jpg';
      }
    }

    return 'assets/images/default-pet.jpg';
  }

  getPetType(): string {
    return this.pet.petType && this.pet.petType.title ? this.pet.petType.title : 'тварина';
  }

  getPetLocation(): string {
    return this.pet.location ? this.pet.location : 'Невідомо';
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

  navigateToPetDetails(petName: string): void {
    console.log(`Navigate to pet details for: ${petName}`);
    // Логіка для переходу на сторінку з деталями
    this.router.navigate([`/pets/${this.pet.id}`]);
  }
}
