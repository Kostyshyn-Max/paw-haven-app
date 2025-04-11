import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { SearchComponent } from '../search/search.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, SearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle search panel when toggleSearch is called', () => {
    expect(component.isSearchOpen).toBeFalse();
    component.toggleSearch();
    expect(component.isSearchOpen).toBeTrue();
    component.toggleSearch();
    expect(component.isSearchOpen).toBeFalse();
  });

  it('should close search panel when onSearchClose is called', () => {
    component.isSearchOpen = true;
    component.onSearchClose();
    expect(component.isSearchOpen).toBeFalse();
  });

  it('should close search panel when onSearchSubmit is called', () => {
    component.isSearchOpen = true;
    component.onSearchSubmit('test search');
    expect(component.isSearchOpen).toBeFalse();
  });

  it('should toggle mobile menu when toggleMobileMenu is called', () => {
    expect(component.isMobileMenuOpen).toBeFalse();
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBeTrue();
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBeFalse();
  });

  it('should close search panel when mobile menu is opened', () => {
    component.isSearchOpen = true;
    component.toggleMobileMenu();
    expect(component.isSearchOpen).toBeFalse();
  });
});
