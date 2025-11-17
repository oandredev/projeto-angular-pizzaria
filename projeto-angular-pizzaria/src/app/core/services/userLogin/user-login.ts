import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {}

  tryLogin(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>('http://localhost:3000/users').pipe(
      map((users) => {
        return users.find((u) => u.email === email && (u as any).password === password) || null;
      })
    );
  }

  logout() {
    this.currentUser = null;
  }

  setUser(user: User) {
    this.currentUser = user;
    console.log('User Logged: ' + user.name);
  }

  getUser(): User | null {
    return this.currentUser;
  }

  isLogged(): boolean {
    return this.currentUser !== null;
  }
}
