import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PetCard } from '../models/pet-card.model';

@Injectable({
  providedIn: 'root'
})
export class UserFavouritesService {
  private readonly API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  isUserSavedACard(cardId: number) : Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/api/userfavourites/is-card-saved/${cardId}`);
  }

  removeFavourite(petId: number) : Observable<any> {
    return this.http.delete(`${this.API_URL}/api/userfavourites/unlike/${petId}`);
  }

  addFavourite(petId: number) : Observable<any> {
    return this.http.post(`${this.API_URL}/api/userfavourites/like/`, petId);
  }

  getAllFavouriteCardsByUser() : Observable<PetCard[]> {
    return this.http.get<PetCard[]>(`${this.API_URL}/api/userfavourites/get`);
  }
}
