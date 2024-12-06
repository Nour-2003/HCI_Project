import { Component } from '@angular/core';
import { MealsComponent } from '../../components/meals/meals.component';
import { ChefListComponent } from '../../components/chef-list/chef-list.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { RecipesComponent } from '../recipes/recipes.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeaderComponent,
    MealsComponent,
    ChefListComponent,
    CommonModule,
    HttpClientModule,
    RecipesComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {}
