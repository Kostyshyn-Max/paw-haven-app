import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PetCardFormComponent } from './components/pet-card-form/pet-card-form.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

export const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'home', component: HomeComponent },
  { path: 'pet/add', component: PetCardFormComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
