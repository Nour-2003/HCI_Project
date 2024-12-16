import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.getUser().pipe(
    map((user) => {
      if (user) {
        return true; // Allow access
      } else {
        router.navigate(['/mainpage']); // Redirect to mainpage
        return false; // Block access
      }
    })
  );
};
