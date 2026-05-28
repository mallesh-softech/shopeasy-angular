import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { VendorAuthService } from '../../pages/vendor/services/vendor-auth.service';

export const vendorAuthGuard: CanActivateFn = () => {
  const auth = inject(VendorAuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  return router.createUrlTree(['/vendor/auth/login']);
};

export const vendorGuestGuard: CanActivateFn = () => {
  const auth = inject(VendorAuthService);
  const router = inject(Router);
  if (!auth.isAuthenticated()) return true;
  return router.createUrlTree(['/vendor/dashboard']);
};
