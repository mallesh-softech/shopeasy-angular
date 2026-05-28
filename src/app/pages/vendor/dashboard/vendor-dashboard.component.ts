import { Component, OnInit, signal, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VendorDataService } from '../services/vendor-data.service';
import { VendorAuthService } from '../services/vendor-auth.service';
import { VendorOrder, VendorUser } from '../models/vendor.models';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.scss'
})
export class VendorDashboardComponent implements OnInit {
  Math = Math;
  loading = signal(true);
  stats = signal<any[]>([]);
  recentOrders = signal<VendorOrder[]>([]);
  topProducts = signal<any[]>([]);
  inventoryAlerts = signal<any[]>([]);
  monthlyRevenue = signal<number[]>([]);
  maxRevenue = signal(1);
  months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  vendor!: Signal<VendorUser | null>;

  constructor(private data: VendorDataService, private vendorAuth: VendorAuthService) {
    this.vendor = this.vendorAuth.vendor;
  }

  getFirstName() {
    const name = this.vendor()?.ownerName;
    return name ? name.split(' ')[0] : 'Seller';
  }

  ngOnInit() {
    this.data.getDashboardStats().subscribe(s => {
      this.stats.set([
        { label: 'Total Revenue', value: '₹' + (s.totalRevenue / 1000).toFixed(0) + 'K', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>', change: s.revenueChange, color: '#7c3aed' },
        { label: 'Total Orders', value: s.totalOrders.toLocaleString(), icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', change: s.ordersChange, color: '#2563eb' },
        { label: 'Total Products', value: s.totalProducts, icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>', change: s.productsChange, color: '#0891b2' },
        { label: 'Pending Orders', value: s.pendingOrders, icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>', change: -5.2, color: '#d97706' },
        { label: 'Delivered', value: s.deliveredOrders.toLocaleString(), icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>', change: 22.1, color: '#059669' },
        { label: 'Refund Requests', value: s.refundRequests, icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>', change: -8.3, color: '#dc2626' },
      ]);
    });

    this.data.getOrders().subscribe(orders => {
      this.recentOrders.set(orders.slice(0, 5));
      this.loading.set(false);
    });

    this.data.getProducts().subscribe(products => {
      this.topProducts.set([...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 4));
    });

    this.data.getInventory().subscribe(items => {
      this.inventoryAlerts.set(items.filter(i => i.status !== 'in-stock'));
    });

    this.data.getMonthlyRevenue().subscribe(rev => {
      this.monthlyRevenue.set(rev);
      this.maxRevenue.set(Math.max(...rev));
    });
  }
}
