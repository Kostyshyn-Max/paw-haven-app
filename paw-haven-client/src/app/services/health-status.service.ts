import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PetHealthStatus } from '../models/pet-card.model';

@Injectable({
  providedIn: 'root'
})
export class HealthStatusService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getHealthStatuses(): Observable<PetHealthStatus[]> {
    return this.http.get<PetHealthStatus[]>(`${this.API_URL}/api/health/statuses`)
  }
}
