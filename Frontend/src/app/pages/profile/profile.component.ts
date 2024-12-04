import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  username: string = 'Mathew';
  recipesCount: number = 0;
  following: number = 0;
  followers: number = 0;

  user: any = null;
  constructor(private userService: UserService, private router: Router) {}
  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
      this.username = user.username;
      if (user && user.id) {
        this.router.navigate([`/profile/recipes/${user.id}`]);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
