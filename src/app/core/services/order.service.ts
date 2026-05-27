import { Injectable, signal } from '@angular/core';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import {
  Order,
  OrderItem,
  OrderStatus,
  OrderTimelineStep,
  PaymentMethod,
} from '../../models/order.model';
import { Address } from '../../models/user.model';

const ORDERS_KEY = 'shopeasy_orders';

@Injectable({ providedIn: 'root' })
export class OrderService {
  readonly orders = signal<Order[]>(this.load());

  constructor(
    private cart: CartService,
    private auth: AuthService,
  ) {}

  createOrder(address: Address, paymentMethod: PaymentMethod): Order {
    const items: OrderItem[] = this.cart.items().map((i) => ({
      product: i.product,
      quantity: i.quantity,
      price: i.product.price,
    }));
    const summary = this.cart.summary();
    const order: Order = {
      id: 'ORD-' + Date.now().toString(36).toUpperCase(),
      items,
      status: paymentMethod === 'cod' ? 'confirmed' : 'confirmed',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      total: summary.total,
      createdAt: new Date().toISOString(),
      deliveryEstimate: new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      trackingId: 'TRK' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      courier: 'ShopEasy Express',
      address,
      timeline: this.buildTimeline('confirmed'),
    };
    this.orders.update((list) => [order, ...list]);
    this.persist();
    this.cart.clearCart();
    return order;
  }

  getOrder(id: string): Order | undefined {
    return this.orders().find((o) => o.id === id);
  }

  getOrdersByStatus(status?: OrderStatus | 'all'): Order[] {
    const list = this.orders();
    if (!status || status === 'all') return list;
    if (status === 'pending') {
      return list.filter((o) => ['pending', 'confirmed', 'packed'].includes(o.status));
    }
    if (status === 'shipped') {
      return list.filter((o) => ['shipped', 'out_for_delivery'].includes(o.status));
    }
    return list.filter((o) => o.status === status);
  }

  cancelOrder(id: string): void {
    this.orders.update((list) =>
      list.map((o) =>
        o.id === id
          ? { ...o, status: 'cancelled' as OrderStatus, timeline: this.buildTimeline('cancelled') }
          : o,
      ),
    );
    this.persist();
  }

  seedDemoOrders(sampleItems: OrderItem[] = []): void {
    if (this.orders().length > 0) return;
    const addr = this.auth.defaultAddresses()[0];
    const demo: Order = {
      id: 'ORD-DEMO001',
      items: sampleItems,
      status: 'delivered',
      paymentStatus: 'paid',
      total: 4999,
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      deliveryEstimate: 'Delivered',
      trackingId: 'TRKDEMO123',
      courier: 'ShopEasy Express',
      address: addr,
      timeline: this.buildTimeline('delivered'),
    };
    this.orders.set([demo]);
    this.persist();
  }

  private buildTimeline(current: OrderStatus): OrderTimelineStep[] {
    const steps: { status: OrderStatus; label: string }[] = [
      { status: 'pending', label: 'Order Placed' },
      { status: 'confirmed', label: 'Confirmed' },
      { status: 'packed', label: 'Packed' },
      { status: 'shipped', label: 'Shipped' },
      { status: 'out_for_delivery', label: 'Out for Delivery' },
      { status: 'delivered', label: 'Delivered' },
    ];
    const order = [
      'pending',
      'confirmed',
      'packed',
      'shipped',
      'out_for_delivery',
      'delivered',
    ];
    const idx = current === 'cancelled' ? -1 : order.indexOf(current);
    return steps.map((s, i) => ({
      ...s,
      completed: i <= idx,
      active: i === idx,
      date: i <= idx ? new Date(Date.now() - (order.length - i) * 86400000).toLocaleDateString() : undefined,
    }));
  }

  private persist(): void {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(this.orders()));
  }

  private load(): Order[] {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
