import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeGridComponent } from '../../components/recipe-grid/recipe-grid.component';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SearchService } from '../../services/search.service';

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
    chefId: string;
  }[] = [];
  filteredRecipes: {
    title: string;
    imageUrl: string;
    prepTime: string;
    difficulty: string;
    likes: string;
    RecipeId: string;
    chefId: string;
  }[] = []; // Stores filtered recipes
  user: any = null;
  userId: string = '';
  filters = { title: true, prepTime: false, difficulty: false };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private userService: UserService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId')!;
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });

    // Fetch recipes
    this.fetchRecipes();

    // Subscribe to search data
    this.searchService.searchData$.subscribe((data) => {
      this.filters = data.filters;
      this.filterRecipes(data.term);
    });
  }

  fetchRecipes() {
    const url = this.userId
      ? `http://localhost:8080/user/${this.userId}`
      : 'http://localhost:8080/recipe/';

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
          this.filteredRecipes = this.recipes; // Initialize filtered recipes
        },
        error: (err) => console.error('Error fetching recipes:', err),
      });
  }

  filterRecipes(term: string) {
    this.filteredRecipes = this.recipes.filter((recipe) => {
      const matchesTitle =
        this.filters.title &&
        recipe.title.toLowerCase().includes(term.toLowerCase());
      const matchesPrepTime =
        this.filters.prepTime &&
        recipe.prepTime.toLowerCase().includes(term.toLowerCase());
      const matchesDifficulty =
        this.filters.difficulty &&
        recipe.difficulty.toLowerCase().includes(term.toLowerCase());
      return matchesTitle || matchesPrepTime || matchesDifficulty;
    });
  }
}
