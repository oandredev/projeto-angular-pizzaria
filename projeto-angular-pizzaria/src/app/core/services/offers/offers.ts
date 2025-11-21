import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Offer, Ingredient, CustomizationOptions } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class OffersService {
  // APIs
  private offerAPI = `http://localhost:3000/offers`;
  private ingredientAPI = `http://localhost:3000/ingredients`;
  private customizationOptionsAPI = `http://localhost:3000/customizationOptions`;

  constructor(private http: HttpClient) {}

  getOfferData(offerId: string) {
    return this.http.get<Offer[]>(this.offerAPI).pipe(
      map((offers) => {
        return offers.find((o) => o.id === offerId) || null;
      })
    );
  }

  getIngredientById(id: string): Observable<Ingredient | null> {
    return this.http.get<Ingredient>(`${this.ingredientAPI}/${id}`);
  }

  getCustomizationsOfferObjects(ids: string[]): Observable<CustomizationOptions[]> {
    return this.http
      .get<CustomizationOptions[]>(this.customizationOptionsAPI)
      .pipe(
        map(
          (allCustomizations) =>
            ids
              .map((id) => allCustomizations.find((c) => String(c.id ?? c.id) === String(id)))
              .filter(Boolean) as CustomizationOptions[]
        )
      );
  }
}
