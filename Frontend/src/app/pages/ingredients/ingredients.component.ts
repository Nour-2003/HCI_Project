import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css'],
})
export class IngredientsComponent implements OnInit {
  originalRecipeData: any = {};

  isEditing: boolean = false;
  isLiked: boolean = false;
  isFavorited: boolean = false;
  cookTime: string = '';
  mealLevel: string = '';
  mealCalories: string = '';
  mealServings: string = '';
  mealSpecialTags: string[] = [];
  recipeName: string = '';
  chefName: string = '';
  chefimg: string = '';
  recipedoc: string = '';
  recipeImage: string = '';
  recipeIngredients: { ingredient: string; quantity: string }[] = [];
  recipeInstructions: string[] = [];
  comments: any[] = [];

  recipeId: string = '';
  newComment: string = '';
  chefId: number = 0;

  updatedRecipeData: any = {};

  // Timer-related properties
  time: string = '00:00';
  isPaused: boolean = true;
  timerInterval: any;
  timeInSeconds: number = 0;
  circumference: number = 2 * Math.PI * 54;
  dashOffset: number = this.circumference;
  maxTimeInSeconds: number = 100;
  user: any = null;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get('id')!;
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });

    this.userService.getUserDetails().subscribe((userDetails) => {
      // If userDetails is available, check if the recipe is liked
      if (userDetails) {
        this.isLiked = this.userService.isRecipeLiked(this.recipeId);
        this.isFavorited = this.userService.isRecipeFavorited(this.recipeId);
      }
    });
    // Fetch recipe data from the backend
    this.http
      .get<any>(`http://localhost:8080/recipe/${this.recipeId}`)
      .subscribe(
        (response) => {
          if (response.status === 'SUCCESS') {
            const data = response.data;

            // Store original data before editing
            this.originalRecipeData = { ...data };

            // Populate component properties with recipe data
            this.recipeName = data.title;
            this.recipeImage = data.imageURL;
            this.cookTime = data.cooktime;
            this.mealLevel = data.level;
            this.mealCalories = data.calories;
            this.mealServings = data.serves;
            this.mealSpecialTags = data.specialTag.split(',');
            this.chefName = data.chef.username;
            this.chefimg =
              data.chef.profilePictureURL ||
              'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
            this.chefId = data.chef._id;
            this.recipedoc = data.description || 'Recipe document here...';
            this.recipeIngredients = data.ingredients.map(
              (ingredient: any) => ({
                ingredient: ingredient.name,
                quantity: `${ingredient.quantity} ${ingredient.unit}`,
              })
            );
            this.recipeInstructions = data.steps;
            this.comments = data.comments;
            // Convert cookTime to seconds
            this.timeInSeconds = parseInt(this.cookTime) * 60;

            // Update time display initially
            this.updateTime();
          }
        },
        (error) => {
          console.error('Error fetching recipe data', error);
        }
      );
  }

  // Toggle edit mode
  toggleEdit() {
    if (this.isEditing) {
      // Cancel the edit: Revert the fields to the original data
      this.resetForm();
    }
    this.isEditing = !this.isEditing;
  }

  // Reset the form fields to their original values
  resetForm() {
    this.recipeName = this.originalRecipeData.title;
    this.recipeImage = this.originalRecipeData.imageURL;
    this.cookTime = this.originalRecipeData.cooktime;
    this.mealLevel = this.originalRecipeData.level;
    this.mealCalories = this.originalRecipeData.calories;
    this.mealServings = this.originalRecipeData.serves;
    this.mealSpecialTags = this.originalRecipeData.specialTag.split(',');
    this.recipedoc =
      this.originalRecipeData.description || 'Recipe document here...';
    this.recipeIngredients = this.originalRecipeData.ingredients.map(
      (ingredient: any) => ({
        ingredient: ingredient.name,
        quantity: `${ingredient.quantity} ${ingredient.unit}`,
      })
    );
    this.recipeInstructions = this.originalRecipeData.steps;
  }

  // Handle saving the updated recipe
  saveUpdates() {
    const updatedData = {
      title: this.recipeName,
      description: this.recipedoc,
      ingredients: this.recipeIngredients.map((ingredient) => ({
        name: ingredient.ingredient,
        quantity: ingredient.quantity.split(' ')[0], // Extract quantity
        unit: ingredient.quantity.split(' ')[1] || 'g', // Default unit
      })),
      steps: this.recipeInstructions,
      cooktime: this.cookTime,
      level: this.mealLevel,
      calories: this.mealCalories,
      serve: this.mealServings,
      specialTags: this.mealSpecialTags,
    };

    this.http
      .put<any>(`http://localhost:8080/recipe/${this.recipeId}`, updatedData)
      .subscribe(
        (response) => {
          if (response.status === 'SUCCESS') {
            Swal.fire({
              icon: 'success',
              title: 'Recipe updated successfully',
              showConfirmButton: false,
              timer: 1500,
            });
            this.isEditing = false; // Exit edit mode
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error updating recipe',
            text: 'Please try again',
          });

          console.error('Error updating recipe', error);
        }
      );
  }

  // Delete the recipe with confirmation
  deleteRecipe() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http
          .delete<any>(`http://localhost:8080/recipe/${this.recipeId}`)
          .subscribe(
            (response) => {
              if (response.status === 'SUCCESS') {
                Swal.fire(
                  'Deleted!',
                  'Your recipe has been deleted.',
                  'success'
                );
                this.router.navigate([`/profile/recipes/${this.user.id}`]);
              }
            },
            (error) => {
              console.error('Error deleting recipe', error);
              Swal.fire(
                'Error!',
                'There was an error deleting your recipe.',
                'error'
              );
            }
          );
      }
    });
  }

  // Start the timer for cooking
  startCook(): void {
    this.isPaused = false;
    this.startTimer();
    // Scroll to the timer section
    const timerSection = document.getElementById('timer-section');
    if (timerSection) {
      timerSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  //start the timer
  startTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval); // Clear any existing timer
    }

    this.timerInterval = setInterval(() => {
      if (!this.isPaused && this.timeInSeconds > 0) {
        this.timeInSeconds--;
        this.updateTime();
        this.updateProgress();
      } else if (this.timeInSeconds <= 0) {
        clearInterval(this.timerInterval);
        Swal.fire({
          icon: 'success',
          title: 'Time is up!',
          text: 'Your cooking time has completed.',
          showConfirmButton: true,
        });
        // Reset the timer
        this.isPaused = true;
        this.timeInSeconds = parseInt(this.cookTime) * 60;
        this.updateTime();
        this.updateProgress();
      }
    }, 1000);
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
    this.startTimer();
  }

  updateTime(): void {
    const minutes: number = Math.floor(this.timeInSeconds / 60);
    const seconds: number = this.timeInSeconds % 60;
    this.time = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  updateProgress(): void {
    const totalTimeInSeconds = parseInt(this.cookTime) * 60;
    this.dashOffset =
      (this.timeInSeconds / totalTimeInSeconds) * this.circumference;
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
        .post<any>(
          `http://localhost:8080/comment/${this.recipeId}`,
          commentData
        )
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

  toggleLike(): void {
    if (!this.user) {
      Swal.fire({
        icon: 'warning',
        title: 'Please login to like the recipe',
        showConfirmButton: true,
      });
      return;
    }
    const currentUser = this.user;
    if (currentUser) {
      if (this.isLiked) {
        this.unlikeRecipe(currentUser.id);
      } else {
        this.likeRecipe(currentUser.id);
      }
    }
  }
  likeRecipe(userId: string): void {
    const body = { recipeId: this.recipeId };
    this.http
      .post(`http://localhost:8080/user/${userId}/likelist`, body)
      .subscribe(
        (response) => {
          this.isLiked = true;

          // Update the likeList in userDetailsSubject
          const userDetails = this.userService.userDetailsSubject.value;
          if (userDetails) {
            userDetails.likeList = [
              ...(userDetails.likeList || []),
              { _id: this.recipeId },
            ];
            this.userService.setUserDetails(userDetails);
          }
        },
        (error) => {
          console.error('Error liking recipe:', error);
        }
      );
  }

  unlikeRecipe(userId: string): void {
    const body = { recipeId: this.recipeId };
    this.http
      .delete(`http://localhost:8080/user/${userId}/likelist`, { body })
      .subscribe(
        (response) => {
          this.isLiked = false;

          // Update the likeList in userDetailsSubject
          const userDetails = this.userService.userDetailsSubject.value;
          if (userDetails) {
            userDetails.likeList = userDetails.likeList.filter(
              (recipe: any) => recipe._id !== this.recipeId
            );
            this.userService.setUserDetails(userDetails);
          }
        },
        (error) => {
          console.error('Error unliking recipe:', error);
        }
      );
  }

  toggleFavorite(): void {
    if (!this.user) {
      Swal.fire({
        icon: 'warning',
        title: 'Please login to favorite the recipe',
        showConfirmButton: true,
      });
      return;
    }
    const currentUser = this.user;
    if (currentUser) {
      if (this.isFavorited) {
        this.unfavoriteRecipe(currentUser.id);
      } else {
        this.favoriteRecipe(currentUser.id);
      }
    }
  }

  favoriteRecipe(userId: string): void {
    const body = {
      recipeId: this.recipeId,
    };

    this.http
      .post(`http://localhost:8080/user/${userId}/favoriteList`, body)
      .subscribe(
        (response) => {
          this.isFavorited = true;

          // Update the favoriteList in userDetailsSubject
          const userDetails = this.userService.userDetailsSubject.value;
          if (userDetails) {
            userDetails.favoriteList = [
              ...(userDetails.favoriteList || []),
              { _id: this.recipeId },
            ];
            this.userService.setUserDetails(userDetails);
          }
        },
        (error) => {
          console.error('Error favoriting recipe:', error);
        }
      );
  }

  unfavoriteRecipe(userId: string): void {
    const body = {
      recipeId: this.recipeId,
    };

    this.http
      .delete(`http://localhost:8080/user/${userId}/favoriteList`, { body })
      .subscribe(
        (response) => {
          this.isFavorited = false;

          // Update the favoriteList in userDetailsSubject
          const userDetails = this.userService.userDetailsSubject.value;
          if (userDetails) {
            userDetails.favoriteList = userDetails.favoriteList.filter(
              (recipe: any) => recipe._id !== this.recipeId
            );
            this.userService.setUserDetails(userDetails);
          }
        },
        (error) => {
          console.error('Error unfavoriting recipe:', error);
        }
      );
  }

  addToMealPlan(mealType: string): void {
    if (!this.user || !this.recipeId) {
      Swal.fire({
        icon: 'warning',
        title: 'Please login to add to meal plan',
        showConfirmButton: true,
      });
      return;
    }

    const payload = {
      key: mealType,
      recipeId: this.recipeId,
    };

    this.http
      .put(`http://localhost:8080/user/${this.user.id}/meals`, payload)
      .subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Added to Meal Plan',
            text: `${this.recipeName} has been added to ${mealType}!`,
            showConfirmButton: true,
          });
        },
        (error) => {
          console.error('Error adding to meal plan:', error);
          alert('Failed to add recipe to meal plan. Please try again.');
        }
      );
  }
}
