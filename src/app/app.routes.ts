import { Routes } from '@angular/router';
import {Login} from '@iam/presentation/views/login/login';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    title: `CrediVivienda -  Inicio de sesión`
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
