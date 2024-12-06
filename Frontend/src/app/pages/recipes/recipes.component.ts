import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeGridComponent } from '../../components/recipe-grid/recipe-grid.component';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

interface Recipe {
  title: string;
  imageURL: string | null;
  cooktime: number;
  level: string;
  _id: string;
  likes: string;
}

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    RecipeGridComponent,
    RecipeCardComponent,
    CommonModule,
    NgFor,
    HttpClientModule,
    RouterModule,
  ],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  recipes: {
    title: string;
    imageUrl: string;
    prepTime: string;
    difficulty: string;
    likes: string;
    RecipeId: string;
  }[] = [];
  user: any = null;
  userId: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId')!;
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
    if (this.userId) {
      // Fetch user-specific recipes
      const userRecipesUrl = `http://localhost:8080/user/${this.userId}`;
      this.http.get<any>(userRecipesUrl).subscribe({
        next: (response) => {
          if (response.Recipes) {
            this.recipes = response.Recipes.map((recipe: Recipe) => ({
              title: recipe.title,
              imageUrl:
                recipe.imageURL ||
                'https://i.dailymail.co.uk/1s/2019/11/05/19/20638190-7652901-image-m-35_1572981254783.jpg',
              prepTime: `${recipe.cooktime} min`,
              difficulty: recipe.level,
              likes: recipe.likes,
              RecipeId: recipe._id,
            }));
          }
        },
        error: (err) => console.error('Error fetching user recipes:', err),
      });
    } else {
      // Fetch all recipes
      const allRecipesUrl = 'http://localhost:8080/recipe/';
      this.http
        .get<{ status: string; data: Recipe[] }>(allRecipesUrl)
        .subscribe({
          next: (response) => {
            if (response.status === 'SUCCESS') {
              this.recipes = response.data.map((recipe: Recipe) => ({
                title: recipe.title,
                imageUrl:
                  recipe.imageURL ||
                  'https://i.dailymail.co.uk/1s/2019/11/05/19/20638190-7652901-image-m-35_1572981254783.jpg',
                prepTime: `${recipe.cooktime} min`,
                difficulty: recipe.level,
                likes: recipe.likes,
                RecipeId: recipe._id,
              }));
            }
          },
          error: (err) => console.error('Error fetching all recipes:', err),
        });
    }
  }
}
