export interface User {
  email: string;
  password: string;
  name: string;
  cpf: string; // Only numbers
}

/*-----------------------------------------------------------------------------------*/

export interface Ingredient {
  id: string;
  type: string;
  name: string;
}

export interface CustomizationOptions {
  id: string;
  type: string;
  name: string;
  value: string;
}

export interface Offer {
  id: string;
  name: string;
  priceBase: string;
  ingredients: string[];
  customizationOptions: CustomizationOptions[];
  description: string;
  images: string[]; // URLs
}

export interface CustomizedOffer {
  offer: Offer | null;
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
