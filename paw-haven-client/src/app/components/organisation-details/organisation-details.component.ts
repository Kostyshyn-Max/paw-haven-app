import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrganisationService } from '../../services/organisation.service';
import { Organization } from '../../models/organization.model';
import { PawLoaderComponent } from '../shared/paw-loader/paw-loader.component';
import { PetCard } from '../../models/pet-card.model';
import { forkJoin, of, switchMap } from 'rxjs';
import { CardComponent } from '../shared/card/card.component';

@Component({
  selector: 'app-organisation-details',
  standalone: true,
  imports: [CommonModule, RouterModule, PawLoaderComponent, CardComponent],
  templateUrl: './organisation-details.component.html',
  styleUrls: ['./organisation-details.component.scss']
})
export class OrganisationDetailsComponent implements OnInit {
  organization: Organization | null = null;
  pets: PetCard[] = [];
  isLoading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private organisationService: OrganisationService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrganization(id);
    } else {
      this.error = true;
      this.isLoading = false;
    }
  }

  loadOrganization(id: string): void {
    this.isLoading = true;
    this.error = false;
    
    this.organisationService.getOrganisationById(id).subscribe({
      next: (data: Organization) => {
        this.organization = data;
        
        // Load pet cards for this organization
        if (data.ownerId) {
          this.loadPetCardsForOrganization(data.ownerId);
        } else {
          this.isLoading = false;
        }
      },
      error: (err: any) => {
        console.error('Error loading organization:', err);
        this.error = true;
        this.isLoading = false;
      }
    });
  }
  
  loadPetCardsForOrganization(ownerId: string): void {
    this.organisationService.getPetCardsByUserId(ownerId).subscribe({
      next: (petCards: PetCard[]) => {
        console.log('Received pet cards:', petCards);
        this.pets = petCards;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading pet cards:', err);
        this.isLoading = false;
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  
  getPetImageUrl(pet: PetCard): string {
    if (pet.petPhoto && pet.petPhoto.petPhotoLink) {
      return pet.petPhoto.petPhotoLink;
    }
    
    if (pet.petType && pet.petType.title) {
      const petType = pet.petType.title.toLowerCase();
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
  
  goBack(): void {
    this.location.back();
  }
}