import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Offer, Ingredient } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class OffersService {
  private offerAPI = `http://localhost:3000/offers`;
  private ingredientAPI = `http://localhost:3000/ingredients`;

  constructor(private http: HttpClient) {}

  getOfferData(offerId: String) {
    return this.http.get<Offer[]>(this.offerAPI).pipe(
      map((offers) => {
        return offers.find((o) => o.id === offerId) || null;
      })
    );
  }

  getIngredientById(id: string): Observable<Ingredient | null> {
    return this.http.get<Ingredient>(`${this.ingredientAPI}/${id}`);
  }
}
