import { Component, OnInit } from '@angular/core';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [RecipeCardComponent, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'], // Corrected styleUrls
})
export class UserprofileComponent implements OnInit {
  username: string = '';
  recipesCount: number = 0;
  following: number = 0;
  followers: number = 0;
  userprofileID: string = '';
  profilePictureURL: string = '';
  recipes: any[] = []; // To hold the recipe data
  bio: string = '';
  user: any = null;
  myuserid: string = '';
  isFollowing: boolean = false;
  Education: string = '';
  Award: string = '';
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Get the user profile ID from the route parameters
    this.userprofileID = this.route.snapshot.paramMap.get('id')!;

    this.userService.getUser().subscribe((user) => {
      this.user = user;
      if (user && user.id) {
        this.myuserid = user.id;
      } else {
        console.error('User ID is not available');
      }
    });
    this.userService.getUserDetails().subscribe(() => {
      this.isFollowing = this.userService.isFollowing(this.userprofileID);
    });
    this.fetchUserProfileData();
  }

  fetchUserProfileData(): void {
    const url = `http://localhost:8080/user/${this.userprofileID}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        // Update component variables with data from the response
        this.username = data.username;
        this.recipes = data.Recipes;
        this.recipesCount = data.Recipes.length;
        this.following = data.followingList.length;
        this.followers = data.followerList?.length;
        this.bio = data.bio || '';
        this.profilePictureURL =
          data.profilePictureURL ||
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

        this.Education = data.Education;
        this.Award = data.Award;
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
      },
    });
  }

  toggleFollow(): void {
    if (!this.myuserid) {
      Swal.fire({
        icon: 'warning',
        title: 'Please log in',
        text: 'You need to log in to follow users!',
      });
      return;
    }
    if (this.isFollowing) {
      this.unfollowUser();
    } else {
      this.followUser();
    }
  }

  followUser(): void {
    const url = `http://localhost:8080/user/${this.myuserid}/follow/${this.userprofileID}`;
    this.http.post(url, {}).subscribe(
      (response) => {
        this.isFollowing = true;
        this.followers++;

        // Update the followingList in userDetailsSubject
        const userDetails = this.userService.userDetailsSubject.value;
        if (userDetails) {
          userDetails.followingList = [
            ...(userDetails.followingList || []),
            { _id: this.userprofileID },
          ];
          this.userService.setUserDetails(userDetails);
        }
      },
      (error) => {
        console.error('Error following user:', error);
      }
    );
  }

  unfollowUser(): void {
    const url = `http://localhost:8080/user/${this.myuserid}/unfollow/${this.userprofileID}`;
    this.http.post(url, {}).subscribe(
      (response) => {
        this.isFollowing = false;
        this.followers--;

        // Update the followingList in userDetailsSubject
        const userDetails = this.userService.userDetailsSubject.value;
        if (userDetails) {
          userDetails.followingList = userDetails.followingList.filter(
            (user: any) => user._id !== this.userprofileID
          );
          this.userService.setUserDetails(userDetails);
        }
      },
      (error) => {
        console.error('Error unfollowing user:', error);
      }
    );
  }
}
