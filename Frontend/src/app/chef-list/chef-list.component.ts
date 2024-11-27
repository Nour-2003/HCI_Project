import { Component } from '@angular/core';
import { ChefCardComponent } from "../chef-card/chef-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chef-list',
  standalone: true,
  imports: [ChefCardComponent,CommonModule],
  templateUrl: './chef-list.component.html',
  styleUrl: './chef-list.component.css'
})
export class ChefListComponent {
  chefs = [
    { imageUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', altText: 'Chef 1' },
    { imageUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', altText: 'Chef 2' },
    { imageUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', altText: 'Chef 3' },
    { imageUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', altText: 'Chef 4' },
    { imageUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', altText: 'Chef 5' },
    { imageUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', altText: 'Chef 6' }
  ];
  
  
}
