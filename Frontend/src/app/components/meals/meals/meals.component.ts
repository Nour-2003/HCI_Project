import { Component } from '@angular/core';
import { MealCardComponent } from "../meal-card/meal-card.component";

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [MealCardComponent],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.css'
})
export class MealsComponent {

}
