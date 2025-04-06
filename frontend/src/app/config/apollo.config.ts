import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';

export const provideApollo = {
  provide: APOLLO_OPTIONS,
  useFactory: (): ApolloClientOptions<any> => {
    const httpLink = inject(HttpLink).create({
      uri: `${environment.graphqlUrl}`, 
    });

    const authLink = setContext(() => {
      const token = localStorage.getItem('token');
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      };
    });

    return {
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    };
  },
};
