import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Meal {
  type: string;
  name: string;
  imageUrl: string;
  ingredients: number;
}

@Component({
  selector: 'app-grocery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grocery.component.html',
  styleUrl: './grocery.component.css',
})
export class GroceryComponent {
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  meals: Meal[] = [
    {
      type: 'Breakfast',
      name: 'Oatmeal with fruits',
      imageUrl:
        'https://images.unsplash.com/photo-1517673400267-0251440c45dc?ixlib=rb-4.0.3',
      ingredients: 13,
    },
    {
      type: 'Lunch',
      name: 'Grilled chicken salad',
      imageUrl:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3',
      ingredients: 13,
    },
  ];

  calendarDays = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
    [29, 30, 31, 0, 0, 0, 0],
  ];
}
