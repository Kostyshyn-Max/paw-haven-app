import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PetCard } from '../models/pet-card.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PetCardService {
  private apiUrl = `${environment.apiUrl}/api/petcard`;

  constructor(private http: HttpClient) { }

  getFeaturedPetCards(limit: number = 6): Observable<PetCard[]> {
    return this.http.get<PetCard[]>(`${this.apiUrl}`);
  }

  getAllPetCards(page: number = 1, pageSize: number = 12): Observable<PetCard[]> {
    return this.http.get<PetCard[]>(`${this.apiUrl}`);
  }

  getPetCardById(id: number): Observable<PetCard> {
    return this.http.get<PetCard>(`${this.apiUrl}/${id}`);
  }

  searchPetCards(searchParams: any): Observable<PetCard[]> {
    const params = new URLSearchParams();
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key]) {
        params.append(key, searchParams[key]);
      }
    });
    return this.http.get<PetCard[]>(`${this.apiUrl}?${params.toString()}`);
  }

  getUserPetCards(userId: string): Observable<PetCard[]> {
    console.log(`Requesting pet cards for user ID: ${userId} using direct API endpoint`);
    
    return this.http.get<PetCard[]>(`${this.apiUrl}/user/${userId}`).pipe(
      tap(cards => console.log('User-specific pet cards response:', cards)),
      catchError(err => {
        console.error('Error fetching user pet cards from API:', err);
        
        return this.getAllPetCards().pipe(
          tap(allCards => console.log('Fallback: got all cards, filtering client-side')),
          map(allCards => allCards.filter(card => card.ownerId === userId)),
          tap(filteredCards => console.log('Filtered cards by owner:', filteredCards))
        );
      })
    );
  }
}