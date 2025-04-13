import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paw-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paw-loader.component.html',
  styleUrl: './paw-loader.component.scss'
})
export class PawLoaderComponent {
  @Input() message: string = 'Завантаження...';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
}
