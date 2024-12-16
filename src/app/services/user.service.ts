import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { catchError, map } from 'rxjs/operators'; // For handling errors

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null); // For user data
  userDetailsSubject = new BehaviorSubject<any>(null); // For additional user data (e.g., likeList)
  user$: any;

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  loadUser() {
    if (typeof window !== 'undefined' && localStorage) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.userSubject.next(JSON.parse(userData));
        // Fetch additional user data (like likeList, preferences) using the user ID
        this.fetchUserDetails(JSON.parse(userData).id);
      } else {
        this.userSubject.next(null);
      }
    }
  }

  private fetchUserDetails(userId: string) {
    const apiUrl = `http://localhost:8080/user/${userId}`; // API endpoint for additional user data
    this.http
      .get<any>(apiUrl)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          console.error('Error fetching user details:', error);
          return [];
        })
      )
      .subscribe((userDetails) => {
        // Set additional user data (like likeList, recipes, etc.)
        this.userDetailsSubject.next(userDetails);
      });
  }

  getUser() {
    return this.userSubject.asObservable();
  }

  getUserDetails() {
    return this.userDetailsSubject.asObservable();
  }

  setUser(user: any) {
    if (typeof window !== 'undefined' && localStorage) {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
    this.userSubject.next(user);
  }

  setUserDetails(userDetails: any) {
    this.userDetailsSubject.next(userDetails);
  }
  isRecipeLiked(recipeId: string): boolean {
    const currentUserDetails = this.userDetailsSubject.value;
    if (currentUserDetails && currentUserDetails.likeList) {
      return currentUserDetails.likeList.some(
        (recipe: any) => recipe._id === recipeId
      );
    }
    return false;
  }

  isRecipeFavorited(recipeId: string): boolean {
    const currentUserDetails = this.userDetailsSubject.value;
    if (currentUserDetails && currentUserDetails.favoriteList) {
      return currentUserDetails.favoriteList.some(
        (recipe: any) => recipe._id === recipeId
      );
    }
    return false;
  }

  isFollowing(userId: string): boolean {
    const userDetails = this.userDetailsSubject.value;
    if (userDetails && userDetails.followingList) {
      return userDetails.followingList.some(
        (followedUser: any) => followedUser._id === userId
      );
    }
    return false;
  }
  //make function for logout
  logout() {
    this.setUser(null);
    this.setUserDetails(null);
  }
}
