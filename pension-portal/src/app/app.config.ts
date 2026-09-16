import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { authInterceptor } from './core/interceptors/authInterceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation(),
    ),
    IconSetService,
  ],
};
