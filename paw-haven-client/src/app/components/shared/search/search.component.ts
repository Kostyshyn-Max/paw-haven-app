import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges, OnChanges, HostListener, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnChanges, AfterViewInit, OnInit {
  @Input() isOpen: boolean = false;
  @Output() searchSubmit = new EventEmitter<string>();
  @Output() searchClose = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchPanel') searchPanel!: ElementRef<HTMLDivElement>;
  
  searchText: string = '';
  isMobileView: boolean = false;
  windowWidth: number = 0;
  
  ngOnInit(): void {
    this.checkScreenSize();
  }
  
  ngAfterViewInit(): void {
    // Просто щоб переконатися, що компонент правильно ініціалізується
    console.log('SearchComponent initialized');
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      console.log('Search isOpen changed:', this.isOpen);
      if (this.isOpen) {
        // Затримка для вирішення проблеми з DOM rendering
        setTimeout(() => {
          if (this.searchInput?.nativeElement) {
            this.searchInput.nativeElement.focus();
            console.log('Focus set on search input');
          }
        }, 300);
      }
    }
  }
  
  // Відслідковуємо розмір вікна
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
  
  // Перевіряємо розмір екрану
  private checkScreenSize(): void {
    this.windowWidth = window.innerWidth;
    this.isMobileView = window.innerWidth <= 768;
  }
  
  // Змінено логіку визначення зовнішнього кліку
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    // Перевіряємо клік поза пошуковою панеллю
    if (this.isOpen && 
        this.searchPanel && 
        !this.searchPanel.nativeElement.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.search-button')) { // Ігноруємо кліки на кнопку пошуку
      console.log('Click outside search panel');
      this.closeSearch();
    }
  }
  
  onSearch(): void {
    if (this.searchText.trim()) {
      console.log('Search submitted:', this.searchText);
      this.searchSubmit.emit(this.searchText);
      // На мобільних пристроях закриваємо пошук після відправки
      if (this.isMobileView) {
        setTimeout(() => this.closeSearch(), 300);
      } else {
        this.searchText = '';
      }
    }
  }
  
  closeSearch(): void {
    this.searchText = '';
    console.log('Search closed');
    this.searchClose.emit();
  }
}