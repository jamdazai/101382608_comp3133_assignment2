import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private graphqlUrl = environment.graphqlUrl;
  private tokenKey = 'token';
  private userKey = 'user';

  constructor(private http: HttpClient) {}

  login(usernameOrEmail: string, password: string): Observable<any> {
    const body = {
      query: `
        query Login($usernameOrEmail: String!, $password: String!) {
          login(usernameOrEmail: $usernameOrEmail, password: $password) {
            token
            user {
              _id
              username
              email
            }
          }
        }
      `,
      variables: {
        usernameOrEmail,
        password
      }
    };

    return this.http.post<any>(this.graphqlUrl, body).pipe(
      map(response => response.data.login)
    );
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUser(user: any) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): any {
    const data = localStorage.getItem(this.userKey);
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}
