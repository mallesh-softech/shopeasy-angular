import { Product } from './product.model';
import { Address } from './user.model';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  createdAt: string;
  deliveryEstimate: string;
  trackingId?: string;
  courier?: string;
  address: Address;
  timeline: OrderTimelineStep[];
}

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  date?: string;
  completed: boolean;
  active: boolean;
}

export type PaymentMethod = 'card' | 'upi' | 'wallet' | 'netbanking' | 'cod';

export interface CheckoutState {
  address?: Address;
  paymentMethod?: PaymentMethod;
  couponCode?: string;
}
