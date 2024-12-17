import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chef-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './chef-list.component.html',
  styleUrls: ['./chef-list.component.css'],
})
export class ChefListComponent implements OnInit {
  chefs: { imageUrl: string; altText: string; chefId: number }[] = [];
  defaultImage =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  constructor(private http: HttpClient, private userService: UserService) {}
  user: any = null;
  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
      this.fetchChefs(); // Fetch chefs after the user is fetched
    });
  }

  fetchChefs(): void {
    this.http.get<any[]>('http://localhost:8080/user/').subscribe({
      next: (response) => {
        if (this.user) {
          // Filter out the user from the list of chefs if user is not null
          this.chefs = response
            .filter((chef) => chef._id !== this.user.id)
            .map((chef) => ({
              imageUrl: chef.profilePictureURL || this.defaultImage,
              altText: chef.username,
              chefId: chef._id,
            }));
        } else {
          // If user is null, load all chefs
          this.chefs = response.map((chef) => ({
            imageUrl: chef.profilePictureURL || this.defaultImage,
            altText: chef.username,
            chefId: chef._id,
          }));
        }
      },
      error: (err) => {
        console.error('Error fetching chefs:', err);
      },
    });
  }

  trackByFn(index: number, chefs: any): string {
    return chefs.chefId;
  }
}
