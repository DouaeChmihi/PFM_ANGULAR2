import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; 
  private user: any = null;


  constructor(private http: HttpClient, private router: Router) { }

  signUp(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/signup`, user);
  }

  signIn(credentials: { email: string, password: string, mergeCart: boolean }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signin`, credentials, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Error signing in:', error);
        return throwError(error);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, {withCredentials:true}).pipe(
      catchError(error => {
        console.error('Error logging out:', error);
        return of(); 
      })
    );
  }
 
  isAuthenticated(): Observable<User | null> {
    return this.http.get<User | null>(`${this.apiUrl}/user`, { withCredentials: true }).pipe(
      catchError(error => {
        if (error.status === 401) {
         
          return of(null);
        }
        console.error('Error retrieving user data:', error);
        return of(null); 
      })
    );
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`, { withCredentials: true }).pipe(
      tap(user => this.user = user)
    );
  }
 
}
