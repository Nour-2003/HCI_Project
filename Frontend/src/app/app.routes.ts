import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { IngredientsComponent } from './pages/ingredients/ingredients.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { LoginComponent } from './pages/login/login.component';
import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { GroceryComponent } from './pages/grocery/grocery.component';
import { RegisterComponent } from './pages/register/register.component';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { AboutmeComponent } from './pages/aboutme/aboutme.component';
import { UserprofileComponent } from './pages/userprofile/userprofile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'ingredients/:id', component: IngredientsComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mainpage', component: MainpageComponent },
  { path: 'grocery', component: GroceryComponent },
  { path: 'recipeform', component: RecipeFormComponent },
  { path: 'userprofile/:id', component: UserprofileComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      { path: 'recipes/:userId', component: RecipesComponent },
      { path: 'aboutme', component: AboutmeComponent },
    ],
  },
];
