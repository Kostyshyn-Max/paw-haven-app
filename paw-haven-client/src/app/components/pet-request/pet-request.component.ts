import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PetType } from '../../models/pet-card.model';
import { PetTypeService } from '../../services/pet-type.service';

export interface PetStateModel {
  name: string,
  ageRange: string,
  petType: string,
  location: string
}

@Component({
  selector: 'app-pet-request',
  imports: [CommonModule, FormsModule],
  templateUrl: './pet-request.component.html',
  styleUrl: './pet-request.component.scss'
})
export class PetRequestComponent implements OnInit {
  petRequest: PetStateModel | null = null;
  isLoading: boolean = false;

  petTypes: PetType[] = [];

  ageRanges: { name: string, min: number, max: number }[] = [
    { name: 'Всі', min: 0, max: 240 },
    { name: 'До 1 року', min: 0, max: 12 },
    { name: '1-3 роки', min: 13, max: 36 },
    { name: '3-7 років', min: 37, max: 84 },
    { name: 'Старше 7 років', min: 85, max: 240 }
  ];

  ageRange: { name: string, min: number, max: number } = this.ageRanges[0];

  name: string = '';
  petType: string = '';
  location: string = '';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly petTypeService: PetTypeService
  ) {}

  ngOnInit(): void {
    this.loadPetTypes();

    this.route.queryParams.subscribe(params => {
      this.name = params['name'] ?? '';
      const age = params['ageRange'];
      this.ageRange = this.ageRanges.find(x => x.name === age) ?? this.ageRanges[0];
      this.petType = params['petType'] ?? '';
      this.location = params['location'] ?? '';
    });
    console.error(this.name, this.ageRange, this.petType, this.location);
  }

  loadPetTypes(): void {
    this.isLoading = true;
    this.petTypeService.getTypes().subscribe({
      next: (petTypes) => {
        petTypes.push({ id: 0, title: 'Всi' });
        petTypes = petTypes.sort((a, b) => a.id - b.id);

        this.petTypes = petTypes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading types: ', error);
        this.isLoading = false;
      }
    });
  }

  submitModel() : void {
    this.router.navigate(["/"]);
  }
}
