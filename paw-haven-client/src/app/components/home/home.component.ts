import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClientModule } from '@angular/common/http';
import { PetCardService } from '../../services/pet-card.service';
import { PetCard } from '../../models/pet-card.model';
import { CardComponent } from '../shared/card/card.component';
import { PawLoaderComponent } from '../shared/paw-loader/paw-loader.component';

interface Testimonial {
  author: string;
  text: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, HttpClientModule, CardComponent, PawLoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('testimonialFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  
  testimonials: Testimonial[] = [
    {
      author: 'Оля і Пушок',
      text: 'Пушок з\'явився у нас у найважчий час. Цей клубочок приніс стільки тепла й радості, що життя ніби почалося спочатку. Тварини теж рятують людей.'
    },
    {
      author: 'Марія і Барсік',
      text: 'Коли я взяла Барсіка з притулку, не думала, що він змінить моє життя. Тепер не уявляю дня без його муркотіння і теплих обіймів.'
    },
    {
      author: 'Іван і Рекс',
      text: 'Рекс став не просто домашнім улюбленцем, а справжнім другом для всієї родини. Його відданість і любов безмежні.'
    },
    {
      author: 'Тетяна і Мурчик',
      text: 'Мурчик допоміг мені боротися з самотністю. Коли приходжу додому, він завжди зустрічає мене біля дверей, і це найкращий момент дня.'
    }
  ];
  
  
  currentTestimonialIndex = 0;
  currentTestimonial: Testimonial;
  isAnimating = false;
  isMobile = false;
  isTablet = false;
  isDesktop = false;
  
  petCards: PetCard[] = [];
  isLoading = false;
  errorMessage = '';
  
  private testimonialTimer: any;
  private resizeTimeout: any;
  
  constructor(private petCardService: PetCardService) {
    this.currentTestimonial = this.testimonials[0];
    this.checkScreenSize();
  }

  ngOnInit(): void {
    // Set up testimonial rotation
    this.testimonialTimer = setInterval(() => {
      if (!this.isAnimating) {
        this.nextTestimonial();
      }
    }, 10000);
    
    // Load pet cards
    this.loadFeaturedPetCards();
    
    // Add resize listener
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleResize(): void {
    // Debounce resize events
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.checkScreenSize();
    }, 250);
  }

  checkScreenSize(): void {
    const width = window.innerWidth;
    this.isMobile = width < 576;
    this.isTablet = width >= 576 && width < 992;
    this.isDesktop = width >= 992;
  }

  ngAfterViewInit(): void {
    // Fix SVG namespace issues
    document.querySelectorAll('.scroll-indicator__circle svg').forEach(svg => {
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    });
  }
  
  ngOnDestroy(): void {
    // Clean up timers and event listeners
    if (this.testimonialTimer) {
      clearInterval(this.testimonialTimer);
    }
    
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  loadFeaturedPetCards(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Adjust the number of cards based on screen size
    const cardCount = this.isMobile ? 3 : (this.isTablet ? 4 : 6);
    
    this.petCardService.getFeaturedPetCards(cardCount).subscribe({
      next: (data) => {
        this.petCards = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching pet cards:', error);
        this.errorMessage = 'Не вдалося завантажити оголошення. Спробуйте пізніше.';
        this.isLoading = false;
      }
    });
  }
  
  nextTestimonial(): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    setTimeout(() => {
      this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
      this.currentTestimonial = this.testimonials[this.currentTestimonialIndex];
      this.isAnimating = false;
    }, 300);
  }

  previousTestimonial(): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    setTimeout(() => {
      this.currentTestimonialIndex = (this.currentTestimonialIndex - 1 + this.testimonials.length) % this.testimonials.length;
      this.currentTestimonial = this.testimonials[this.currentTestimonialIndex];
      this.isAnimating = false;
    }, 300);
  }

  scrollDown(): void {
    const petCardsSection = document.getElementById('pet-cards');
    if (petCardsSection) {
      petCardsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.previousTestimonial();
    } else if (event.key === 'ArrowRight') {
      this.nextTestimonial();
    }
  }
  
  getAgeText(months: number): string {
    if (months < 12) {
      const lastTwoDigits = months % 100;
      const lastDigit = months % 10;
      
      if (lastTwoDigits === 11) {
        return `${months} місяців`;
      }
      
      if (lastDigit === 1) {
        return `${months} місяць`;
      } else if (lastDigit >= 2 && lastDigit <= 4) {
        return `${months} місяці`;
      } else {
        return `${months} місяців`;
      }
    } 
    
    const years = Math.floor(months / 12);
    const lastTwoDigits = years % 100;
    const lastDigit = years % 10;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return `${years} років`;
    }
    
    if (lastDigit === 1) {
      return `${years} рік`;
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      return `${years} роки`;
    } else {
      return `${years} років`;
    }
  }
  
  navigateToPetDetails(petName: string): void {
    console.log(`Navigate to pet details for: ${petName}`);
    // Implement navigation logic here
  }

  getPetImageUrl(pet: PetCard): string {
    if (pet.petPhoto && pet.petPhoto.petPhotoLink) {
      return pet.petPhoto.petPhotoLink;
    }
    
    if (pet.petType && pet.petType.title) {
      const petType = pet.petType.title.toLowerCase();
      if (petType.includes('кіт') || petType.includes('кот') || petType.includes('кош')) {
        return 'assets/images/defaults/cat-default.svg';
      } else if (petType.includes('соб') || petType.includes('пес')) {
        return 'assets/images/default-dog.jpg';
      } else if (petType.includes('крол')) {
        return 'assets/images/default-rabbit.jpg';
      }
    }
    
    return 'assets/images/default-pet.jpg';
  }

  getPetType(pet: PetCard): string {
    return pet.petType && pet.petType.title ? pet.petType.title : 'тварина';
  }

  getPetLocation(pet: PetCard): string {
    return pet.location ? pet.location : 'Невідомо';
  }
}
