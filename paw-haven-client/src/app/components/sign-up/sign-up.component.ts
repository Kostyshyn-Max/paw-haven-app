import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AuthService, UserCreateData, OrganisationCreateData } from '../../services/auth.service';
import { OrganisationService } from '../../services/organisation.service';
import { OrganisationCategory } from '../../models/organisation-category.model';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  confirmPassword: string = '';
  category: string = '';
  userType: 'volunteer' | 'organization' = 'volunteer';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  agreeToTerms: boolean = false;
  categories: OrganisationCategory[] = [];
  isLoading: boolean = false;
  isLoadingCategories: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private organisationService: OrganisationService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoadingCategories = true;
    this.organisationService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        if (error.status === 404) {
          this.errorMessage = 'API endpoint not found. Please check if the backend server is running.';
        } else if (error.status === 0) {
          this.errorMessage = 'Could not connect to the server. Please check if the backend server is running.';
        } else {
          this.errorMessage = 'Помилка завантаження категорій. Спробуйте оновити сторінку.';
        }
        this.isLoadingCategories = false;
      }
    });
  }

  setUserType(type: 'volunteer' | 'organization'): void {
    this.userType = type;
  }

  goBack(): void {
    this.location.back();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Паролі не співпадають';
      return;
    }

    if (this.userType === 'organization') {
      if (!this.lastName) {
        this.lastName = this.firstName;
      }
    }

    this.isLoading = true;
    this.errorMessage = '';

    const userData: UserCreateData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      isOrganisationOwner: this.userType === 'organization'
    };

    if (this.userType === 'volunteer') {
      this.authService.registerUser(userData).subscribe({
        next: () => {
          this.router.navigate(['/sign-in']);
        },
        error: (error) => {
          this.errorMessage = 'Помилка реєстрації. Спробуйте ще раз.';
          console.error('Registration error:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      const orgData: OrganisationCreateData = {
        user: userData,
        name: this.firstName,
        description: '',
        organisationCategoryId: parseInt(this.category)
      };

      this.authService.registerOrganisation(orgData).subscribe({
        next: () => {
          this.router.navigate(['/sign-in']);
        },
        error: (error) => {
          this.errorMessage = 'Помилка реєстрації. Спробуйте ще раз.';
          console.error('Registration error:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
