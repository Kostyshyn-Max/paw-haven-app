import { Component, ElementRef, ViewChildren, QueryList, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';

/**
 * Header component that contains the logo, navigation, and action buttons
 * Also manages the search functionality through the SearchComponent
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SearchComponent],
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
  
  // Navigation indicator styling
  indicatorStyle: { left: string; width: string } = { left: '0', width: '0' };
  
  /**
   * Initialize the navigation indicator after view is initialized
   */
  ngAfterViewInit() {
    setTimeout(() => this.updateIndicator(), 0);
  }
  
  /**
   * Handle window resize events
   * Close mobile menu if screen size increases
   * Update navigation indicator position
   */
  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
    this.updateIndicator();
  }
  
  /**
   * Toggle the mobile menu
   * Close search if mobile menu is opened
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isSearchOpen = false;
    }
  }
  
  /**
   * Toggle the search panel
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
   * Handle navigation item hover
   * @param navItem The navigation item being hovered
   */
  onNavItemMouseEnter(navItem: string): void {
    this.hoveredNavItem = navItem;
    this.updateIndicator();
  }
  
  /**
   * Handle navigation item hover end
   */
  onNavItemMouseLeave(): void {
    this.hoveredNavItem = null;
    this.updateIndicator();
  }
  
  /**
   * Set the active navigation item
   * @param navItem The navigation item to set as active
   */
  setActiveNavItem(navItem: string): void {
    this.activeNavItem = navItem;
    this.updateIndicator();
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }
  
  /**
   * Update the navigation indicator position and width
   * based on the current active or hovered item
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
