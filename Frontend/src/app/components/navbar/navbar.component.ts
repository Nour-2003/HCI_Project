import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgIf, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private searchService: SearchService
  ) {}
  user: any = null;
  searchTerm = '';
  filters = { title: true, prepTime: '', difficulty: '' };

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  onSearchTermChange() {
    this.searchService.setSearchData({
      term: this.searchTerm,
      filters: this.filters,
    });
  }

  onFilterChange() {
    this.searchService.setSearchData({
      term: this.searchTerm,
      filters: this.filters,
    });
  }
  navigateToProfile() {
    this.router.navigate(['/profile/recipes', this.user.id]);
  }

  logout() {
    if (this.user) {
      this.userService.logout();
      this.router.navigate(['/mainpage']);
    }
  }
}
