import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import {IamStore} from '@iam/application/iam-store';

/**
 * Guardia de autenticación para proteger rutas.
 * @param _r - ActivatedRouteSnapshot
 * @param state - RouterStateSnapshot
 */
export const authGuard: CanActivateFn = (_r, state) => {
  const router = inject(Router);
  const iamStore  = inject(IamStore);

  /**
   * Si el usuario está autenticado, permite el acceso a la ruta.
   */
  return iamStore.isAuthenticated()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
};
