import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../../../core/services/order.service';
import { Order, OrderItem, OrderStatus } from '../../../../models/order.model';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../models/product.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, EmptyStateComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent implements OnInit {
  private orders = inject(OrderService);
  private products = inject(ProductService);

  activeTab = signal<'all' | OrderStatus | 'pending' | 'shipped'>('all');
  filteredOrders = signal<Order[]>([]);
  sampleProduct = signal<Product | null>(null);

  tabs = [
    { id: 'all' as const, label: 'All Orders' },
    { id: 'pending' as const, label: 'Ongoing' },
    { id: 'shipped' as const, label: 'Shipped' },
    { id: 'delivered' as const, label: 'Delivered' },
    { id: 'cancelled' as const, label: 'Cancelled' },
  ];

  ngOnInit(): void {
    this.products.getProductById('p1').subscribe((p) => {
      this.sampleProduct.set(p || null);
      if (p) {
        this.orders.seedDemoOrders([{ product: p, quantity: 1, price: p.price }]);
      } else {
        this.orders.seedDemoOrders();
      }
      this.filterOrders();
    });
  }

  setTab(tab: 'all' | OrderStatus | 'pending' | 'shipped'): void {
    this.activeTab.set(tab);
    this.filterOrders();
  }

  filterOrders(): void {
    this.filteredOrders.set(this.orders.getOrdersByStatus(this.activeTab()));
  }

  statusLabel(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      packed: 'Packed',
      shipped: 'Shipped',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return map[status];
  }

  statusClass(status: OrderStatus): string {
    if (status === 'delivered') return 'success';
    if (status === 'cancelled') return 'danger';
    if (['shipped', 'out_for_delivery'].includes(status)) return 'info';
    return 'warning';
  }

  cancelOrder(id: string): void {
    this.orders.cancelOrder(id);
    this.filterOrders();
  }

  displayItem(order: Order) {
    if (order.items.length) return order.items[0];
    const p = this.sampleProduct();
    if (p) return { product: p, quantity: 1, price: p.price };
    return null;
  }
}
