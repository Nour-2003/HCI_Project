import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [RecipeCardComponent, CommonModule, NgFor, RouterModule],
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css'],
})
export class FavoriteComponent implements OnInit {
  recipes: {
    title: string;
    imageUrl: string;
    prepTime: string;
    difficulty: string;
    likes: string;
    RecipeId: string;
  }[] = [];
  user: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Fetch user information
    this.userService.getUser().subscribe((user) => {
      this.user = user;
      if (this.user && this.user.id) {
        this.fetchFavoriteRecipes(this.user.id);
      }
    });
  }

  fetchFavoriteRecipes(userId: string) {
    const url = `http://localhost:8080/user/${userId}/favoriteList`;
    this.http.get<{ body: any[] }>(url).subscribe({
      next: (response) => {
        // Map the response to match the recipes array format
        this.recipes = response.body.map((recipe) => ({
          title: recipe.title,
          imageUrl:
            recipe.imageURL ||
            'https://i.dailymail.co.uk/1s/2019/11/05/19/20638190-7652901-image-m-35_1572981254783.jpg',
          prepTime: `${recipe.cooktime} min`,
          difficulty: recipe.level,
          likes: recipe.likes,
          RecipeId: recipe._id,
        }));
      },
      error: (err) => {
        console.error('Error fetching favorite recipes:', err);
      },
    });
  }

  trackByFn(index: number, recipe: any): string {
    return recipe.RecipeId;
  }
}
