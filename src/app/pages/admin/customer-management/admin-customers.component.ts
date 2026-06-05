import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../services/admin-data.service';
import { AdminCustomer, CustomerDetail, CustomerOrder } from '../models/admin.models';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-customers.component.html',
  styleUrl: './admin-customers.component.scss'
})
export class AdminCustomersComponent implements OnInit {
  customers = signal<AdminCustomer[]>([]);
  activeStatus = signal('All');
  searchQuery = '';
  statuses = ['All', 'active', 'blocked'];

  activeCount = () => this.customers().filter(c => c.status === 'active').length;
  blockedCount = () => this.customers().filter(c => c.status === 'blocked').length;

  filtered = () => {
    let list = this.customers();
    if (this.activeStatus() !== 'All') list = list.filter(c => c.status === this.activeStatus());
    if (this.searchQuery) list = list.filter(c => c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || c.email.toLowerCase().includes(this.searchQuery.toLowerCase()));
    return list;
  };

  profileCustomer = signal<AdminCustomer | null>(null);
  custDetail = signal<CustomerDetail | null>(null);
  custOrders = signal<CustomerOrder[]>([]);
  activeTab = signal<'overview' | 'orders'>('overview');

  deliveredCount = () => this.custOrders().filter(o => o.deliveryStatus === 'delivered').length;
  returnedCount = () => this.custOrders().filter(o => o.deliveryStatus === 'returned' || o.deliveryStatus === 'refunded').length;

  constructor(private dataService: AdminDataService) {}
  ngOnInit(): void { this.dataService.getCustomers().subscribe(c => this.customers.set(c)); }

  toggleBlock(c: AdminCustomer): void {
    this.customers.update(list => list.map(x => x.id === c.id ? { ...x, status: x.status === 'active' ? 'blocked' as const : 'active' as const } : x));
  }
  deleteCustomer(id: string): void { this.customers.update(list => list.filter(c => c.id !== id)); }

  openProfile(c: AdminCustomer): void {
    this.profileCustomer.set(c);
    this.activeTab.set('overview');
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'];
    const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Maharashtra'];
    const idx = c.id.charCodeAt(c.id.length - 1) % cities.length;
    this.custDetail.set({
      address: `${Math.floor(Math.random() * 900) + 100}, ${['MG Road', 'Park Street', 'Anna Salai', 'FC Road', 'Linking Road'][idx % 5]}`,
      city: cities[idx], state: states[idx], pincode: `${400000 + idx * 10001}`
    });
    const products = ['Wireless Headphones', 'Running Shoes', 'Cotton Kurta', 'Smart Watch', 'Face Serum', 'Yoga Mat', 'Laptop Bag', 'Sunglasses'];
    const vendors = ['TechZone Electronics', 'Sports Arena', 'Fashion Hub', 'Beauty World', 'Home Essentials'];
    const deliveryStatuses: CustomerOrder['deliveryStatus'][] = ['delivered', 'delivered', 'delivered', 'shipped', 'pending', 'cancelled', 'returned', 'refunded'];
    const payStatuses: CustomerOrder['paymentStatus'][] = ['paid', 'paid', 'paid', 'pending', 'refunded', 'failed', 'refunded', 'refunded'];
    const orders: CustomerOrder[] = Array.from({ length: Math.min(c.ordersCount, 8) }, (_, i) => {
      const si = (i + c.id.charCodeAt(0)) % deliveryStatuses.length;
      return {
        id: `ORD-${1000 + i + c.id.charCodeAt(0)}`,
        product: products[(i + c.id.charCodeAt(0)) % products.length],
        vendor: vendors[i % vendors.length],
        amount: Math.floor(c.totalSpent / c.ordersCount * (0.7 + (i % 3) * 0.2)),
        date: new Date(new Date(c.joinedAt).getTime() + i * 15 * 86400000).toISOString().split('T')[0],
        deliveryStatus: deliveryStatuses[si],
        paymentStatus: payStatuses[si]
      };
    });
    this.custOrders.set(orders);
  }

  closeProfile(): void {
    this.profileCustomer.set(null);
    this.custDetail.set(null);
    this.custOrders.set([]);
  }
}
