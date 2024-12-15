import { Component, OnInit } from '@angular/core';
import { MealsComponent } from '../../components/meals/meals.component';
import { ChefListComponent } from '../../components/chef-list/chef-list.component';
import { CommonModule, NgFor } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

interface Recipe {
  title: string;
  imageURL: string | null;
  cooktime: number;
  level: string;
  _id: string;
  likes: string;
  chef: string;
}
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeaderComponent,
    MealsComponent,
    ChefListComponent,
    CommonModule,
    HttpClientModule,
    NgFor,
    HttpClientModule,
    RouterModule,
    RecipeCardComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  recipes: {
    title: string;
    imageUrl: string;
    prepTime: string;
    difficulty: string;
    likes: string;
    RecipeId: string;
    chefId: string;
  }[] = [];
  EasyRecipes: typeof this.recipes = [];

  user: any = null;

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit() {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });

    // Fetch recipes
    this.fetchRecipes();
  }

  scrollToSection(sectionId: string): void {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  fetchRecipes() {
    const url = 'http://localhost:8080/recipe/';

    this.http
      .get<{ status: string; Recipes?: Recipe[]; data?: Recipe[] }>(url)
      .subscribe({
        next: (response) => {
          const recipesData = response.Recipes || response.data || [];
          this.recipes = recipesData.map((recipe: Recipe) => ({
            title: recipe.title,
            imageUrl:
              recipe.imageURL ||
              'https://i.dailymail.co.uk/1s/2019/11/05/19/20638190-7652901-image-m-35_1572981254783.jpg',
            prepTime: `${recipe.cooktime} min`,
            difficulty: recipe.level,
            likes: recipe.likes,
            RecipeId: recipe._id,
            chefId: recipe.chef || '',
          }));
          this.EasyRecipes = this.recipes.filter(
            (recipe) => recipe.difficulty === 'Easy'
          );
        },
        error: (err) => console.error('Error fetching recipes:', err),
      });
  }
}
