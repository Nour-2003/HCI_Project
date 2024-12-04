import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UserService } from "../../services/user.service";
import { NgIf } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit{
  constructor(private userService: UserService, private router : Router) {}
  user: any = null;
  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    if (this.user) {
      this.userService.setUser(null); 
      this.router.navigate(['/login']);
    }
  }

}
