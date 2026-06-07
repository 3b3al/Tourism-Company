import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If not logged in, redirect to login
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // If logged in, allow them through to the admin dashboard
  // The AdminRoutingModule will automatically route to /admin/dashboard
  return true;
};
