import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PetCardCreateData } from '../models/pet-card.model';

@Injectable({
  providedIn: 'root'
})
export class PetCardAddService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  addPetCard(petCardData: PetCardCreateData): Observable<boolean> {
    const formData = this.convertToFormData(petCardData)

    petCardData.photos.forEach((photo: File) => {
      formData.append('photos', photo);
    });

    return this.http.post<boolean>(`${this.apiUrl}/api/petcard`, formData);
  }

  convertToFormData(data: PetCardCreateData): FormData {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('age', data.age.toString());
    formData.append('desciption', data.desciption);
    formData.append('location', data.location);
    formData.append('health', data.health);
    formData.append('gender', data.gender);
    formData.append('healthStatusId', data.healthStatusId.toString());
    formData.append('petTypeId', data.petTypeId.toString());

    return formData;
  }
}
