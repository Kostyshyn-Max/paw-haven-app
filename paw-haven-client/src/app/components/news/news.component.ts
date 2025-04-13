import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PawLoaderComponent } from '../shared/paw-loader/paw-loader.component';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  date: Date;
  author: string;
  category: string;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterLink, PawLoaderComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {
  newsItems: NewsItem[] = [];
  featuredNews: NewsItem | null = null;
  isLoading = true;
  errorMessage = '';
  categories: string[] = ['Всі', 'Новини', 'Оголошення', 'Поради', 'Історії'];
  selectedCategory: string = 'Всі';
  filteredNews: NewsItem[] = [];

  constructor() {}

  ngOnInit(): void {
    // Simulate loading news data
    setTimeout(() => {
      this.loadNewsItems();
      this.isLoading = false;
    }, 1000);
  }

  loadNewsItems(): void {
    // Mock data - in a real application, this would come from a service
    this.newsItems = [
      {
        id: 1,
        title: 'Відкриття нового притулку для тварин у Київській області',
        summary: 'Новий притулок здатний прихистити до 200 тварин та обладнаний сучасною ветеринарною клінікою.',
        content: 'Повний текст статті про відкриття нового притулку...',
        imageUrl: 'assets/images/news/shelter.jpeg',
        date: new Date('2025-04-10'),
        author: 'Анна Коваленко',
        category: 'Новини'
      },
      {
        id: 2,
        title: 'Допоможіть врятувати цуценят, знайдених у коробці біля дороги',
        summary: 'П\'ятеро цуценят терміново потребують фінансової допомоги для лікування та тимчасової перетримки.',
        content: 'Повний текст оголошення про порятунок цуценят...',
        imageUrl: 'assets/images/news/dog.jpeg',
        date: new Date('2025-04-08'),
        author: 'Михайло Петренко',
        category: 'Оголошення'
      },
      {
        id: 3,
        title: 'Як правильно адаптувати кота до нового дому: поради ветеринара',
        summary: 'Професійні рекомендації, які допоможуть вашому новому улюбленцю швидше звикнути до нового оточення.',
        content: 'Повний текст статті з порадами щодо адаптації котів...',
        imageUrl: 'assets/images/news/cat.jpeg',
        date: new Date('2025-04-05'),
        author: 'Дарина Ковальчук',
        category: 'Поради'
      },
      {
        id: 4,
        title: 'Історія Барні: від вуличного пса до службового собаки',
        summary: 'Неймовірна історія перетворення безпритульного собаки на професійного рятувальника.',
        content: 'Повний текст історії про Барні...',
        imageUrl: 'assets/images/news/dogs.jpeg',
        date: new Date('2025-04-02'),
        author: 'Олег Вишневський',
        category: 'Історії'
      },
      {
        id: 5,
        title: 'Нові законодавчі зміни щодо захисту тварин в Україні',
        summary: 'Верховна Рада ухвалила нові закони, які посилюють відповідальність за жорстоке поводження з тваринами.',
        content: 'Повний текст статті про нове законодавство...',
        imageUrl: 'assets/images/news/love.jpeg',
        date: new Date('2025-03-28'),
        author: 'Юлія Захарченко',
        category: 'Новини'
      },
      {
        id: 6,
        title: 'Благодійний марафон "Біжу за тварин" відбудеться цієї неділі',
        summary: 'Приєднуйтесь до благодійного забігу, щоб зібрати кошти для безпритульних тварин.',
        content: 'Повний текст оголошення про благодійний марафон...',
        imageUrl: 'assets/images/news/meet.jpeg',
        date: new Date('2025-03-25'),
        author: 'Сергій Лисенко',
        category: 'Оголошення'
      }
    ];

    // Set the most recent news item as featured
    this.featuredNews = this.newsItems[0];
    
    // Apply initial filtering
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.selectedCategory === 'Всі') {
      this.filteredNews = [...this.newsItems];
    } else {
      this.filteredNews = this.newsItems.filter(item => 
        item.category === this.selectedCategory
      );
    }
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilter();
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('uk-UA', options);
  }
}