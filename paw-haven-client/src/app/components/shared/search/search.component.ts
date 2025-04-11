import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges, OnChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Output() searchSubmit = new EventEmitter<string>();
  @Output() searchClose = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchPanel') searchPanel!: ElementRef<HTMLDivElement>;
  
  searchText: string = '';
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue) {
      setTimeout(() => {
        this.searchInput?.nativeElement?.focus();
      }, 100);
    }
  }
  
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (this.isOpen && 
        this.searchPanel && 
        !this.searchPanel.nativeElement.contains(event.target as Node)) {
      this.closeSearch();
    }
  }
  
  onSearch(): void {
    if (this.searchText.trim()) {
      this.searchSubmit.emit(this.searchText);
      this.searchText = '';
    }
  }
  
  closeSearch(): void {
    this.searchText = '';
    this.searchClose.emit();
  }
} 