import { Component } from '@angular/core';
import { MealsComponent } from "../../components/meals/meals.component";
import { ChefListComponent } from "../../components/chef-list/chef-list.component";
import { RecipeCardComponent } from "../../components/recipe-card/recipe-card.component";
import { CommonModule } from '@angular/common';
import {HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeaderComponent, MealsComponent, ChefListComponent, RecipeCardComponent, CommonModule, HeaderComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  trendingMeals = [
    {
      title: 'Blueberry Pancakes',
      imageUrl: 'https://i.dailymail.co.uk/1s/2019/11/05/19/20638190-7652901-image-m-35_1572981254783.jpg',
      prepTime: '30 min',
      difficulty: 'Easy',
      likes: '1.7K',
    },
    {
      title: 'Blueberry Pancakes',
      imageUrl: 'https://i.dailymail.co.uk/1s/2019/11/05/19/20638190-7652901-image-m-35_1572981254783.jpg',
      prepTime: '30 min',
      difficulty: 'Easy',
      likes: '1.7K',
    },
    {
      title: 'Blueberry Pancakes',
      imageUrl: 'https://i.dailymail.co.uk/1s/2019/11/05/19/20638190-7652901-image-m-35_1572981254783.jpg',
      prepTime: '30 min',
      difficulty: 'Easy',
      likes: '1.7K',
    },
    {
      title: 'Blueberry Pancakes',
      imageUrl: 'https://i.dailymail.co.uk/1s/2019/11/05/19/20638190-7652901-image-m-35_1572981254783.jpg',
      prepTime: '30 min',
      difficulty: 'Easy',
      likes: '1.7K',
    },
  ];
}
