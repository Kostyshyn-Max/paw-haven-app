import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PetCard, PetType } from '../../models/pet-card.model';
import { PetCardService } from '../../services/pet-card.service';
import { PetTypeService } from '../../services/pet-type.service';
import { CardComponent } from '../shared/card/card.component';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CardComponent],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.scss'
})
export class PetsComponent implements OnInit {
  petCards: PetCard[] = [];
  filteredPetCards: PetCard[] = [];
  isLoading = false;
  isPetTypesLoading = false;
  errorMessage = '';

  // Filter options
  petTypes: PetType[] = [];
  ageRanges: {name: string, min: number, max: number}[] = [
    {name: 'Всі', min: 0, max: 240},
    {name: 'До 1 року', min: 0, max: 12},
    {name: '1-3 роки', min: 13, max: 36},
    {name: '3-7 років', min: 37, max: 84},
    {name: 'Старше 7 років', min: 85, max: 240}
  ];

  // Selected filters
  selectedType: string = 'Всi';
  selectedAge: {name: string, min: number, max: number} = this.ageRanges[0];
  locationQuery: string = '';
  searchQuery: string = '';

  constructor(
    private petCardService: PetCardService,
    private petTypeService: PetTypeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPetCards();
    this.loadPetTypes();
  }

  loadPetTypes(): void {
    this.isPetTypesLoading = true;
    this.petTypeService.getTypes().subscribe({
      next: (petTypes) => {
        petTypes.push({ id: 0, title: 'Всi' });
        petTypes.sort((a, b) => a.id - b.id);

        this.petTypes = petTypes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading types: ', error);
        this.isLoading = false;
      }
    })
  }

  loadPetCards(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.petCardService.getAllPetCards().subscribe({
      next: (data) => {
        this.petCards = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching pet cards:', error);
        this.errorMessage = 'Не вдалося завантажити оголошення. Спробуйте пізніше.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredPetCards = this.petCards.filter(pet => {
      // Type filter
      const typeMatch = this.selectedType === 'Всi' ||
        (pet.petType && pet.petType.title &&
         pet.petType.title.toLowerCase().includes(this.selectedType.toLowerCase()));

      // Age filter
      const ageMatch = pet.age >= this.selectedAge.min && pet.age <= this.selectedAge.max;

      // Location filter
      const locationMatch = this.locationQuery === '' ||
        (pet.location && pet.location.toLowerCase().includes(this.locationQuery.toLowerCase()));

      // Search query
      const searchMatch = this.searchQuery === '' ||
        (pet.name && pet.name.toLowerCase().includes(this.searchQuery.toLowerCase()));

      return typeMatch && ageMatch && locationMatch && searchMatch;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedType = 'Всi';
    this.selectedAge = this.ageRanges[0];
    this.locationQuery = '';
    this.searchQuery = '';
    this.applyFilters();
  }

  redirectToRequest(): void {
    this.router.navigate(['pet/request'], {
      queryParams: {
        name: this.searchQuery ?? '',
        ageRange: this.selectedAge?.name ?? '',
        petType: this.selectedType ?? '',
        location: this.locationQuery ?? ''
      }
    });
  }
}
