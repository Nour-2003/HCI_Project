import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  constructor(private userService: UserService) {}
  user: any = null;
  username: string = "user";
  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
      if (user) {
        this.username = user.username;
      }
    });
  }
}
