import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  @Input() title: string = '';
  @Input() imageUrl: string = '';
  @Input() prepTime: string = '';
  @Input() difficulty: string = '';
  @Input() likes: string = '';
}
