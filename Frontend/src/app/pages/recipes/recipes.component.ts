import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RecipeGridComponent } from '../../components/recipe-grid/recipe-grid.component';
import { RecipeCardComponent } from "../../components/recipe-card/recipe-card.component";

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [RecipeGridComponent, RecipeCardComponent,CommonModule,NgFor],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
})
export class RecipesComponent {
  recipes = [
    {
      title: 'Blueberry Pancakes',
      imageUrl:
        'https://i.dailymail.co.uk/1s/2019/11/05/19/20638190-7652901-image-m-35_1572981254783.jpg',
      prepTime: '30 min',
      difficulty: 'Easy',
      likes: '1.7K',
    },
    {
      title: 'Blueberry Pancakes',
      imageUrl:
        'https://i.dailymail.co.uk/1s/2019/11/05/19/20638190-7652901-image-m-35_1572981254783.jpg',
      prepTime: '30 min',
      difficulty: 'Easy',
      likes: '1.7K',
    },
    {
      title: 'Blueberry Pancakes',
      imageUrl:
        'https://i.dailymail.co.uk/1s/2019/11/05/19/20638190-7652901-image-m-35_1572981254783.jpg',
      prepTime: '30 min',
      difficulty: 'Easy',
      likes: '1.7K',
    },
    {
      title: 'Blueberry Pancakes',
      imageUrl:
        'https://i.dailymail.co.uk/1s/2019/11/05/19/20638190-7652901-image-m-35_1572981254783.jpg',
      prepTime: '30 min',
      difficulty: 'Easy',
      likes: '1.7K',
    },
  ];
}
