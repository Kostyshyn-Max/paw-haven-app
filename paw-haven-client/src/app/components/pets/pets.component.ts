import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PetCardService } from '../../services/pet-card.service';
import { PetCard } from '../../models/pet-card.model';
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
  errorMessage = '';
  
  // Filter options
  petTypes: string[] = ['Все', 'Собаки', 'Коти', 'Інші'];
  ageRanges: {name: string, min: number, max: number}[] = [
    {name: 'Всі', min: 0, max: 240},
    {name: 'До 1 року', min: 0, max: 12},
    {name: '1-3 роки', min: 13, max: 36},
    {name: '3-7 років', min: 37, max: 84},
    {name: 'Старше 7 років', min: 85, max: 240}
  ];
  
  // Selected filters
  selectedType: string = 'Все';
  selectedAge: {name: string, min: number, max: number} = this.ageRanges[0];
  locationQuery: string = '';
  searchQuery: string = '';
  
  constructor(private petCardService: PetCardService) {}
  
  ngOnInit(): void {
    this.loadPetCards();
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
      const typeMatch = this.selectedType === 'Все' || 
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
    this.selectedType = 'Все';
    this.selectedAge = this.ageRanges[0];
    this.locationQuery = '';
    this.searchQuery = '';
    this.applyFilters();
  }
}
