import { Routes } from '@angular/router';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { HomeComponent } from './components/home/home.component';
import { PetCardFormComponent } from './components/pet-card-form/pet-card-form.component';
import { PetsComponent } from './components/pets/pets.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';


export const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'home', component: HomeComponent },
  { path: 'pets', component: PetsComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/edit/:id', component: EditProfileComponent },
  { path: 'pets/add', component: PetCardFormComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
