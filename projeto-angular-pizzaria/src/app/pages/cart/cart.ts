import { Component } from '@angular/core';
import { CartService } from '../../core/services/cart/cart-service';
import { HistoryService } from '../../core/services/history/history-service';
import { UserLoginService } from '../../core/services/userLogin/user-login';
import { Cart, CartItem, History } from '../../core/types/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  imports: [CommonModule, FormsModule],
})
export class CartView {
  /*Vars */
  private loggedUserId: string | null = null;
  cart: Cart | null = null;
  paymentMethod: string = '';
  selectedCard: string = '';
  address: string = '';
  installments: number = 1;
  cards = ['1x sem juros', '2x sem juros', '3x sem juros'];

  constructor(
    private cartService: CartService,
    private historyService: HistoryService,
    private http: HttpClient,
    private loginService: UserLoginService,
    private router: Router
  ) {
    this.loginService._loggedUser.subscribe((user) => {
      this.loggedUserId = user?.id ?? null;

      // Depends of logged user
      if (this.loggedUserId) {
        this.loadCart();
      }
    });
  }

  loadCart() {
    this.cartService.getCartOfLoggedUser().subscribe((cart) => {
      this.cart = cart;
    });
  }

  getDescription(item: CartItem): string {
    const list = item.customizedOffer?.selectedCustomizations ?? [];
    if (!list.length) return '-';
    return list.map((c) => `${c.type}: ${c.name} (R$ ${c.value})`).join(' | ');
  }

  /*Itens Qtd. interaction*/
  increaseItem(item: CartItem) {
    if (!this.cart || !this.cart.items) return;

    const qty = Number(item.quantity) || 1;
    item.quantity = String(qty + 1);

    this.updateTotals();

    this.cartService.updateCartItem(item).subscribe({
      next: (updated) => console.log('Item atualizado no banco', updated),
      error: (err) => console.error('Erro ao atualizar item', err),
    });
  }

  decreaseItem(item: CartItem) {
    if (!this.cart || !this.cart.items) return;

    const qty = Number(item.quantity);

    if (qty <= 1) {
      this.removeItem(item);
      return;
    }

    item.quantity = String(qty - 1);
    this.updateTotals();

    this.cartService.updateCartItem(item).subscribe();
  }

  removeItem(item: CartItem) {
    if (!this.cart || !this.cart.items) return;

    this.cart.items = this.cart.items.filter((i) => i !== item);
    this.updateTotals();

    this.cartService.removeCartItem(item.id!).subscribe();
  }

  updateTotals() {
    if (!this.cart || !this.cart.items) return;

    for (const i of this.cart.items) {
      const base = Number(i.customizedOffer.offer?.priceBase) || 0;

      const customizationsTotal = i.customizedOffer.selectedCustomizations.reduce(
        (sum, opt) => sum + (Number(opt.value) || 0),
        0
      );

      const qty = Number(i.quantity) || 1;

      i.subtotal = String((base + customizationsTotal) * qty);
    }

    this.cart.valueTotal = String(this.cart.items.reduce((acc, i) => acc + Number(i.subtotal), 0));
  }

  /*Gets*/
  getUnitValue(item: CartItem): number {
    return Number(item.subtotal) / Number(item.quantity);
  }

  getSubtotal(item: CartItem): number {
    return Number(item.subtotal);
  }

  /* Validation */
  isOrderValid(): boolean {
    const isCartNotEmpty = this.cart && this.cart.items && this.cart.items.length > 0;
    const isPaymentSelected = !!this.paymentMethod;
    const isAddressFilled = this.address.trim().length > 0;

    if (!isCartNotEmpty || !isPaymentSelected || !isAddressFilled) {
      return false;
    }

    if (this.paymentMethod === 'credito') {
      return this.installments > 0;
    }

    return true;
  }

  finishOrder() {
    if (!this.isOrderValid()) {
      alert('Por favor, verifique se o carrinho não está vazio...');
      return;
    }

    if (this.cart) {
      this.cart.address = this.address;
      this.cart.paymentMethod = this.paymentMethod;

      const dateFormated = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date());

      this.cart.date = String(dateFormated);
    }

    const newHistory: History = {
      idUser: String(this.loggedUserId),
      cart: this.cart!,
      status: 'Preparando',
    };

    this.historyService.saveHistory(newHistory).subscribe({
      next: () => {
        this.cartService.clearCart().subscribe({
          next: (updatedCart) => {
            this.cart = updatedCart;
            if (this.paymentMethod === 'pix') {
              this.router.navigate(['/paymentQRCode']);
            } else {
              this.router.navigate(['/purchaseConfirmation']);
            }
          },
          error: (err) => console.error('Erro ao limpar carrinho:', err),
        });
      },
      error: (err) => console.error('Erro ao salvar histórico:', err),
    });
  }
}
