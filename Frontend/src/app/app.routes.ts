import { Routes } from "@angular/router";
import { HomePageComponent } from "./home-page/home-page.component";
import { IngredientsComponent } from "./ingredients/ingredients.component";
import { RecipesComponent } from "./recipes/recipes.component";

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomePageComponent },
  { path: "ingredients", component: IngredientsComponent },
  { path: "recipes", component: RecipesComponent },
  // { path: "**", component: PageNotFoundComponent },
];
