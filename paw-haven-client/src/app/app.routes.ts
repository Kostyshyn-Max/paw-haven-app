import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PetsComponent } from './components/pets/pets.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';


export const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'home', component: HomeComponent },
  { path: 'pets', component: PetsComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/edit/:id', component: EditProfileComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
