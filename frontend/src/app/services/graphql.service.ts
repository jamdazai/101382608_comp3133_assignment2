import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphQLService {
  constructor(private apollo: Apollo) {}

  signup(userData: any): Observable<any> {
    const SIGNUP_MUTATION = gql`
      mutation Signup($userInput: UserInput!) {
        signup(userInput: $userInput) {
          _id
          username
          email
        }
      }
    `;

    return this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: {
        userInput: userData
      }
    });
  }
}
