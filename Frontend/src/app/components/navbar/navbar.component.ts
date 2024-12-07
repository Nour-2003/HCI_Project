import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgIf],
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
  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchService.updateSearchTerm(input.value); // Update the search term in the service
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    if (this.user) {
      this.userService.logout();
      this.router.navigate(['/login']);
    }
  }
}
