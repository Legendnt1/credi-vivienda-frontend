import { Routes } from '@angular/router';
import {Login} from '@iam/presentation/views/login/login';
import { Layout } from '@shared/presentation/components/layout/layout';
import { Home } from '@shared/presentation/views/home/home';
import { authGuard } from '@shared/infrastructure/guards/auth.guard';

const register = () => import('@iam/presentation/views/register/register').then(m => m.Register);
const home = () => import('@shared/presentation/views/home/home').then(m => m.Home);

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    title: `CrediVivienda - Login`
  },
  {
    path: 'register',
    loadComponent: register,
    title: `CrediVivienda - Register`
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: home,
        title: 'CrediVivienda - Dashboard'
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
