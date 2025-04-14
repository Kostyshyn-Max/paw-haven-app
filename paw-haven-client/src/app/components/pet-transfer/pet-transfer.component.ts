import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Organization } from '../../models/organization.model';
import { PetCard } from '../../models/pet-card.model';
import { OrganisationService } from '../../services/organisation.service';
import { PetCardService } from '../../services/pet-card.service';
import { CardComponent } from "../shared/card/card.component";

@Component({
  selector: 'app-pet-transfer',
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './pet-transfer.component.html',
  styleUrl: './pet-transfer.component.scss'
})
export class PetTransferComponent {
  organizations: Organization[] = [];
  selectedOrganization: number = 0;
  isLoading = true;
  error = false;

  petCardId: number = 0;
  petCard: PetCard | null = null;

  constructor(
    private organisationService: OrganisationService,
    private petCardService: PetCardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.petCardId = params['petId'];
    });

    this.loadPetCard();
    this.loadOrganizations();
  }

  loadPetCard(): void {
    this.petCardService.getAllPetCards().subscribe({
      next: (petCards) => {
        this.petCard = petCards.find(x => x.id == this.petCardId) ?? null;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  loadOrganizations(): void {
    this.isLoading = true;
    this.error = false;

    this.organisationService.getOrganisations().subscribe({
      next: (data: Organization[]) => {
        console.log('Organizations data:', data);
        this.organizations = data;
      },
      error: (err: any) => {
        console.error('Error loading organizations:', err);
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  submitForm(): void {
    this.petCardService.changeOwner({
      petCardId: this.petCardId,
      organisationId: this.selectedOrganization
    }).subscribe({
      next: () => {
        this.router.navigate(['organisation']);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
}
