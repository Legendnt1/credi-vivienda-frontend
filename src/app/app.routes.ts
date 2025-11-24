import { Routes } from '@angular/router';
import {Login} from '@iam/presentation/views/login/login';
import { Layout } from '@shared/presentation/components/layout/layout';
import { authGuard } from '@shared/infrastructure/guards/auth.guard';

const register = () => import('@iam/presentation/views/register/register').then(m => m.Register);
const layout = () => import('@shared/presentation/components/layout/layout').then(m => m.Layout);
const home = () => import('@shared/presentation/views/home/home').then(m => m.Home);
const dashboard = () => import('@shared/presentation/views/dashboard/dashboard').then(m => m.Dashboard);
const settings = () => import('@shared/presentation/views/settings/settings').then(m => m.Settings);
const support = () => import('@shared/presentation/views/support/support').then(m => m.Support);
const projects = () => import('@projects/presentation/views/projects/projects').then(m => m.Projects);
const bonusInformation = () => import('@projects/presentation/views/bonus-information/bonus-information').then(m => m.BonusInformation);
const calculations = () => import('@financial/presentation/views/calculations/calculations').then(m => m.Calculations);
const reports = () => import('@financial/presentation/views/reports/reports').then(m => m.Reports);

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
    canActivate: [authGuard],
    loadComponent: layout,
    children: [
      {
        path: 'home',
        loadComponent: home,
        title: 'CrediVivienda - Home'
      },
      {
        path: 'dashboard',
        loadComponent: dashboard,
        title: 'CrediVivienda - Dashboard'
      },
      {
        path: 'settings',
        loadComponent: settings,
        title: 'CrediVivienda - Settings'
      },
      {
        path: 'support',
        loadComponent: support,
        title: 'CrediVivienda - Support'
      },
      {
        path: 'projects',
        loadComponent: projects,
        title: 'CrediVivienda - Projects'
      },
      {
        path: 'bonus',
        loadComponent: bonusInformation,
        title: 'CrediVivienda - Bonus Information'
      },
      {
        path: 'calculations',
        loadComponent: calculations,
        title: 'CrediVivienda - Calculations'
      },
      {
        path: 'reports',
        loadComponent: reports,
        title: 'CrediVivienda - Reports'
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
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
