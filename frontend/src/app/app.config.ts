import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloClientOptions } from '@apollo/client/core';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideApollo(createApollo),
  ]
};

export function createApollo(): ApolloClientOptions<any> {
  const httpLink = inject(HttpLink);

  return {
    link: httpLink.create({
      uri: environment.graphqlUrl,
      withCredentials: true
    }),
    cache: new InMemoryCache(),
  };
}
