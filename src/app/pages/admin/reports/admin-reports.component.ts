import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService } from '../services/admin-data.service';
import { RevenueData } from '../models/admin.models';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.scss'
})
export class AdminReportsComponent implements OnInit {
  revenueData = signal<RevenueData[]>([]);
  activePeriod = signal('Monthly');
  periods = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
  maxRevenue = signal(1);

  categories = [
    { name: 'Electronics', pct: 35, color: '#6366f1' },
    { name: 'Fashion', pct: 25, color: '#8b5cf6' },
    { name: 'Beauty', pct: 18, color: '#14b8a6' },
    { name: 'Home & Living', pct: 12, color: '#f59e0b' },
    { name: 'Sports', pct: 10, color: '#10b981' },
  ];

  topVendors = [
    { name: 'TechZone Electronics', revenue: '8.9L', pct: 85 },
    { name: 'Fashion Hub', revenue: '4.6L', pct: 62 },
    { name: 'Beauty World', revenue: '6.8L', pct: 74 },
    { name: 'Sports Arena', revenue: '3.5L', pct: 48 },
    { name: 'Book Corner', revenue: '1.2L', pct: 28 },
  ];

  orderStatuses = [
    { label: 'Delivered', count: 5823, color: '#6366f1' },
    { label: 'Shipped', count: 2641, color: '#10b981' },
    { label: 'Pending', count: 3102, color: '#f59e0b' },
    { label: 'Cancelled', count: 1281, color: '#ef4444' },
  ];

  constructor(private dataService: AdminDataService) {}
  ngOnInit(): void {
    this.dataService.getRevenueData().subscribe(d => {
      this.revenueData.set(d);
      this.maxRevenue.set(Math.max(...d.map(x => x.revenue)));
    });
  }
}
