import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrganisationService } from '../../services/organisation.service';
import { Organization } from '../../models/organization.model';
import { PawLoaderComponent } from '../shared/paw-loader/paw-loader.component';
import { PetCard } from '../../models/pet-card.model';
import { forkJoin, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-organisations',
  standalone: true,
  imports: [CommonModule, RouterModule, PawLoaderComponent],
  templateUrl: './organisations.component.html',
  styleUrl: './organisations.component.scss'
})
export class OrganisationsComponent implements OnInit {
  organizations: Organization[] = [];
  isLoading = true;
  error = false;

  constructor(
    private organisationService: OrganisationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.isLoading = true;
    this.error = false;
    
    this.organisationService.getOrganisations().subscribe({
      next: (data: Organization[]) => {
        console.log('Organizations data:', data);
        this.organizations = data;
        
        // Load pet cards for each organization
        this.loadPetCardsForOrganizations();
      },
      error: (err: any) => {
        console.error('Error loading organizations:', err);
        this.error = true;
        this.isLoading = false;
      }
    });
  }
  
  loadPetCardsForOrganizations(): void {
    if (this.organizations.length === 0) {
      this.isLoading = false;
      return;
    }

    // Create an array of observables for each organization
    const petCardRequests = this.organizations.map(org => 
      this.organisationService.getOrganisationById(org.id).pipe(
        switchMap(orgDetails => {
          if (orgDetails.ownerId) {
            return this.organisationService.getPetCardsByUserId(orgDetails.ownerId).pipe(
              switchMap(petCards => {
                org.petCards = petCards;
                console.log(`Loaded ${petCards.length} pet cards for organization ${org.name}`);
                return of(petCards);
              })
            );
          }
          return of([]);
        })
      )
    );

    // Wait for all requests to complete
    forkJoin(petCardRequests).subscribe({
      next: () => {
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

  navigateToOrganisation(org: Organization): void {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    

      this.router.navigate(['/organisation', org.id]);
  }

  navigateToPet(pet: PetCard): void {
    this.router.navigate(['/pets', pet.id]);
  }
}
