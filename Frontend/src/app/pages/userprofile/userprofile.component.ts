import { Component, OnInit } from '@angular/core';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [RecipeCardComponent, HttpClientModule,CommonModule,RouterModule],
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'], // Corrected styleUrls
})
export class UserprofileComponent implements OnInit {
  username: string = '';
  recipesCount: number = 0;
  following: number = 0;
  followers: number = 0;
  userprofileID: string = '';
  recipes: any[] = []; // To hold the recipe data

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    // Get the user profile ID from the route parameters
    this.userprofileID = this.route.snapshot.paramMap.get('id')!;
    this.fetchUserProfileData();
  }

  fetchUserProfileData(): void {
    const url = `http://localhost:8080/user/${this.userprofileID}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        // Update component variables with data from the response
        this.username = data.username;
        this.recipes = data.Recipes;
        this.recipesCount = data.Recipes.length;
        this.following = data.followingList.length;
        this.followers = data.followersList?.length || 0; // Handle cases where followersList might be undefined
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
      },
    });
  }
}
