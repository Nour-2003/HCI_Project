import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [CommonModule,NgFor],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.css',
})
export class MealsComponent {
  meals = [
    { mealType: 'Breakfast', mealName: 'Scrambled Eggs' },
    { mealType: 'Lunch', mealName: 'Chicken Salad' },
    { mealType: 'Dinner', mealName: 'Grilled Salmon' },
  ];
}
