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
  filteredRecipes: typeof this.recipes = [];
  user: any = null;
  userId: string = '';
  filters = { title: true, prepTime: '', difficulty: '' };

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
    this.searchService.searchData$.subscribe(({ term, filters }) => {
      this.filters = filters;
      this.filterRecipes(term);
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
    const lowerTerm = term.toLowerCase();
    this.filteredRecipes = this.recipes.filter((recipe) => {
      const matchesTitle = this.filters.title
        ? recipe.title.toLowerCase().includes(lowerTerm)
        : true;

      const matchesPrepTime = this.filters.prepTime
        ? this.matchPrepTime(recipe.prepTime, this.filters.prepTime)
        : true;

      const matchesDifficulty = this.filters.difficulty
        ? recipe.difficulty.toLowerCase() ===
          this.filters.difficulty.toLowerCase()
        : true;

      return matchesTitle && matchesPrepTime && matchesDifficulty;
    });
  }

  matchPrepTime(prepTimeStr: string, filterTime: string): boolean {
    const prepTime = parseInt(prepTimeStr.replace(' min', ''), 10);
    if (filterTime === '1-5') return prepTime >= 1 && prepTime <= 5;
    if (filterTime === '5-10') return prepTime > 5 && prepTime <= 10;
    if (filterTime === '10+') return prepTime > 10;
    return true;
  }

  trackByFn(index: number, filteredRecipes: any): string {
    return filteredRecipes.RecipeId;
  }
}
