import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  username: string = 'Mathew';
  recipesCount: number = 0;
  profilePictureURL: string = '';
  following: number = 0;
  followers: number = 0;
  bio: string = '';

  user: any = null;
  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
      this.username = user?.username || '';
      if (user && user.id) {
        this.router.navigate([`/profile/recipes/${user.id}`]);
      } else {
        this.router.navigate(['/login']);
      }
    });
    this.fetchUserProfileData();
  }

  fetchUserProfileData(): void {
    if (!this.user) {
      return;
    }
    const url = `http://localhost:8080/user/${this.user.id}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        // Update component variables with data from the response
        this.username = data.username;
        this.recipesCount = data.Recipes.length;
        this.following = data.followingList.length;
        this.followers = data.followerList?.length;
        this.bio = data.bio || '';

        this.profilePictureURL =
          data.profilePictureURL ||
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
      },
    });
  }
}
