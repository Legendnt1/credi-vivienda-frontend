import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import {IamStore} from '@iam/application/iam-store';

/**
 * Guard of authentication
 * Verifies that the user is authenticated and has a valid USER role
 * @param _r - ActivatedRouteSnapshot
 * @param state - RouterStateSnapshot
 * @returns true if the user is authenticated with USER role, otherwise redirects to the login page
 */
export const authGuard: CanActivateFn = (_r, state) => {
  const router = inject(Router);
  const iamStore = inject(IamStore);
  // Check if user is authenticated
  if (!iamStore.isAuthenticated()) {
    console.log('User not authenticated, redirecting to login');
    return router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
  }

  // Get the role ID of the authenticated user
  const userRoleId = iamStore.roleId();

  // Verify that the user has role_id = 1 (USER role)
  if (!userRoleId || Number(userRoleId) !== 1) {
    console.log('User does not have valid role_id, redirecting to login. Role ID:', userRoleId);
    iamStore.logout();
    return router.createUrlTree(['/login']);
  }

  console.log('User authenticated with role_id:', userRoleId, '- Access granted');
  return true;
};
