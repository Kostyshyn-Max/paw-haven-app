import { Component, ElementRef, ViewChildren, QueryList, AfterViewInit, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { AuthService } from '../../../services/auth.service';

/**
 * Enhanced header component with beautiful animations and responsive design
 * Contains logo, navigation, search functionality, and action buttons
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
  @ViewChildren('navItem') navItems!: QueryList<ElementRef>;
  
  // Navigation state
  activeNavItem: string = 'Історії';
  hoveredNavItem: string | null = null;
  
  // UI state
  isMobileMenuOpen = false;
  isSearchOpen = false;
  isAccountMenuOpen = false;
  
  // Notification state
  hasNotifications = true;
  hasFavorites = false;
  
  // Scroll progress bar
  showProgressBar = true;
  scrollProgress = 0;
  isHeaderScrolled = false;
  headerPlaceholderHeight = 0;
  
  // Navigation indicator styling
  indicatorStyle: { left: string; width: string } = { left: '0', width: '0' };
  
  // Auth state
  isAuthenticated = false;
  
  constructor(
    private renderer: Renderer2,
    private authService: AuthService
  ) {
    this.checkAuthState();
  }
  
  private checkAuthState(): void {
    this.isAuthenticated = !!this.authService.getToken();
  }
  
  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.isAccountMenuOpen = false;
  }

  toggleAccountMenu(): void {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
  }

  closeAccountMenu(): void {
    this.isAccountMenuOpen = false;
  }
  
  /**
   * Initialize the navigation indicator after view is initialized
   */
  ngAfterViewInit() {
    setTimeout(() => this.updateIndicator(), 100);
    // Save the original header height for placeholder
    const headerElement = document.querySelector('.header') as HTMLElement;
    if (headerElement) {
      this.headerPlaceholderHeight = headerElement.offsetHeight;
    }
    
    // Pre-scroll check (in case of page refresh in the middle of the page)
    this.checkScrollPosition();
  }
  
  /**
   * Handle window resize and scroll events
   */
  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
    this.updateIndicator();
    // Update header height on resize
    const headerElement = document.querySelector('.header') as HTMLElement;
    if (headerElement && !this.isHeaderScrolled) {
      this.headerPlaceholderHeight = headerElement.offsetHeight;
    }
  }
  
  /**
   * Check current scroll position (useful after page refresh)
   */
  private checkScrollPosition() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const scrollThreshold = 50;
    
    if (winScroll > scrollThreshold && !this.isHeaderScrolled) {
      this.isHeaderScrolled = true;
      const headerElement = document.querySelector('.header') as HTMLElement;
      this.renderer.addClass(headerElement, 'scrolled');
      
      // Add placeholder space when header becomes fixed
      const contentElement = document.querySelector('main') as HTMLElement;
      if (contentElement && this.headerPlaceholderHeight > 0) {
        this.renderer.setStyle(contentElement, 'padding-top', `${this.headerPlaceholderHeight}px`);
      }
    }
  }
  
  /**
   * Track scroll position for progress bar and header background/position change
   * Using requestAnimationFrame for better performance
   */
  @HostListener('window:scroll')
  onScroll() {
    if (!this.showProgressBar) return;
    
    // Use requestAnimationFrame to optimize scroll performance
    requestAnimationFrame(() => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      this.scrollProgress = (winScroll / height) * 100;
      
      // Update header background and position based on scroll position
      const scrollThreshold = 50; // Pixels to scroll before changing header
      const headerElement = document.querySelector('.header') as HTMLElement;
      const contentElement = document.querySelector('main') as HTMLElement;
      
      if (winScroll > scrollThreshold && !this.isHeaderScrolled) {
        this.isHeaderScrolled = true;
        this.renderer.addClass(headerElement, 'scrolled');
        
        // Add placeholder space when header becomes fixed
        if (contentElement && this.headerPlaceholderHeight > 0) {
          this.renderer.setStyle(contentElement, 'padding-top', `${this.headerPlaceholderHeight}px`);
        }
      } else if (winScroll <= scrollThreshold && this.isHeaderScrolled) {
        this.isHeaderScrolled = false;
        this.renderer.removeClass(headerElement, 'scrolled');
        
        // Remove placeholder space when header returns to relative
        if (contentElement) {
          this.renderer.removeStyle(contentElement, 'padding-top');
        }
      }
    });
  }
  
  /**
   * Toggle the mobile menu with improved animation
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isSearchOpen = false;
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }
  
  /**
   * Toggle the search panel with animation
   */
  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }
  
  /**
   * Handle search submission from the SearchComponent
   * @param searchText The search text entered by the user
   */
  onSearchSubmit(searchText: string): void {
    console.log('Search submitted:', searchText);
    // Implement search functionality here
    this.isSearchOpen = false;
  }
  
  /**
   * Handle search panel close from the SearchComponent
   */
  onSearchClose(): void {
    this.isSearchOpen = false;
  }
  
  /**
   * Handle navigation item hover with enhanced animation
   * @param navItem The navigation item being hovered
   */
  onNavItemMouseEnter(navItem: string): void {
    this.hoveredNavItem = navItem;
    this.updateIndicator();
  }
  
  /**
   * Handle navigation item hover end and restore active indicator
   */
  onNavItemMouseLeave(): void {
    this.hoveredNavItem = null;
    this.updateIndicator();
  }
  
  /**
   * Set the active navigation item with smooth transition
   * @param navItem The navigation item to set as active
   */
  setActiveNavItem(navItem: string): void {
    this.activeNavItem = navItem;
    this.updateIndicator();
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.classList.remove('menu-open');
    }
  }
  
  /**
   * Update the navigation indicator position and width
   * with smooth animations based on the current active or hovered item
   */
  updateIndicator(): void {
    const currentItem = this.hoveredNavItem || this.activeNavItem;
    const index = ['Історії', 'Блог', 'Знайти друга'].indexOf(currentItem);
    
    if (index >= 0 && this.navItems && this.navItems.length > 0) {
      const element = this.navItems.toArray()[index].nativeElement;
      this.indicatorStyle = {
        left: `${element.offsetLeft}px`,
        width: `${element.offsetWidth}px`
      };
    }
  }
}
