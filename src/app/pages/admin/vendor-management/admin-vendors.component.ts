import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../services/admin-data.service';
import { AdminVendor, VendorPerformance } from '../models/admin.models';

@Component({
  selector: 'app-admin-vendors',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-vendors.component.html',
  styleUrl: './admin-vendors.component.scss'
})
export class AdminVendorsComponent implements OnInit {
  vendors = signal<AdminVendor[]>([]);
  activeStatus = signal('All');
  searchQuery = '';
  statuses = ['All', 'active', 'suspended', 'pending'];

  filtered = () => {
    let list = this.vendors();
    if (this.activeStatus() !== 'All') list = list.filter(v => v.status === this.activeStatus());
    if (this.searchQuery) list = list.filter(v => v.businessName.toLowerCase().includes(this.searchQuery.toLowerCase()) || v.ownerName.toLowerCase().includes(this.searchQuery.toLowerCase()));
    return list;
  };

  perfVendor = signal<AdminVendor | null>(null);
  perfData = signal<VendorPerformance | null>(null);

  constructor(private dataService: AdminDataService) {}
  ngOnInit(): void { this.dataService.getVendors().subscribe(v => this.vendors.set(v)); }
  onSearch(q: string): void { this.searchQuery = q; }

  toggleStatus(vendor: AdminVendor): void {
    this.vendors.update(list => list.map(v => v.id === vendor.id ? { ...v, status: v.status === 'active' ? 'suspended' as const : 'active' as const } : v));
  }
  removeVendor(id: string): void { this.vendors.update(list => list.filter(v => v.id !== id)); }

  openPerformance(vendor: AdminVendor): void {
    this.perfVendor.set(vendor);
    const total = Math.floor(vendor.revenue / 800) + 50;
    const delivered = Math.floor(total * 0.72);
    const returned = Math.floor(total * 0.08);
    const cancelled = Math.floor(total * 0.05);
    const pending = total - delivered - returned - cancelled;
    this.perfData.set({
      totalOrders: total, delivered, returned, cancelled, pending, revenue: vendor.revenue,
      avgOrderValue: Math.floor(vendor.revenue / total),
      topCategory: vendor.businessName.toLowerCase().includes('tech') ? 'Electronics'
        : vendor.businessName.toLowerCase().includes('fashion') ? 'Apparel'
        : vendor.businessName.toLowerCase().includes('beauty') ? 'Cosmetics'
        : vendor.businessName.toLowerCase().includes('sport') ? 'Sports'
        : 'Home & Living'
    });
  }

  closePerformance(): void {
    this.perfVendor.set(null);
    this.perfData.set(null);
  }
}
