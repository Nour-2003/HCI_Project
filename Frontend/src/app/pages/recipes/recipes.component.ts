import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeGridComponent } from '../../components/recipe-grid/recipe-grid.component';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { HttpClientModule } from '@angular/common/http';

interface Recipe {
  title: string;
  imageURL: string | null;
  cooktime: number;
  level: string;
  _id: number;
}

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    RecipeGridComponent,
    RecipeCardComponent,
    CommonModule,
    NgFor,
    HttpClientModule,
  ],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  recipes: {
    title: string;
    imageUrl: string;
    prepTime: string;
    difficulty: string;
    likes: string;
    RecipeId: number;
  }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<{ status: string; data: Recipe[] }>('http://localhost:8080/recipe/')
      .subscribe((response) => {
        if (response.status === 'SUCCESS') {
          this.recipes = response.data.map((recipe: Recipe) => ({
            title: recipe.title,
            imageUrl:
              recipe.imageURL ||
              'https://i.dailymail.co.uk/1s/2019/11/05/19/20638190-7652901-image-m-35_1572981254783.jpg',
            prepTime: `${recipe.cooktime} min`,
            difficulty: recipe.level,
            likes: '0',
            RecipeId: recipe._id,
          }));
        }
      });
  }
}