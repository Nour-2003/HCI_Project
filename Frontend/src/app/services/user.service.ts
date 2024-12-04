import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private userSubject = new BehaviorSubject<any>(null);

  constructor() {
    this.loadUser();
  }



  private loadUser() {
    if (typeof window !== 'undefined' && localStorage) {
      const userData = localStorage.getItem('user');
      this.userSubject.next(userData ? JSON.parse(userData) : null);
    } else {
      this.userSubject.next(null);
    }
  }
  getUser() {
    return this.userSubject.asObservable();
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

}
