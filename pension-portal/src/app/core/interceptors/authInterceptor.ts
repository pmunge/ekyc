import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/** Attaches the signed-in user's bearer token to every request to our API. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();

  const isApiRequest = req.url.startsWith(environment.apiUrl) || req.url.startsWith(environment.adminApiUrl);

  if (!token || !isApiRequest) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    })
  );
};
