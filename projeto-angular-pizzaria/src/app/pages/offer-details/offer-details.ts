import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OffersService } from '../../core/services/offers/offers';
import { UserLoginService } from '../../core/services/userLogin/user-login';
import { Offer } from '../../core/types/types';
import { concat, forkJoin, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-details',
  imports: [],
  templateUrl: './offer-details.html',
  styleUrl: './offer-details.css',
})
export class OfferDetails implements OnInit {
  private offer: Offer | null = null;
  private baseIngredients: string[] = [];
  pizzaImage: String = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offersService: OffersService,
    private loginService: UserLoginService
  ) {}

  ngOnInit() {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.loadOffer(id);
  }

  // Make two requests: the first loads the offer and the second loads the ingredients using an array from the offer.
  loadOffer(id: string) {
    this.offersService
      .getOfferData(id)
      .pipe(
        switchMap((offer: Offer | null) => {
          this.offer = offer;

          if (!this.offer) {
            this.forceRedirection();
            return of([]);
          }

          const ingredientObservables = (this.offer.ingredients as string[]).map((ingredientId) =>
            this.offersService.getIngredientById(ingredientId)
          );

          return forkJoin(ingredientObservables);
        })
      )
      .subscribe({
        next: (ingredients: any[]) => {
          if (this.offer) {
            this.baseIngredients = ingredients.filter((i) => i && i.name).map((i) => i.name);
            this.loadCustomization(id);
          }
        },
        error: () => {
          this.forceRedirection();
        },
      });
  }

  loadCustomization(id: String) {
    this.updateHTMLElements();
  }

  updateHTMLElements() {
    const pizzaTitleElement = document.getElementById('pizzaTitle');
    const pizzaImageElement = document.getElementById('pizzaPreview');
    const pizzaDescriptionElement = document.getElementById('pizzaDescription');
    const ingredientesElement = document.getElementById('ingredients');
    const baseValueElement = document.getElementById('baseValue');

    if (
      pizzaTitleElement &&
      pizzaImageElement &&
      pizzaDescriptionElement &&
      ingredientesElement &&
      baseValueElement
    ) {
      pizzaTitleElement.textContent = this.offer?.name ?? '';
      this.pizzaImage = this.offer?.images[0] ?? '';
      pizzaDescriptionElement.textContent = this.offer?.description ?? '';
      ingredientesElement.textContent = this.baseIngredients.join(', ') + '.';
      baseValueElement.textContent = 'R$: ' + this.offer?.priceBase;
    } else {
      this.forceRedirection();
    }
  }

  // Used when something fails (offer unavailable or elements of HTML not found)
  forceRedirection() {
    alert('Algo falhou durante o carregamento. Voltando...');
    this.router.navigate(['/offers']);
  }

  addToCart() {
    this.loginService.isLogged().subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
      } else {
        alert('Você não está logado. Faça login para adicionar ao carrinho');
      }
    });
  }
}
