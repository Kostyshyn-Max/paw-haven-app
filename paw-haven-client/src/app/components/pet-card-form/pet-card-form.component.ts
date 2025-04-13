import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PetCardCreateData, PetHealthStatus, PetType } from '../../models/pet-card.model';
import { HealthStatusService } from '../../services/health-status.service';
import { PetCardAddService } from '../../services/pet-card-add.service';
import { PetTypeService } from '../../services/pet-type.service';
import { PawLoaderComponent } from '../shared/paw-loader/paw-loader.component';

@Component({
  selector: 'app-pet-card-form',
  standalone: true,
  imports: [FormsModule, CommonModule, PawLoaderComponent],
  templateUrl: './pet-card-form.component.html',
  styleUrls: ['./pet-card-form.component.scss']
})
export class PetCardFormComponent implements OnInit {
  name: string = '';
  age: number | null = null;
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

  // Нові налаштування для оптимізації фото
  maxWidth: number = 1200;  // Максимальна ширина зображення
  maxHeight: number = 800;  // Максимальна висота зображення
  imageQuality: number = 0.8; // Якість зображення (від 0 до 1)
  maxImageSize: number = 5 * 1024 * 1024; // 5MB як максимальний розмір файлу

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

  loadPetTypes(): void {
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
    });
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
    });
  }

  goBack() {
    this.angularLocation.back();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    // Скидаємо попередні фото
    this.photos = [];
    this.imagePreviews = [];

    const selectedFiles = Array.from(input.files);

    // Перевіряємо розмір кожного файлу
    for (let file of selectedFiles) {
      if (file.size > this.maxImageSize) {
        this.errorMessage = `Фото "${file.name}" занадто велике. Максимальний розмір файлу - 5MB.`;
        console.warn(this.errorMessage);
        continue;
      }

      this.processImage(file);
    }
  }

  /**
   * Обробляє зображення: стискає та змінює розмір перед додаванням до форми
   */
  processImage(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        // Визначаємо, чи потрібно змінювати розмір
        let width = img.width;
        let height = img.height;

        // Змінюємо розмір, якщо потрібно
        if (width > this.maxWidth || height > this.maxHeight) {
          const ratio = Math.min(this.maxWidth / width, this.maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        // Створюємо canvas для стиснення зображення
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          // Конвертуємо canvas у стиснене зображення
          canvas.toBlob((blob) => {
            if (blob) {
              // Створюємо новий File об'єкт зі стисненим зображенням
              const optimizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: new Date().getTime()
              });

              // Додаємо оптимізоване фото до списку
              this.photos.push(optimizedFile);

              // Додаємо попередній перегляд
              const reader = new FileReader();
              reader.onload = (e: any) => {
                this.imagePreviews.push(e.target.result);
              };
              reader.readAsDataURL(optimizedFile);
            }
          }, 'image/jpeg', this.imageQuality);
        }
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  removePhoto(index: number): void {
    this.photos.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  create() {
    if (this.photos.length === 0) {
      this.errorMessage = 'Будь ласка, додайте хоча б одне фото тварини.';
      return;
    }

    this.isLoading = true;

    const petCardData: PetCardCreateData = {
      name: this.name,
      age: this.age ?? 0,
      description: this.description,
      location: this.location,
      health: this.health,
      gender: this.gender,
      healthStatusId: parseInt(this.healthStatus),
      petTypeId: parseInt(this.petType),
      photos: this.photos
    };

    console.log(petCardData);

    this.petCardAddService.addPetCard(petCardData).subscribe({
      next: (result) => {
        console.log("Added succesfully: ", result);
        this.router.navigate(['/']);
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
