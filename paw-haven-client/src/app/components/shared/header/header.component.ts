import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { JwtService } from '../../../services/jwt.service';
import { MessagesComponent } from "../messages/messages.component";
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchComponent, MessagesComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChildren('navItem') navItems!: QueryList<ElementRef>;
  @ViewChild('headerElement') headerElement!: ElementRef;
  @ViewChild('contentElement') contentElement!: ElementRef;

  activeNavItem: string = 'PawHaven';
  hoveredNavItem: string | null = null;

  isMobileMenuOpen = false;
  isSearchOpen = false;
  isAccountMenuOpen = false;
  isMessagePanelOpen = false;

  hasNotifications = true;
  hasFavorites = false;

  showProgressBar = true;
  scrollProgress = 0;
  isHeaderScrolled = false;
  headerPlaceholderHeight = 0;

  indicatorStyle: { left: string; width: string } = { left: '0', width: '0' };

  isAuthenticated = false;
  private authSubscription: Subscription | null = null;
  private scrollHandlerTimeout: number | null = null;

  userId: string | null = null;

  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      isAuthenticated => {
        this.setAuthenticationState(isAuthenticated);
      }
    );

    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.userId = this.jwtService.getUserId();
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }

    if (this.scrollHandlerTimeout) {
      window.cancelAnimationFrame(this.scrollHandlerTimeout);
    }
  }

  logout(): void {
    this.authService.logout();
    this.isAccountMenuOpen = false;
    this.userId = null;
  }

  toggleAccountMenu(): void {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
  }

  closeAccountMenu(): void {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.isAccountMenuOpen = false;
  }

  ngAfterViewInit() {
    setTimeout(() => this.updateIndicator(), 100);

    const headerEl = this.headerElement.nativeElement;
    if (headerEl) {
      this.headerPlaceholderHeight = headerEl.offsetHeight;
    }

    this.checkScrollPosition();
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.classList.remove('menu-open');
    }

    window.requestAnimationFrame(() => {
      this.updateIndicator();
    });

    const headerEl = this.headerElement.nativeElement;
    if (headerEl && !this.isHeaderScrolled) {
      this.headerPlaceholderHeight = headerEl.offsetHeight;
    }
  }

  private checkScrollPosition() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const scrollThreshold = 50;

    if (winScroll > scrollThreshold && !this.isHeaderScrolled) {
      this.isHeaderScrolled = true;
      const headerEl = this.headerElement.nativeElement;
      this.renderer.addClass(headerEl, 'scrolled');

      const contentEl = this.contentElement.nativeElement;
      if (contentEl && this.headerPlaceholderHeight > 0) {
        this.renderer.setStyle(contentEl, 'padding-top', `${this.headerPlaceholderHeight}px`);
      }
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    if (!this.showProgressBar) return;

    if (this.scrollHandlerTimeout) {
      window.cancelAnimationFrame(this.scrollHandlerTimeout);
    }

    this.scrollHandlerTimeout = window.requestAnimationFrame(() => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      this.scrollProgress = height > 0 ? (winScroll / height) * 100 : 0;

      const scrollThreshold = 50;
      const headerEl = this.headerElement.nativeElement;
      const contentEl = this.contentElement.nativeElement;

      if (winScroll > scrollThreshold && !this.isHeaderScrolled) {
        this.isHeaderScrolled = true;
        if (headerEl) {
          this.renderer.addClass(headerEl, 'scrolled');
        }

        if (contentEl && this.headerPlaceholderHeight > 0) {
          this.renderer.setStyle(contentEl, 'padding-top', `${this.headerPlaceholderHeight}px`);
        }
      } else if (winScroll <= scrollThreshold && this.isHeaderScrolled) {
        this.isHeaderScrolled = false;
        if (headerEl) {
          this.renderer.removeClass(headerEl, 'scrolled');
        }

        if (contentEl) {
          this.renderer.removeStyle(contentEl, 'padding-top');
        }
      }

      this.scrollHandlerTimeout = null;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isAccountMenuOpen) {
      const accountMenuElement = document.querySelector('.account-dropdown');
      const accountToggle = document.querySelector('.user-icon-button');

      if (accountMenuElement &&
          accountToggle &&
          !accountMenuElement.contains(event.target as Node) &&
          !accountToggle.contains(event.target as Node)) {
        this.isAccountMenuOpen = false;
      }
    }

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
    if (event.key === 'Escape') {
      let stateChanged = false;

      if (this.isSearchOpen) {
        this.isSearchOpen = false;
        stateChanged = true;
      }

      if (this.isAccountMenuOpen) {
        this.isAccountMenuOpen = false;
        stateChanged = true;
      }

      if (this.isMobileMenuOpen) {
        this.isMobileMenuOpen = false;
        document.body.classList.remove('menu-open');
        stateChanged = true;
      }

      if (this.isMessagePanelOpen) {
        this.isMessagePanelOpen = false;
        stateChanged = true;
      }
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    if (this.isMobileMenuOpen) {
      this.isSearchOpen = false;
      this.isAccountMenuOpen = false;
      this.isMessagePanelOpen = false;
      document.body.classList.add('menu-open');

      setTimeout(() => {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
          const element = link as HTMLElement;
          element.style.transitionDelay = `${Math.min(index * 30, 300)}ms`;
          element.classList.add('animated');
        });
      }, 50);
    } else {
      document.body.classList.remove('menu-open');

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
      event.stopPropagation();
    }
    this.isSearchOpen = !this.isSearchOpen;

    if (this.isSearchOpen) {
      if (this.isAccountMenuOpen) {
        this.isAccountMenuOpen = false;
      }
      if (this.isMobileMenuOpen) {
        this.isMobileMenuOpen = false;
        document.body.classList.remove('menu-open');
      }
      if (this.isMessagePanelOpen) {
        this.isMessagePanelOpen = false;
      }
    }
  }

  toggleMessages(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.isMessagePanelOpen = !this.isMessagePanelOpen;

    if (this.isMessagePanelOpen) {
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

  onSearchSubmit(searchText: string): void {
    console.log('Search submitted:', searchText);
    this.isSearchOpen = false;
  }

  onSearchClose(): void {
    this.isSearchOpen = false;
  }

  onMessagesPanelClose(): void {
    this.isMessagePanelOpen = false;
  }

  onNavItemMouseEnter(navItem: string): void {
    if (this.hoveredNavItem !== navItem) {
      this.hoveredNavItem = navItem;
      window.requestAnimationFrame(() => {
        this.updateIndicator();
      });
    }
  }

  onNavItemMouseLeave(): void {
    if (this.hoveredNavItem !== null) {
      this.hoveredNavItem = null;
      window.requestAnimationFrame(() => {
        this.updateIndicator();
      });
    }
  }

  setActiveNavItem(navItem: string): void {
    if (this.activeNavItem !== navItem) {
      this.activeNavItem = navItem;
      window.requestAnimationFrame(() => {
        this.updateIndicator();
      });

      if (this.isMobileMenuOpen) {
        this.isMobileMenuOpen = false;
        document.body.classList.remove('menu-open');
      }
    }
  }

  updateIndicator(): void {
    if (!this.navItems || this.navItems.length === 0) return;

    const currentItem = this.hoveredNavItem || this.activeNavItem;

    let activeIndex = -1;
    this.navItems.forEach((item, index) => {
      const el = item.nativeElement;
      if (el.classList.contains('nav-link') && el.textContent.trim().includes(currentItem)) {
        activeIndex = index;
      }
    });

    if (activeIndex >= 0) {
      const element = this.navItems.toArray()[activeIndex].nativeElement;
      const newLeft = `${element.offsetLeft}px`;
      const newWidth = `${element.offsetWidth}px`;

      if (this.indicatorStyle.left !== newLeft || this.indicatorStyle.width !== newWidth) {
        this.indicatorStyle = {
          left: newLeft,
          width: newWidth
        };
      }
    }
  }

  setAuthenticationState(isAuthenticated: boolean): void {
    if (this.isAuthenticated !== isAuthenticated) {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.userId = this.jwtService.getUserId();
      } else {
        this.userId = null;
      }
    }
  }
}
