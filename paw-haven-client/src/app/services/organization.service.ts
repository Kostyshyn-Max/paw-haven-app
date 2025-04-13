import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization } from '../models/organization.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = `${environment.apiUrl}/organizations`;

  constructor(private http: HttpClient) { }

  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.apiUrl);
  }

  getOrganizationById(id: string): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/${id}`);
  }
} 