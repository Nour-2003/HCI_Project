import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


interface Meal {
  type: string;
  name: string;
}

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [CommonModule,NgFor,HttpClientModule,RouterModule],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.css',
})

export class MealsComponent implements OnInit {
  constructor(private userService: UserService, private http: HttpClient) {}
  user: any = null;

  meals: Meal[] = [];
  ngOnInit() {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });

    this.fetchMeals();
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
        .sort((a, b) => mealOrder.indexOf(a.key) - mealOrder.indexOf(b.key))
        .map((meal) => ({
          type: meal.key,
          name: meal.recipe.title,
        }));
  
    });
  }
}
