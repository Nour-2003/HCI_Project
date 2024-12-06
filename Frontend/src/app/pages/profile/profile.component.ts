import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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

  toggleEdit(): void {
    if (!this.startEdit) {
      // Save current data to originalData when entering edit mode
      this.originalData = {
        username: this.username,
        bio: this.bio,
        profilePictureURL: this.profilePictureURL,
      };
    } else {
      // Restore originalData if canceling edit mode
      this.username = this.originalData.username;
      this.bio = this.originalData.bio;
      this.profilePictureURL = this.originalData.profilePictureURL;
      this.selectedFile = null; // Clear selected file
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
        console.log('User updated:', updatedUser);
        this.startEdit = false;
        this.profilePictureURL = updatedUser.profilePictureURL;
        this.selectedFileURL = null;
        const updatedata = {
          ...this.user,
          username: updatedUser.username,
          profilePictureURL: updatedUser.profilePictureURL,
        };
        this.userService.setUser(updatedata); // Ensure this field exists in User
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to update user:', err);
        this.isLoading = false;
      },
    });
  }
}
