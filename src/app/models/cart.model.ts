import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface SavedForLaterItem {
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
}
