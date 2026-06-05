import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminDataService } from '../services/admin-data.service';
import { AdminStats, RevenueData, VendorRequest, AdminOrder } from '../models/admin.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  loading = signal(true);
  stats = signal<AdminStats | null>(null);
  revenueData = signal<RevenueData[]>([]);
  pendingRequests = signal<VendorRequest[]>([]);
  recentOrders = signal<AdminOrder[]>([]);
  activePeriod = signal('Monthly');
  periods = ['Weekly', 'Monthly', 'Yearly'];
  maxRevenue = signal(1);

  activities = [
    { id: 1, type: 'vendor', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', text: 'New vendor request from TechZone', time: '2 min ago' },
    { id: 2, type: 'order', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>', text: 'Order ORD-001 delivered successfully', time: '15 min ago' },
    { id: 3, type: 'payment', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>', text: 'Payout of ₹25,191 processed to TechZone', time: '1 hr ago' },
    { id: 4, type: 'alert', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>', text: 'Payment failed for Order ORD-007', time: '2 hr ago' },
    { id: 5, type: 'vendor', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', text: 'Fashion Hub vendor approved', time: '3 hr ago' },
  ];

  constructor(private dataService: AdminDataService) {}

  ngOnInit(): void {
    this.dataService.getStats().subscribe(s => { this.stats.set(s); this.loading.set(false); });
    this.dataService.getRevenueData().subscribe(d => {
      this.revenueData.set(d);
      this.maxRevenue.set(Math.max(...d.map(x => x.revenue)));
    });
    this.dataService.getVendorRequests().subscribe(r => this.pendingRequests.set(r.filter(x => x.status === 'pending').slice(0, 3)));
    this.dataService.getOrders().subscribe(o => this.recentOrders.set(o.slice(0, 5)));
  }
}
