import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chef-card',
  standalone: true,
  imports: [],
  templateUrl: './chef-card.component.html',
  styleUrl: './chef-card.component.css'
})
export class ChefCardComponent {
  @Input() imageUrl!: string;
  @Input() altText: string = 'Chef';
}
