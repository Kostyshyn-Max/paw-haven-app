export interface PetCard {
  id: number;
  name: string;
  age: number;
  location: string;
  petPhoto: {
    petPhotoLink: string;
  };
  petType: {
    id: number;
    title: string;
  };
}