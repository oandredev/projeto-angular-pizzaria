import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { History } from '../../types/types';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private historyAPI = 'http://localhost:3000/history';

  constructor(private http: HttpClient) {}

  saveHistory(newHistory: History): Observable<History> {
    return this.http.post<History>(this.historyAPI, newHistory).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro ao salvar histórico de compras:', error);
    return throwError(() => new Error('Erro ao salvar histórico. Tente novamente.'));
  }
}
