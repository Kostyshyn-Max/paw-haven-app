import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PetType } from '../models/pet-card.model';

@Injectable({
  providedIn: 'root'
})
export class PetTypeService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTypes(): Observable<PetType[]> {
    return this.http.get<PetType[]>(`${this.API_URL}/api/pet/types`);
  }
}
