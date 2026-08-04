import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const currentUser = authService.currentUser();

    if (currentUser && allowedRoles.includes(currentUser.role)) {
      return true;
    }

    if (currentUser) {
      // Redirect based on role if logged in but unauthorized
      if (currentUser.role === 'candidate') {
        router.navigate(['/candidate/dashboard']);
      } else if (currentUser.role === 'company') {
        router.navigate(['/company/dashboard']);
      } else if (currentUser.role === 'admin') {
        router.navigate(['/admin/dashboard']);
      } else {
        router.navigate(['/']);
      }
    } else {
      router.navigate(['/auth/login']);
    }
    return false;
  };
};
