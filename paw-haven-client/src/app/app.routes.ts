import { Routes } from '@angular/router';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { HomeComponent } from './components/home/home.component';
import { PetCardFormComponent } from './components/pet-card-form/pet-card-form.component';
import { PetDetailsComponent } from './components/pet-details/pet-details.component';
import { PetsComponent } from './components/pets/pets.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { OrganisationService } from './services/organisation.service';
import { OrganisationsComponent } from './components/organisations/organisations.component';
import { OrganisationDetailsComponent } from './components/organisation-details/organisation-details.component';

export const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'home', component: HomeComponent },
  { path: 'pets', component: PetsComponent },
  { path: 'pets/add', component: PetCardFormComponent },
  { path: 'pets/:id', component: PetDetailsComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'profile/edit/:id', component: EditProfileComponent },
  { path: 'organisation', component: OrganisationsComponent },
  { path: 'organisation/:id', component: OrganisationDetailsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
