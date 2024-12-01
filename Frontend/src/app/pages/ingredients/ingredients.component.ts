import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [NgFor, CommonModule, FormsModule],
  templateUrl: './ingredients.component.html',
  styleUrl: './ingredients.component.css',
})
export class IngredientsComponent {
  cookTime: string = '30 Min';
  mealLevel: string = 'Easy';
  mealCalories: string = '150';
  mealServings: string = '4';
  mealSpecialTags: string[] = ['Dinner', 'Lunch', 'Italian'];
  recipeName: string = 'Spaghetti Bolognese';
  chefName: string = 'Chef John';
  recipedoc: string = ' Hello friends i wanted to share this with you ;)';
  recipeImage: string =
    'https://i.dailymail.co.uk/1s/2019/11/05/19/20638190-7652901-image-m-35_1572981254783.jpg';
  recipeIngredients: { ingredient: string; quantity: string }[] = [
    { ingredient: 'Spaghetti', quantity: '200g' },
    { ingredient: 'Minced meat', quantity: '500g' },
    { ingredient: 'Onion', quantity: '1, chopped' },
    { ingredient: 'Garlic', quantity: '2 cloves, minced' },
    { ingredient: 'Tomato sauce', quantity: '400ml' },
    { ingredient: 'Olive oil', quantity: '2 tbsp' },
    { ingredient: 'Salt', quantity: 'to taste' },
    { ingredient: 'Pepper', quantity: 'to taste' },
  ];
  recipeInstructions: string[] = [
    'Heat olive oil in a pan over medium heat.',
    'Add chopped onions and minced garlic to the pan.',
    'Add minced meat to the pan and cook until browned.',
    'Add tomato sauce to the pan and stir well.',
    'Season with salt and pepper to taste.',
    'Cook spaghetti according to package instructions.',
    'Serve spaghetti with bolognese sauce on top.',
  ];
  currentStep: number = 0;
  comments: { name: string; text: string; time: string; likes: number }[] = [
    {
      name: 'Max William',
      text: 'It’s really the best recipe I’ve ever met!',
      time: '2h',
      likes: 22,
    },
    {
      name: 'Jane Doe',
      text: 'Delicious, will definitely try this!',
      time: '3h',
      likes: 15,
    },
  ];
  newComment: string = '';

  addComment(): void {
    if (this.newComment.trim()) {
      this.comments.push({
        name: 'Anonymous',
        text: this.newComment,
        time: 'Just now',
        likes: 0,
      });
      this.newComment = ''; // Clear the input field
    }
  }
  startCook(): void {
    this.startTimer();
  }

  nextStep(): void {
    if (this.currentStep < this.recipeInstructions.length - 1) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  time: string = '00:00'; // Timer in minutes:seconds
  isPaused: boolean = false; // Pause state
  timerInterval: any; // Timer interval reference
  timeInSeconds: number = 0; // Timer in seconds
  circumference: number = 2 * Math.PI * 54; // Circumference of the circle (radius = 54)
  dashOffset: number = this.circumference; // Start with full circle
  maxTimeInSeconds: number = 100; // Maximum time in seconds for the timer

  ngOnInit(): void {}

  startTimer(): void {
    this.timeInSeconds = 0;
    this.updateTime();
    this.timerInterval = setInterval(() => {
      if (!this.isPaused && this.timeInSeconds < this.maxTimeInSeconds) {
        this.timeInSeconds++;
        this.updateTime();
        this.updateProgress();
      } else if (this.timeInSeconds >= this.maxTimeInSeconds) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  updateTime(): void {
    const minutes: number = Math.floor(this.timeInSeconds / 60);
    const seconds: number = this.timeInSeconds % 60;
    this.time = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  updateProgress(): void {
    this.dashOffset =
      this.circumference -
      (this.timeInSeconds / this.maxTimeInSeconds) * this.circumference;
  }

  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
