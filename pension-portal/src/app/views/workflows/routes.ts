import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'approve-members',
    pathMatch: 'full'
  },
  {
    path: 'approve-members',
    loadComponent: () => import('./workflows.component').then((m) => m.WorkflowsComponent),
    data: {
      title: 'Approve Members'
    }
  },
  {
    path: 'approve-transactions',
    loadComponent: () =>
      import('./approve-transactions/approve-transactions.component').then((m) => m.ApproveTransactionsComponent),
    data: {
      title: 'Approve Transactions'
    }
  }
];
