import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface User {
  Education: string;
  Award: string;
}

@Component({
  selector: 'app-aboutme',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './aboutme.component.html',
  styleUrl: './aboutme.component.css',
})
export class AboutmeComponent implements OnInit {
  Education: string = '';
  Award: string = '';
  originalData: { Education: string; Award: string } = {
    Education: '',
    Award: '',
  };
  isLoading: boolean = false;
  isEditMode: boolean = false;
  user: any = null;

  constructor(private userService: UserService, private http: HttpClient) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
    this.fetchAboutmeData();
  }

  fetchAboutmeData(): void {
    if (!this.user) {
      return;
    }
    const url = `http://localhost:8080/user/${this.user.id}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        // Update component variables with data from the response
        this.Education = data.Education;
        this.Award = data.Award;
        console.log('User profile data:', data);
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
      },
    });
  }

  toggleEdit(): void {
    if (!this.isEditMode) {
      // Save current data to originalData when entering edit mode
      this.originalData = { Education: this.Education, Award: this.Award };
    } else {
      // Reset data to originalData when exiting edit mode
      this.Education = this.originalData.Education;
      this.Award = this.originalData.Award;
    }
    this.isEditMode = !this.isEditMode;
  }

  saveChanges(): void {
    this.isLoading = true;
    const url = `http://localhost:8080/user/${this.user.id}`;
    this.http
      .put<any>(url, { Education: this.Education, Award: this.Award })
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.isEditMode = false; // Exit edit mode after saving
        },
        error: (err) => {
          console.error('Error updating user profile:', err);
          this.isLoading = false;
        },
      });
  }
}
