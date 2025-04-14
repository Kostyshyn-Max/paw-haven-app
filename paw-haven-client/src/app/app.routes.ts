import { Routes } from '@angular/router';
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { HomeComponent } from './components/home/home.component';
import { NewsDetailsComponent } from './components/news-details/news-details.component';
import { NewsComponent } from './components/news/news.component';
import { OrganisationDetailsComponent } from './components/organisation-details/organisation-details.component';
import { OrganisationsComponent } from './components/organisations/organisations.component';
import { PetCardFormComponent } from './components/pet-card-form/pet-card-form.component';
import { PetDetailsComponent } from './components/pet-details/pet-details.component';
import { PetRequestComponent } from './components/pet-request/pet-request.component';
import { PetsStoriesComponent } from './components/pets-stories/pets-stories.component';
import { PetsComponent } from './components/pets/pets.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

export const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'home', component: HomeComponent },
  { path: 'news', component: NewsComponent },
  { path: 'news/:id', component: NewsDetailsComponent },
  { path: 'pets', component: PetsComponent },
  { path: 'pets/add', component: PetCardFormComponent },
  { path: 'pets/:id', component: PetDetailsComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'profile/edit/:id', component: EditProfileComponent },
  { path: 'organisation', component: OrganisationsComponent },
  { path: 'organisation/:id', component: OrganisationDetailsComponent },
  { path: 'blog', component: PetsStoriesComponent },
  { path: 'blog/:id', component: BlogDetailsComponent },
  { path: 'stories', component: PetsStoriesComponent },
  { path: 'pet/request', component: PetRequestComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
