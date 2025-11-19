import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { User } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  private registerAPI = `http://localhost:3000/users`;
  private loginAPI = `http://localhost:3000/loggedUser`;

  public _loggedUser = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  tryLogin(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(this.registerAPI).pipe(
      map((users) => {
        return users.find((u) => u.email === email && (u as any).password === password) || null;
      })
    );
  }

  setUser(user: User | null) {
    return this.http
      .put(`${this.loginAPI}`, { id: 1, ...user })
      .pipe(tap(() => this._loggedUser.next(user)));
  }

  logout() {
    return this.setUser(null);
  }
}
