import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PetCardCreateData, PetHealthStatus, PetType } from '../../models/pet-card.model';
import { HealthStatusService } from '../../services/health-status.service';
import { PetCardAddService } from '../../services/pet-card-add.service';
import { PetTypeService } from '../../services/pet-type.service';

@Component({
  selector: 'app-pet-card-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pet-card-form.component.html',
  styleUrls: ['./pet-card-form.component.scss']
})
export class PetCardFormComponent implements OnInit {
  name: string = '';
  age: number = 0;
  gender: string = '';
  health: string = '';
  description: string = '';
  location: string = '';
  petType: string = '';
  healthStatus: string = '';
  healthStatuses: PetHealthStatus[] = [];
  photos: File[] = [];
  imagePreviews: string[] = [];
  petTypes: PetType[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  genders: string[] = ['Хлопчик', 'Дівчинка'];
  currentSlideIndex: number = 0;
  slideCount: number = 4;

  constructor(
    private router: Router,
    private angularLocation: Location,
    private petTypeService: PetTypeService,
    private healthStatusService: HealthStatusService,
    private petCardAddService: PetCardAddService
  ) { }

  ngOnInit(): void {
    this.loadPetTypes();
    this.loadHealthStatuses();
  }

  loadPetTypes() : void {
    this.isLoading = true;
    this.petTypeService.getTypes().subscribe({
      next: (petTypes) => {
        this.petTypes = petTypes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading types: ', error);
        if (error.status === 404) {
          this.errorMessage = 'API endpoint not found. Please check if the backend server is running.';
        } else if (error.status === 0) {
          this.errorMessage = 'Could not connect to the server. Please check if the backend server is running.';
        } else {
          this.errorMessage = 'Помилка завантаження типів. Спробуйте оновити сторінку.';
        }
        this.isLoading = false;
      }
    })
  }

  loadHealthStatuses(): void {
    this.isLoading = true;
    this.healthStatusService.getHealthStatuses().subscribe({
      next: (healthStatuses) => {
        this.healthStatuses = healthStatuses;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading types: ', error);
        if (error.status === 404) {
          this.errorMessage = 'API endpoint not found. Please check if the backend server is running.';
        } else if (error.status === 0) {
          this.errorMessage = 'Could not connect to the server. Please check if the backend server is running.';
        } else {
          this.errorMessage = 'Помилка завантаження типів здоров`я. Спробуйте оновити сторінку.';
        }
        this.isLoading = false;
      }
    })
  }

  goBack() {
    this.angularLocation.back();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.photos = Array.from(input.files);
    this.imagePreviews = [];

    for (let file of this.photos) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(index: number): void {
    this.photos.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  create() {
    this.isLoading = true;

    const petCardData: PetCardCreateData = {
      name: this.name,
      age: this.age,
      description: this.description,
      location: this.location,
      health: this.health,
      gender: this.gender,
      healthStatusId: parseInt(this.healthStatus),
      petTypeId: parseInt(this.petType),
      photos: this.photos
    }

    console.log(petCardData);

    this.petCardAddService.addPetCard(petCardData).subscribe({
      next: (result) => {
        console.log("Added succesfully: ", result);
        this.router.navigate(['/'])
      },
      error: (error) => {
        this.errorMessage = 'Помилка при створенні картки. Спробуйте ще раз.';
        console.error('Per card adding failed: ', error);
        console.error({
          name: this.name,
          age: this.age,
          desciption: this.description,
          location: this.location,
          health: this.health,
          gender: this.gender,
          healthStatusId: parseInt(this.healthStatus),
          petTypeId: parseInt(this.petType),
          photos: this.photos
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
