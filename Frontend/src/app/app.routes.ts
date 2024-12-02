import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { IngredientsComponent } from './pages/ingredients/ingredients.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { LoginComponent } from './pages/login/login.component';
import { MainpageComponent } from './pages/mainpage/mainpage.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'ingredients', component: IngredientsComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'login', component: LoginComponent },
  {path: 'mainpage', component:MainpageComponent}
  // { path: "**", component: PageNotFoundComponent },
];
