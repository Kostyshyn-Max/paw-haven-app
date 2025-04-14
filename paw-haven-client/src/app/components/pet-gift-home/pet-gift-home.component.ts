import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pet-gift-home',
  imports: [],
  templateUrl: './pet-gift-home.component.html',
  styleUrl: './pet-gift-home.component.scss'
})
export class PetGiftHomeComponent {
  constructor(
    private router: Router
  ) {}

  goToHome() : void {
    this.router.navigate(['/'])
  }
}
