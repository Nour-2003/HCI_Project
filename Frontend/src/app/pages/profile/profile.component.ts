import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface User {
  username: string;
  bio: string;
  profilePictureURL: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  // User details
  username: string = 'Mathew';
  recipesCount: number = 0;
  profilePictureURL: string = '';
  following: number = 0;
  followers: number = 0;
  bio: string = '';
  startEdit: boolean = false;
  isLoading: boolean = false;

  selectedFile: File | null = null;
  selectedFileURL: string | null = null;

  originalData: { username: string; bio: string; profilePictureURL: string } = {
    username: '',
    bio: '',
    profilePictureURL: '',
  };

  user: any = null;

  // Following and Followers
  followingList: any[] = [];
  followerList: any[] = [];
  displayList: any[] = [];
  showFollowing: boolean = false;
  showFollowers: boolean = false;
  isFollowingMap: { [key: string]: boolean } = {};

  defaultProfilePicture: string =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

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
        this.fetchUserProfileData();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  fetchUserProfileData(): void {
    if (!this.user) return;
    const url = `http://localhost:8080/user/${this.user.id}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.username = data.username;
        this.recipesCount = data.Recipes.length;
        this.following = data.followingList.length;
        this.followers = data.followerList?.length;
        this.bio = data.bio || '';
        this.profilePictureURL =
          data.profilePictureURL || this.defaultProfilePicture;

        this.followingList = data.followingList || [];
        this.followerList = data.followerList || [];
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
      },
    });
  }

  toggleEdit(): void {
    if (!this.startEdit) {
      this.originalData = {
        username: this.username,
        bio: this.bio,
        profilePictureURL: this.profilePictureURL,
      };
    } else {
      this.username = this.originalData.username;
      this.bio = this.originalData.bio;
      this.profilePictureURL = this.originalData.profilePictureURL;
      this.selectedFile = null;
      this.selectedFileURL = null;
    }
    this.startEdit = !this.startEdit;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileURL = URL.createObjectURL(file);
    }
  }

  saveChanges(): void {
    if (!this.user) return;
    this.isLoading = true;

    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('bio', this.bio);
    if (this.selectedFile) {
      formData.append('imageMessage', this.selectedFile);
    }

    const url = `http://localhost:8080/user/${this.user.id}`;
    this.http.put<User>(url, formData).subscribe({
      next: (updatedUser) => {
        this.startEdit = false;
        this.profilePictureURL = updatedUser.profilePictureURL;
        this.selectedFileURL = null;
        const updatedata = {
          ...this.user,
          username: updatedUser.username,
          profilePictureURL: updatedUser.profilePictureURL,
        };
        this.userService.setUser(updatedata);
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile has been successfully updated!',
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to update user:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to update profile',
          text: 'Please try again later!',
        });
        this.isLoading = false;
      },
    });
  }

  // Following and Followers logic
  toggleFollowingDisplay(): void {
    this.displayList = this.followingList;
    this.updateFollowingStatus();
    this.showFollowing = true;
    this.showFollowers = false;
  }

  toggleFollowersDisplay(): void {
    this.displayList = this.followerList;
    this.updateFollowingStatus();
    this.showFollowers = true;
    this.showFollowing = false;
  }

  closefollowinorfollowers(): void {
    this.showFollowers = false;
    this.showFollowing = false;
  }

  updateFollowingStatus(): void {
    this.displayList.forEach((user) => {
      this.isFollowingMap[user._id] = this.userService.isFollowing(user._id);
    });
  }

  toggleFollowUser(userId: string): void {
    const isFollowing = this.isFollowingMap[userId];
    if (isFollowing) {
      this.unfollowUserFromList(userId);
    } else {
      this.followUserFromList(userId);
    }
  }

  followUserFromList(userId: string): void {
    const url = `http://localhost:8080/user/${this.user.id}/follow/${userId}`;
    this.http.post(url, {}).subscribe(() => {
      this.isFollowingMap[userId] = true;
      this.following++;

      // Update the followingList and followerList locally
      const followedUser = this.displayList.find((user) => user._id === userId);
      if (followedUser) {
        this.followingList.push(followedUser); // Add to following list
      }
      // Update the followingList in userDetailsSubject
      const userDetails = this.userService.userDetailsSubject.value;
      if (userDetails) {
        userDetails.followingList = [
          ...(userDetails.followingList || []),
          { _id: userId },
        ];
        this.userService.setUserDetails(userDetails);
      }
    });
  }

  unfollowUserFromList(userId: string): void {
    const url = `http://localhost:8080/user/${this.user.id}/unfollow/${userId}`;
    this.http.post(url, {}).subscribe(() => {
      this.isFollowingMap[userId] = false;
      this.following--;
      // Remove from following list
      this.followingList = this.followingList.filter(
        (user) => user._id !== userId
      );

      // Update the followingList in userDetailsSubject
      const userDetails = this.userService.userDetailsSubject.value;
      if (userDetails) {
        userDetails.followingList = userDetails.followingList.filter(
          (user: any) => user._id !== userId
        );
        this.userService.setUserDetails(userDetails);
      }
    });
  }
}
