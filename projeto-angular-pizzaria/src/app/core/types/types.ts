export interface User {
  email: string;
  password: string;
  name: string;
  cpf: string; // Only numbers
}

/*-----------------------------------------------------------------------------------*/

export interface Ingredient {
  id: string;
  type: string; // Ex: "Massa", "Molho", "Queijo", "Cobertura"
  name: string;
}

export interface CustomizationOptions {} // Arrumar

export interface Offer {
  id: string;
  name: string;
  priceBase: string;
  type: 'Broto' | 'Normal' | 'Família';
  ingredients: Ingredient[];
  customizationOptions: CustomizationOptions[];
  description: string;
  images: string[]; // URLs
}

export interface CustomizedOffer {
  offer: Offer;
  selectedCustomizations: CustomizationOptions[];
}

/*-----------------------------------------------------------------------------------*/

export interface CartItem {
  id: string;
  idUser: string;
  customizedOffer: CustomizedOffer;
  quantity: string;
}

export interface Cart {
  id: string;
  idUser: string;
  items: CartItem[];
  valueTotal: string;
  address: string;
  date: string;
  paymentMethod: string;
}

/*-----------------------------------------------------------------------------------*/

export interface History {
  id: string;
  idUser: string;
  cart: Cart;
  status: 'Preparando' | 'Entregue';
}
