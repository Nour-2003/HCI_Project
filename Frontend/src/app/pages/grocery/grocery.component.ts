import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./grocery.component.css'],
})
export class GroceryComponent implements OnInit {
  weekDays: string[] = [];
  currentMonth: string = '';
  currentYear: number = 0;
  currentDay: number = 0;
  calendarDays: (number | null)[][] = []; // Updated to allow null for empty days

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

  ngOnInit() {
    this.setCurrentDate();
    this.generateCalendar();
  }

  setCurrentDate() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.toLocaleString('default', { month: 'long' }); // Gets current month name
    this.currentDay = today.getDate();

    // Define the days of the week dynamically based on locale
    this.weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }

  generateCalendar() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create a 2D array (calendarDays) to represent the month
    this.calendarDays = [];
    let week: (number | null)[] = [];

    // Fill in the first empty days (before the 1st day of the month)
    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push(null); // Empty slot represented by null
    }

    // Fill in the actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        this.calendarDays.push(week);
        week = [];
      }
    }

    // Push the last incomplete week, if any
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null); // Fill remaining empty slots with null
      }
      this.calendarDays.push(week);
    }
  }
}
