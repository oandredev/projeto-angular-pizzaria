import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart-service';
import { UserLoginService } from '../../core/services/userLogin/user-login';
import { Cart } from '../../core/types/types';

@Component({
  selector: 'app-purchase-confirmation',
  templateUrl: './purchase-confirmation.html',
  styleUrls: ['./purchase-confirmation.css'],
})
export class PurchaseConfirmation implements OnInit {
  cart: Cart | null = null;
  userName: string | null = null;

  constructor(private cartService: CartService, private loginService: UserLoginService) {}

  ngOnInit(): void {
    // Pega usuário logado
    this.loginService._loggedUser.subscribe((user) => {
      this.userName = user?.name ?? null;
    });

    // Pega o carrinho do usuário para mostrar resumo
    this.cartService.getCartOfLoggedUser().subscribe({
      next: (cart) => {
        this.cart = cart;
      },
      error: (err) => {
        console.error('Erro ao carregar carrinho:', err);
      },
    });
  }

  // Método auxiliar para formatar preço em R$
  formatPrice(value: string | number): string {
    const num = typeof value === 'string' ? Number(value) : value;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
