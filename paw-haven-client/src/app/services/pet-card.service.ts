import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

    // return this.http.get<PetCard[]>(`${this.apiUrl}/${page}/${pageSize}`);
    

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
}