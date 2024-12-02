import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RecipeGridComponent } from '../../components/recipe-grid/recipe-grid.component';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [RecipeGridComponent],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
})
export class RecipesComponent {}
