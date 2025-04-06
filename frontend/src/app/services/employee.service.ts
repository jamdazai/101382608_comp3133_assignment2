import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private graphqlUrl = environment.graphqlUrl;

  constructor(private http: HttpClient, private apollo: Apollo) {}

  getAllEmployees(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  
    const query = {
      query: `
        query {
          getAllEmployees {
            _id
            firstName
            lastName
            email
            gender
            designation
            salary
            date_of_joining
            department
            employeePhoto
          }
        }
      `
    };
  
    return this.http.post<any>(this.graphqlUrl, query, { headers }).pipe(
      map(res => res.data.getAllEmployees)
    );
  }

  createEmployee(employeeInput: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  
    return this.http.post<any>(
      this.graphqlUrl,
      {
        query: `
          mutation($employeeInput: EmployeeInput) {
            createEmployee(employeeInput: $employeeInput) {
              _id
              firstName
              lastName
              email
              gender
              designation
              salary
              date_of_joining
              department
              employeePhoto
            }
          }
        `,
        variables: {
          employeeInput,
          file: null
        }        
      },
      { headers }
    );
  }

  
  
  
  updateEmployee(id: string, updateInput: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  
    const query = `
      mutation UpdateEmployee($eid: ID!, $employeeInput: EmployeeInput!) {
  updateEmployee(eid: $eid, employeeInput: $employeeInput) {
          _id
          firstName
          lastName
          email
          gender
          designation
          salary
          date_of_joining
          department
          employeePhoto
        }
      }
    `;
  
    const variables = {
      eid: id,
      employeeInput: updateInput 
    };
      
    return this.http.post<any>(this.graphqlUrl, { query, variables }, { headers });
  }
  
  
  
  

  deleteEmployee(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  
    const query = {
      query: `
        mutation Delete($eid: ID!) {
          deleteEmployee(eid: $eid)
        }
      `,
      variables: { eid: id }
    };
  
    return this.http.post<any>(this.graphqlUrl, query, { headers });
  }
  

  searchEmployeeBy(input: any): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  
    const query = {
      query: `
        query ($input: SearchEmployeeInput!) {
          searchEmployeeBy(input: $input) {
            _id
            firstName
            lastName
            email
            designation
            department
            salary
            date_of_joining
            employeePhoto
          }
        }
      `,
      variables: { input }
    };
  
    return this.http.post<any>(this.graphqlUrl, query, { headers }).pipe(
      map(res => res.data.searchEmployeeBy)
    );
  }
  
}
