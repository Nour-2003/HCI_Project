import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { map } from 'rxjs';

export const guestGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.getUser().pipe(
    map((user) => {
      if (user) {
        router.navigate(['/home']); // Redirect to home
        return false; // Block access
      } else {
        return true; // Allow access
      }
    })
  );
};
