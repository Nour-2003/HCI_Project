import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css'],
})
export class IngredientsComponent implements OnInit {
  cookTime: string = '';
  mealLevel: string = '';
  mealCalories: string = '';
  mealServings: string = '';
  mealSpecialTags: string[] = [];
  recipeName: string = '';
  chefName: string = '';
  recipedoc: string = '';
  recipeImage: string = '';
  recipeIngredients: { ingredient: string; quantity: string }[] = [];
  recipeInstructions: string[] = [];
  comments: any[] = [];
  
  recipeId: string = '';
  newComment: string = '';
  chefId: number = 0;

  // Timer-related properties
  time: string = '00:00';
  isPaused: boolean = false;
  timerInterval: any;
  timeInSeconds: number = 0;
  circumference: number = 2 * Math.PI * 54;
  dashOffset: number = this.circumference;
  maxTimeInSeconds: number = 100;
  user: any = null;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get('id')!;
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
    // Fetch recipe data from the backend
    this.http
      .get<any>(`http://localhost:8080/recipe/${this.recipeId}`)
      .subscribe(
        (response) => {
          if (response.status === 'SUCCESS') {
            const data = response.data;

            // Populate component properties with recipe data
            this.recipeName = data.title;
            this.recipeImage = data.imageURL;
            this.cookTime = `${data.cooktime} min`;
            this.mealLevel = data.level;
            this.mealCalories = `${data.calories} `;
            this.mealServings = `${data.serves} servings`;
            this.mealSpecialTags = data.specialTag.split(',');
            this.chefName = data.chef.username;
            this.chefId = data.chef._id;
            this.recipedoc = 'Recipe document here...'; // Placeholder
            this.recipeIngredients = data.ingredients.map(
              (ingredient: any) => ({
                ingredient: ingredient.name,
                quantity: `${ingredient.quantity} ${ingredient.unit}`,
              })
            );
            this.recipeInstructions = data.steps;
            this.comments = data.comments;
          }
          console.log('Recipe data:', response);
        },
        (error) => {
          console.error('Error fetching recipe data', error);
        }
      );
  }

  // Start the timer for cooking
  startCook(): void {
    this.startTimer();
  }

  // Timer functionality
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

  // Add comment functionality
  addComment(): void {
    if (this.newComment.trim() && this.user) {
      const commentData = {
        content: this.newComment,
        author: this.user.id, // Send the user ID to the backend
      };
  
      this.http
        .post<any>(`http://localhost:8080/comment/${this.recipeId}`, commentData)
        .subscribe(
          (response) => {
            if (response.message === 'Comment added successfully.') {
              const newComment = response.comment;
  
              // Add the new comment with the correct structure
              this.comments.push({
                author: {
                  username: newComment.author.username,
                  profilePictureURL: newComment.author.profilePictureURL || '', // Fallback if not provided
                },
                content: newComment.content,
                time: 'Just now', // You can update this with a proper time from the backend if available
                likes: 0, // Initial likes count
              });
  
              this.newComment = ''; // Clear the input field
            }
          },
          (error) => {
            console.error('Error adding comment:', error);
          }
        );
    } else {
      console.warn('Comment content or user data is missing.');
    }
  }
  

  // Handling the cooking steps
  currentStep: number = 0;
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
}
