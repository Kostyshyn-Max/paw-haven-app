import { UserProfileModel } from "../services/user.service";

export interface PetCard {
  id: number;
  name: string;
  age: number;
  location: string;
  ownerId?: string;
  petPhoto: {
    petPhotoLink: string;
  };
  petType: PetType
}

export interface PetCardDetails {
  id: number;
  name: string;
  age: number;
  location: string;
  description: string;
  health: string;
  gender: string;
  views: number;
  petType: PetType;
  healthStatus: PetHealthStatus;
  photos: PetPhoto[];
  user: UserProfileModel;
}

export interface PetType {
  id: number;
  title: string;
}

export interface PetPhoto {
  petPhotoLink: string
}

export interface PetCardCreateData {
  name: string;
  age: number;
  description: string;
  location: string;
  health: string;
  gender: string;
  healthStatusId: number;
  petTypeId: number;
  photos: File[];
}

export interface PetHealthStatus {
  id: number;
  title: string;
}

export interface ChangePetCardOwnerModel {
  petCardId: number;
  organisationId: number;
}
