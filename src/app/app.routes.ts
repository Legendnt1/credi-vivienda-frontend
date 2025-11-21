import { Routes } from '@angular/router';
import {Login} from '@iam/presentation/views/login/login';

const register = () => import('@iam/presentation/views/register/register').then(m => m.Register);

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    title: `CrediVivienda -  Login`
  },
  {
    path: 'register',
    loadComponent: register,
    title: `CrediVivienda -  Register`
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
