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

export interface PetType {
  id: number;
  title: string;
}

export interface PetCardCreateData {
  name: string;
  age: number;
  desciption: string;
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
