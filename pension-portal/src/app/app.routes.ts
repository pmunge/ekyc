import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./layout').then(m => m.DefaultLayoutComponent),
    canActivate: [authGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'pensioners',
        loadComponent: () => import('./views/pensioners/pensioners.component').then((m) => m.PensionersComponent),
        data: {
          title: 'Pensioners'
        }
      },
      {
        path: 'transactions',
        loadComponent: () => import('./views/transactions/transactions.component').then((m) => m.TransactionsComponent),
        data: {
          title: 'Transactions'
        }
      },
      {
        path: 'workflows',
        loadComponent: () => import('./views/workflows/workflows.component').then((m) => m.WorkflowsComponent),
        data: {
          title: 'Workflows'
        }
      },
      {
        path: 'components',
        loadChildren: () => import('./views/components/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: 'authentication',
    loadChildren: () => import('./views/authentication/routes').then((m) => m.routes)
  },
  {
    path: 'error-pages',
    loadChildren: () => import('./views/error-pages/routes').then((m) => m.routes)
  },
  { path: '**', redirectTo: 'dashboard' }
];
