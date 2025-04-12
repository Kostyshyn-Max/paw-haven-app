import { Component, ElementRef, ViewChildren, QueryList, AfterViewInit, HostListener, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChildren('navItem') navItems!: QueryList<ElementRef>;
  
  
  activeNavItem: string = 'PawHaven';
  hoveredNavItem: string | null = null;
  
  
  isMobileMenuOpen = false;
  isSearchOpen = false;
  isAccountMenuOpen = false;
  
  
  hasNotifications = true;
  hasFavorites = false;
  
  
  showProgressBar = true;
  scrollProgress = 0;
  isHeaderScrolled = false;
  headerPlaceholderHeight = 0;
  
  
  indicatorStyle: { left: string; width: string } = { left: '0', width: '0' };
  
  
  isAuthenticated = false;
  private authSubscription: Subscription | null = null;
  
  constructor(
    private renderer: Renderer2,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      }
    );
    
    
    this.isAuthenticated = this.authService.isAuthenticated();
  }
  
  ngOnDestroy(): void {
    
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  
  logout(): void {
    this.authService.logout();
    this.isAccountMenuOpen = false;
  }

  toggleAccountMenu(): void {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
  }

  closeAccountMenu(): void {
    this.isAccountMenuOpen = false;
  }
  

  ngAfterViewInit() {
    setTimeout(() => this.updateIndicator(), 100);
    
    const headerElement = document.querySelector('.header') as HTMLElement;
    if (headerElement) {
      this.headerPlaceholderHeight = headerElement.offsetHeight;
    }
    
    
    this.checkScrollPosition();
  }
  

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
    this.updateIndicator();
    
    const headerElement = document.querySelector('.header') as HTMLElement;
    if (headerElement && !this.isHeaderScrolled) {
      this.headerPlaceholderHeight = headerElement.offsetHeight;
    }
  }
  

  private checkScrollPosition() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const scrollThreshold = 50;
    
    if (winScroll > scrollThreshold && !this.isHeaderScrolled) {
      this.isHeaderScrolled = true;
      const headerElement = document.querySelector('.header') as HTMLElement;
      this.renderer.addClass(headerElement, 'scrolled');
      
      
      const contentElement = document.querySelector('main') as HTMLElement;
      if (contentElement && this.headerPlaceholderHeight > 0) {
        this.renderer.setStyle(contentElement, 'padding-top', `${this.headerPlaceholderHeight}px`);
      }
    }
  }
  

  @HostListener('window:scroll')
  onScroll() {
    if (!this.showProgressBar) return;
    
    
    requestAnimationFrame(() => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      this.scrollProgress = (winScroll / height) * 100;
      
      
      const scrollThreshold = 50; 
      const headerElement = document.querySelector('.header') as HTMLElement;
      const contentElement = document.querySelector('main') as HTMLElement;
      
      if (winScroll > scrollThreshold && !this.isHeaderScrolled) {
        this.isHeaderScrolled = true;
        this.renderer.addClass(headerElement, 'scrolled');
        
        
        if (contentElement && this.headerPlaceholderHeight > 0) {
          this.renderer.setStyle(contentElement, 'padding-top', `${this.headerPlaceholderHeight}px`);
        }
      } else if (winScroll <= scrollThreshold && this.isHeaderScrolled) {
        this.isHeaderScrolled = false;
        this.renderer.removeClass(headerElement, 'scrolled');
        
        
        if (contentElement) {
          this.renderer.removeStyle(contentElement, 'padding-top');
        }
      }
    });
  }
  

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Close account menu when clicking outside
    const accountMenuElement = document.querySelector('.account-dropdown');
    const accountToggle = document.querySelector('.user-icon-button');
    
    if (this.isAccountMenuOpen && 
        accountMenuElement && 
        accountToggle && 
        !accountMenuElement.contains(event.target as Node) && 
        !accountToggle.contains(event.target as Node)) {
      this.isAccountMenuOpen = false;
    }
    
    // Don't close mobile menu when clicking inside it
    if (this.isMobileMenuOpen) {
      const navElement = document.querySelector('.nav');
      const menuToggle = document.querySelector('.mobile-menu-toggle');
      
      if (navElement && 
          menuToggle && 
          !navElement.contains(event.target as Node) && 
          !menuToggle.contains(event.target as Node)) {
        this.isMobileMenuOpen = false;
        document.body.classList.remove('menu-open');
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Close menus on Escape key
    if (event.key === 'Escape') {
      if (this.isSearchOpen) {
        this.isSearchOpen = false;
      }
      
      if (this.isAccountMenuOpen) {
        this.isAccountMenuOpen = false;
      }
      
      if (this.isMobileMenuOpen) {
        this.isMobileMenuOpen = false;
        document.body.classList.remove('menu-open');
      }
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    if (this.isMobileMenuOpen) {
      this.isSearchOpen = false;
      this.isAccountMenuOpen = false;
      document.body.classList.add('menu-open');
      
      // Add animation delay for menu items
      setTimeout(() => {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
          const element = link as HTMLElement;
          element.style.transitionDelay = `${index * 50}ms`;
          element.classList.add('animated');
        });
      }, 100);
    } else {
      document.body.classList.remove('menu-open');
      
      // Remove animation delay
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach((link) => {
        const element = link as HTMLElement;
        element.style.transitionDelay = '0ms';
        element.classList.remove('animated');
      });
    }
  }
  

  toggleSearch(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Зупиняємо поширення події, щоб запобігти закриттю одразу
    }
    this.isSearchOpen = !this.isSearchOpen;
    
    if (this.isSearchOpen) {
      // Закриваємо інші відкриті панелі
      if (this.isAccountMenuOpen) {
        this.isAccountMenuOpen = false;
      }
      if (this.isMobileMenuOpen) {
        this.isMobileMenuOpen = false;
        document.body.classList.remove('menu-open');
      }
    }
  }
  

  onSearchSubmit(searchText: string): void {
    console.log('Search submitted:', searchText);
    
    this.isSearchOpen = false;
  }
  

  onSearchClose(): void {
    this.isSearchOpen = false;
  }
  

  onNavItemMouseEnter(navItem: string): void {
    this.hoveredNavItem = navItem;
    this.updateIndicator();
  }
  

  onNavItemMouseLeave(): void {
    this.hoveredNavItem = null;
    this.updateIndicator();
  }
  

  setActiveNavItem(navItem: string): void {
    this.activeNavItem = navItem;
    this.updateIndicator();
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.classList.remove('menu-open');
    }
  }
  

  updateIndicator(): void {
    const currentItem = this.hoveredNavItem || this.activeNavItem;
    
    if (this.navItems && this.navItems.length > 0) {
      
      let activeIndex = -1;
      this.navItems.forEach((item, index) => {
        const el = item.nativeElement;
        if (el.classList.contains('nav-link') && el.textContent.trim().includes(currentItem)) {
          activeIndex = index;
        }
      });
      
      if (activeIndex >= 0) {
        const element = this.navItems.toArray()[activeIndex].nativeElement;
        this.indicatorStyle = {
          left: `${element.offsetLeft}px`,
          width: `${element.offsetWidth}px`
        };
      }
    }
  }
}
