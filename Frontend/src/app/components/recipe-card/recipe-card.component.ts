import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service'; // Import UserService
import { HttpClient } from '@angular/common/http'; // Import HttpClient

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
})
export class RecipeCardComponent implements OnInit {
  @Input() title: string = '';
  @Input() imageUrl: string = '';
  @Input() prepTime: string = '';
  @Input() difficulty: string = '';
  @Input() likes: string = '';
  @Input() RecipeId: string = '';
  isLiked: boolean = false;
  user: any = null;
  constructor(private userService: UserService, private http: HttpClient) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });

    this.userService.getUserDetails().subscribe((userDetails) => {
      // If userDetails is available, check if the recipe is liked
      if (userDetails) {
        this.isLiked = this.userService.isRecipeLiked(this.RecipeId);
      }
    });
  }

  toggleLike(): void {
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
    const body = { recipeId: this.RecipeId };
    this.http.post(`http://localhost:8080/user/${userId}/likelist`, body).subscribe(
      (response) => {
        console.log('Recipe liked:', response);
        this.isLiked = true;
        this.likes = (parseInt(this.likes) + 1).toString();
  
        // Update the likeList in userDetailsSubject
        const userDetails = this.userService.userDetailsSubject.value;
        if (userDetails) {
          userDetails.likeList = [...(userDetails.likeList || []), { _id: this.RecipeId }];
          this.userService.setUserDetails(userDetails);
        }
      },
      (error) => {
        console.error('Error liking recipe:', error);
      }
    );
  }
  
  unlikeRecipe(userId: string): void {
    const body = { recipeId: this.RecipeId };
    this.http.delete(`http://localhost:8080/user/${userId}/likelist`, { body }).subscribe(
      (response) => {
        console.log('Recipe unliked:', response);
        this.isLiked = false;
        this.likes = (parseInt(this.likes) - 1).toString();
  
        // Update the likeList in userDetailsSubject
        const userDetails = this.userService.userDetailsSubject.value;
        if (userDetails) {
          userDetails.likeList = userDetails.likeList.filter((recipe: any) => recipe._id !== this.RecipeId);
          this.userService.setUserDetails(userDetails);
        }
      },
      (error) => {
        console.error('Error unliking recipe:', error);
      }
    );
  }
  
}
