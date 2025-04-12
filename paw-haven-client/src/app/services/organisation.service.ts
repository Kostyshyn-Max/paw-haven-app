import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrganisationCategory } from '../models/organisation-category.model';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<OrganisationCategory[]> {
    return this.http.get<OrganisationCategory[]>(`${this.API_URL}/organisation/categories`);
  }
} 