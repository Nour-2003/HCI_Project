import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recipe-grid',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './recipe-grid.component.html',
})
export class RecipeGridComponent {}
