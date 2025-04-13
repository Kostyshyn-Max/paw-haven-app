import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrganisationCategory } from '../models/organisation-category.model';
import { Organization } from '../models/organization.model';
import { PetCard } from '../models/pet-card.model';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<OrganisationCategory[]> {
    return this.http.get<OrganisationCategory[]>(`${this.API_URL}/organisation/categories`);
  }

  getOrganisations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.API_URL}/api/organisation`);
  }

  getOrganisationById(id: string): Observable<Organization> {
    return this.http.get<Organization>(`${this.API_URL}/api/organisation/${id}`);
  }

  createOrganisation(organisation: any): Observable<number> {
    return this.http.post<number>(`${this.API_URL}/api/organisation`, organisation);
  }

  getPetCardsByUserId(userId: string): Observable<PetCard[]> {
    return this.http.get<PetCard[]>(`${this.API_URL}/api/petcard/user/${userId}`);
  }
} 