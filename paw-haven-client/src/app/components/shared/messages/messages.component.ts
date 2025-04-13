import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JwtService } from '../../../services/jwt.service';

export interface Chat {
  name: string;
  lastMessage: string;
  lastMessagePostDate: string;
}

@Component({
  selector: 'app-messages',
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() messagesClose = new EventEmitter<void>();

  chats: Chat[] = [];

  ngOnInit(): void {
    if (this.jwtService.getUserId()) {
      this.chats = [
        {
          name: "Paw Haven",
          lastMessage: "Вітаємо на нашій платформі!",
          lastMessagePostDate: '05.04.2025, 14:15'
        },
        {
          name: "Хвостата республіка",
          lastMessage: "Вітаємо! Очікуйте, скоро із вами зв`яжеться менеджер нашої організації.",
          lastMessagePostDate: '12.04.2025, 17:12'
        }
      ]
    }
  }

  constructor (
    private jwtService: JwtService
  )
  {  }

  closePanel(): void {
    this.messagesClose.emit();
  }
}
