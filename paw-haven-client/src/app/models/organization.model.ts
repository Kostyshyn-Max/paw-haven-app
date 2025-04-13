import { PetCard } from './pet-card.model';

export interface Organization {
  id: string;
  name: string;
  description?: string;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
  ownerId?: string;
  petCards?: PetCard[];
} 