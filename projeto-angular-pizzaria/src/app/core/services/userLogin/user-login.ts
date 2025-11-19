import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  private registerAPI = `http://localhost:3000/users`;
  private loginAPI = `http://localhost:3000/loggedUser`;

  constructor(private http: HttpClient) {}

  tryLogin(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(this.registerAPI).pipe(
      map((users) => {
        return users.find((u) => u.email === email && (u as any).password === password) || null;
      })
    );
  }

  // Use PUT instead of POST to always keep only one item saved.
  setUser(user: User) {
    return this.http.put(`${this.loginAPI}`, {
      id: '1',
      user,
    });
  }
}
