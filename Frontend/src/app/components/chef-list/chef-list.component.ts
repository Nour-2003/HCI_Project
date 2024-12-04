import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chef-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './chef-list.component.html',
  styleUrls: ['./chef-list.component.css'],
})
export class ChefListComponent implements OnInit {
  chefs: { imageUrl: string; altText: string }[] = [];
  defaultImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchChefs();
  }

  fetchChefs(): void {
    this.http.get<any[]>('http://localhost:8080/user/').subscribe({
      next: (response) => {
        this.chefs = response.map((chef) => ({
          imageUrl: chef.profilePictureURL || this.defaultImage,
          altText: chef.username,
        }));
      },
      error: (err) => {
        console.error('Error fetching chefs:', err);
      },
    });
  }
}
