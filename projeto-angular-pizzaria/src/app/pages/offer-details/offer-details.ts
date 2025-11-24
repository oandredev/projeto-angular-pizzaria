import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { OffersService } from '../../core/services/offers/offers';
import { UserLoginService } from '../../core/services/userLogin/user-login';
import { CartService } from '../../core/services/cart/cart-service';
import { Offer, CustomizationOptions, CustomizedOffer } from '../../core/types/types';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-offer-details',
  imports: [CommonModule],
  templateUrl: './offer-details.html',
  styleUrl: './offer-details.css',
})
export class OfferDetails implements OnInit {
  /* Vars */
  offer: Offer | null = null;
  baseIngredients: string = '';
  customizationsAvailable: CustomizationOptions[] = [];
  customizationsSelecteds: CustomizationOptions[] = [];
  subtotal: String = '0.00';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offersService: OffersService,
    private loginService: UserLoginService,
    private cartService: CartService
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

          // Organize default ingredients
          const ingredientObservables = (this.offer.ingredients as string[]).map((ingredientId) =>
            this.offersService.getIngredientById(ingredientId)
          );

          return forkJoin(ingredientObservables);
        })
      )
      .subscribe({
        next: (ingredients: any[]) => {
          if (this.offer) {
            this.baseIngredients =
              ingredients
                .filter((i) => i && i.name)
                .map((i) => i.name)
                .join(', ') + '.';
            this.loadCustomization();
          }
        },
        error: () => {
          this.forceRedirection();
        },
      });
  }

  private loadCustomization() {
    if (!this.offer) return;

    const customizationIds = this.offer.customizationOptions.map(String);

    this.offersService.getCustomizationsOfferObjects(customizationIds).subscribe({
      next: (customizations) => {
        this.customizationsAvailable = customizationIds
          .map((id) => customizations.find((c) => String(c.id) === id))
          .filter(Boolean) as CustomizationOptions[];

        this.calculateSubtotal();
      },
      error: (err) => {
        console.error('Erro ao carregar customizações', err);
        this.forceRedirection();
      },
    });
  }

  getCustomizationsByType(type: string): CustomizationOptions[] {
    return this.customizationsAvailable.filter((c) => c.type === type);
  }

  // Used when something fails (offer unavailable or elements of HTML not found)
  forceRedirection() {
    alert('Algo falhou durante o carregamento. Voltando...');
    this.router.navigate(['/offers']);
  }

  refreshPreviewOfCustomization(opt: CustomizationOptions) {
    // Refresh Array
    const isExtraOrSem = opt.type === 'EXTRA' || opt.type === 'SEM';
    const isSelected = this.customizationsSelecteds.some((item) => item.id === opt.id);

    if (isSelected) {
      this.customizationsSelecteds = this.customizationsSelecteds.filter(
        (item) => item.id !== opt.id
      );
    } else {
      if (!isExtraOrSem) {
        this.customizationsSelecteds = this.customizationsSelecteds.filter(
          (item) => item.type !== opt.type
        );
      }

      this.customizationsSelecteds.push(opt);
    }
    this.calculateSubtotal();
  }

  calculateSubtotal() {
    const base = parseFloat(this.offer?.priceBase ?? '0.00');
    const extras = this.customizationsSelecteds
      .map((opt) => parseFloat(opt.value))
      .reduce((acc, val) => acc + val, 0);

    const total = base + extras;

    this.subtotal = total.toFixed(2);
  }

  removeCustomization(item: CustomizationOptions) {
    this.customizationsSelecteds = this.customizationsSelecteds.filter(
      (itemRef) => itemRef.id !== item.id
    );

    this.calculateSubtotal();
  }

  // Called by checked by each checkbox/radiobox
  isSelected(opt: CustomizationOptions): boolean {
    return this.customizationsSelecteds.some((item) => item.id === opt.id);
  }

  get isFormValid(): boolean {
    const mandatoryTypes = Array.from(
      new Set(
        this.customizationsAvailable
          .filter((opt) => opt.type !== 'EXTRA' && opt.type !== 'SEM')
          .map((opt) => opt.type)
      )
    );
    return mandatoryTypes.every((type) =>
      this.customizationsSelecteds.some((sel) => sel.type === type)
    );
  }

  addToCart() {
    this.loginService
      .isLogged()
      .pipe(take(1))
      .subscribe((isLoggedIn) => {
        // Sai silenciosamente se estiver deslogado.
        if (!isLoggedIn) {
          alert('Você não está logado. Faça login para adicionar ao carrinho');
          return;
        }
        // Só adiciona ao carrinho se o form estiver OK
        if (this.isFormValid) {
          const customizedOffer: CustomizedOffer = {
            offer: this.offer!,
            selectedCustomizations: this.customizationsSelecteds,
          };

          this.cartService.addItem(customizedOffer).subscribe(() => {
            console.log('Item adicionado!');
          });
        }
      });
  }
}
