import { NgFor } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-ingredients",
  standalone: true,
  imports: [NgFor],
  templateUrl: "./ingredients.component.html",
  styleUrl: "./ingredients.component.css",
})
export class IngredientsComponent {
  recipeName: string = "Spaghetti Bolognese";
  chefName: string = "Chef John";
  recipedoc: string = " Hello friends i wanted to share this with you ;)";
  recipeImage: string =
    "https://i.dailymail.co.uk/1s/2019/11/05/19/20638190-7652901-image-m-35_1572981254783.jpg";
  recipeIngredients: { ingredient: string; quantity: string }[] = [
    { ingredient: "Spaghetti", quantity: "200g" },
    { ingredient: "Minced meat", quantity: "500g" },
    { ingredient: "Onion", quantity: "1, chopped" },
    { ingredient: "Garlic", quantity: "2 cloves, minced" },
    { ingredient: "Tomato sauce", quantity: "400ml" },
    { ingredient: "Olive oil", quantity: "2 tbsp" },
    { ingredient: "Salt", quantity: "to taste" },
    { ingredient: "Pepper", quantity: "to taste" },
  ];
}
