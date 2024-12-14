import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';


import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface Meal {
  type: string;
  name: string;
  imageUrl: string;
  ingredients: Ingredient[];
}

@Component({
  selector: 'app-grocery',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './grocery.component.html',
  styleUrls: ['./grocery.component.css'],
  animations: [
    trigger('slideInOut', [
      state(
        'true',
        style({
          height: '*',
          opacity: 1,
          visibility: 'visible',
        })
      ),
      state(
        'false',
        style({
          height: '0',
          opacity: 0,
          visibility: 'hidden',
        })
      ),
      transition('false <=> true', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class GroceryComponent implements OnInit {
  constructor(private userService: UserService, private http: HttpClient) {}
  user: any = null;

  weekDays: string[] = [];
  currentMonth: string = '';
  currentYear: number = 0;
  currentDay: number = 0;
  calendarDays: (number | null)[][] = [];
  meals: Meal[] = [];

  expandedMealIndex: number | null = null; // Tracks which meal is expanded
  checkedIngredients: boolean[][] = []; // Tracks the checked status for each meal

  ngOnInit() {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
    this.setCurrentDate();
    this.generateCalendar();
    this.fetchMeals();

    // Initialize the checkedIngredients array for all meals
    this.checkedIngredients = this.meals.map((meal) =>
      new Array(meal.ingredients.length).fill(false)
    );
  }

  setCurrentDate() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.toLocaleString('default', { month: 'long' });
    this.currentDay = today.getDate();

    this.weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }

  generateCalendar() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.calendarDays = [];
    let week: (number | null)[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        this.calendarDays.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      this.calendarDays.push(week);
    }
  }

  toggleIngredients(index: number) {
    this.expandedMealIndex = this.expandedMealIndex === index ? null : index;
  }

  getCheckedCount(mealIndex: number): number {
    return this.checkedIngredients[mealIndex].filter((checked) => checked)
      .length;
  }

  isAllChecked(mealIndex: number): boolean {
    return this.checkedIngredients[mealIndex].every((checked) => checked);
  }

  updateIngredientStatus() {
    console.log('Ingredient status updated');
  }

  fetchMeals() {
    if (!this.user) {
      return;
    }
    const userId = this.user.id;
    const url = `http://localhost:8080/user/${userId}/meals`;
  
    this.http.get<{ meals: any[] }>(url).subscribe((response) => {
      const mealOrder = ['Breakfast', 'Lunch', 'Dinner'];
  
      this.meals = response.meals
        .sort((a, b) => mealOrder.indexOf(a.key) - mealOrder.indexOf(b.key)) // Sort based on mealOrder
        .map((meal) => ({
          type: meal.key,
          name: meal.recipe.title,
          imageUrl: meal.recipe.imageURL,
          ingredients: meal.recipe.ingredients.map((ingredient: any) => ({
            name: ingredient.name,
            amount: ingredient.quantity,
            unit: ingredient.unit,
          })),
        }));
  
      // Initialize the checkedIngredients array for fetched meals
      this.checkedIngredients = this.meals.map((meal) =>
        new Array(meal.ingredients.length).fill(false)
      );
    });
  }
  
}
