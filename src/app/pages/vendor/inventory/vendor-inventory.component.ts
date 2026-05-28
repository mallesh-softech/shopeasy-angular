import { Component, OnInit, signal } from '@angular/core';
import { VendorDataService } from '../services/vendor-data.service';
import { InventoryItem } from '../models/vendor.models';

@Component({
  selector: 'app-vendor-inventory',
  standalone: true,
  imports: [],
  templateUrl: './vendor-inventory.component.html',
  styleUrl: './vendor-inventory.component.scss'
})
export class VendorInventoryComponent implements OnInit {
  Math = Math;
  loading = signal(true);
  items = signal<InventoryItem[]>([]);
  filtered = signal<InventoryItem[]>([]);
  summaryStats = signal<any[]>([]);
  private searchTerm = '';
  private statusFilter = '';

  constructor(private data: VendorDataService) {}

  ngOnInit() {
    this.data.getInventory().subscribe(items => {
      this.items.set(items);
      this.filtered.set(items);
      this.loading.set(false);
      this.summaryStats.set([
        { label: 'Total Products', value: items.length, icon: '📦', color: '#7c3aed' },
        { label: 'In Stock', value: items.filter(i => i.status === 'in-stock').length, icon: '✅', color: '#10b981' },
        { label: 'Low Stock', value: items.filter(i => i.status === 'low-stock').length, icon: '⚠️', color: '#f59e0b' },
        { label: 'Out of Stock', value: items.filter(i => i.status === 'out-of-stock').length, icon: '❌', color: '#ef4444' },
      ]);
    });
  }

  onSearch(e: Event) {
    this.searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }

  onStatusFilter(e: Event) {
    this.statusFilter = (e.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  applyFilters() {
    let result = this.items();
    if (this.searchTerm) result = result.filter(i => i.productName.toLowerCase().includes(this.searchTerm) || i.sku.toLowerCase().includes(this.searchTerm));
    if (this.statusFilter) result = result.filter(i => i.status === this.statusFilter);
    this.filtered.set(result);
  }

  restock(item: InventoryItem) {
    const qty = prompt(`Enter restock quantity for "${item.productName}":`, '50');
    if (qty && !isNaN(+qty)) {
      item.currentStock += +qty;
      item.status = item.currentStock === 0 ? 'out-of-stock' : item.currentStock <= item.threshold ? 'low-stock' : 'in-stock';
      this.filtered.set([...this.filtered()]);
    }
  }
}
