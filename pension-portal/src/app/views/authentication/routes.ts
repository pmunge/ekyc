import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Authentication'
    },
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
        data: {
          title: 'Login'
        }
      },
      {
        path: 'otp',
        loadComponent: () => import('./otp/otp').then(m => m.Otp),
        data: {
          title: 'Verify OTP'
        }
      }
      // TODO: register, check-email, and password reset/change routes were referenced here
      // but their components were never created. Re-add once those pages exist.
    ]
  }
];
