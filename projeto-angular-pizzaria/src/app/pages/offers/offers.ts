import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common'; // Contém *ngFor, | number

@Component({
  selector: 'app-offers',
  imports: [CommonModule], 
  templateUrl: './offers.html',
  styleUrl: './offers.css',
})
export class Offers {

pizzas = [
    { id: 1, name: 'Pizza Calabresa', price: 27.00, imageUrl: '/images/calabresa.jpg' }, 
    { id: 2, name: 'Pizza Margherita', price: 25.00, imageUrl: '/images/marguerita.jpg' },
    { id: 3, name: 'Pizza Quatro Queijos', price: 35.00, imageUrl: '/images/4-queijos.jpg' },
    { id: 4, name: 'Pizza Frango/Catupiry', price: 30.00, imageUrl: '/images/frango-catupiry.jpg' },    
    { id: 5, name: 'Pizza Pepperoni', price: 40.00, imageUrl: '/images/pepperoni.jpg' },
    { id: 6, name: 'Pizza Vegana', price: 28.00, imageUrl: '/images/vegana.jpg' },
    { id: 7, name: 'Pizza Bacon', price: 32.00, imageUrl: '/images/bacon.jpg' },
    { id: 8, name: 'Pizza Portuguesa', price: 29.00, imageUrl: '/images/portuguesa.jpg' },
    { id: 9, name: 'Pizza Napolitana', price: 40.00, imageUrl: '/images/napolitana.jpg' },
    { id: 10, name: 'Pizza Pão de Alho', price: 35.00, imageUrl: '/images/pao-alho.jpg' },
    { id: 11, name: 'Pizza Frango Caipira', price: 40.00, imageUrl: '/images/frango-caipira.jpg' },
    { id: 12, name: 'Cheddar e Bacon', price: 48.00, imageUrl: '/images/cheddar-bacon.jpg' },
  ];

  constructor(private router: Router) { }

  // Função chamada ao clicar no card da pizza --- ainda não entendi bem essa parte
  goToDetails(pizzaId: number): void {
    this.router.navigate(['/offer-details', pizzaId]); 
  }
}
