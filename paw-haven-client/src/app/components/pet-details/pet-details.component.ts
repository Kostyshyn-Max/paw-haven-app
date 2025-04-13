import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PetCardDetails } from '../../models/pet-card.model';
import { PetCardService } from '../../services/pet-card.service';

@Component({
  selector: 'app-pet-details',
  imports: [],
  templateUrl: './pet-details.component.html',
  styleUrl: './pet-details.component.scss'
})
export class PetDetailsComponent {
  petDetails: PetCardDetails | null = null;
  isLoading: boolean = false;

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
            this.petDetails = this.petDetails;
            this.isLoading = false;
            console.error(petDetails);
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
}
