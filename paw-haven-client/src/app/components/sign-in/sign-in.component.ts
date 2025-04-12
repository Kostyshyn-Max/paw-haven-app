import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router, 
    private location: Location,
    private authService: AuthService
  ) {}

  goBack(): void {
    this.location.back();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.email, this.password, this.rememberMe)
      .subscribe({
        next: () => {
          // Redirect to home page on successful login
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          if (typeof error.message === 'string') {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = 'Невірний логін або пароль. Спробуйте ще раз.';
          }
          console.error('Login error:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}
