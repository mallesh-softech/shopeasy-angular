import { Component, OnInit, signal } from '@angular/core';
import { VendorDataService } from '../services/vendor-data.service';
import { VendorOrder } from '../models/vendor.models';
import { InvoicePreviewComponent } from './invoice-preview/invoice-preview.component';

@Component({
  selector: 'app-vendor-orders',
  standalone: true,
  imports: [InvoicePreviewComponent],
  templateUrl: './vendor-orders.component.html',
  styleUrl: './vendor-orders.component.scss'
})
export class VendorOrdersComponent implements OnInit {
  loading = signal(true);
  orders = signal<VendorOrder[]>([]);
  filtered = signal<VendorOrder[]>([]);
  activeTab = signal('all');
  selectedOrder = signal<VendorOrder | null>(null);
  private searchTerm = '';

  tabs = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Accepted', value: 'accepted' },
    { label: 'Packed', value: 'packed' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Rejected', value: 'rejected' },
  ];

  constructor(private data: VendorDataService) {}

  ngOnInit() {
    this.data.getOrders().subscribe(orders => {
      this.orders.set(orders);
      this.filtered.set(orders);
      this.loading.set(false);
    });
  }

  setTab(tab: string) { this.activeTab.set(tab); this.applyFilters(); }

  onSearch(e: Event) {
    this.searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    let result = this.orders();
    if (this.activeTab() !== 'all') result = result.filter(o => o.deliveryStatus === this.activeTab());
    if (this.searchTerm) result = result.filter(o => o.id.toLowerCase().includes(this.searchTerm) || o.customerName.toLowerCase().includes(this.searchTerm));
    this.filtered.set(result);
  }

  getCount(tab: string) {
    if (tab === 'all') return this.orders().length;
    return this.orders().filter(o => o.deliveryStatus === tab).length;
  }

  updateStatus(order: VendorOrder, status: VendorOrder['deliveryStatus']) {
    this.data.updateOrderStatus(order.id, status).subscribe(() => {
      order.deliveryStatus = status;
      this.filtered.set([...this.filtered()]);
    });
  }

  invoiceOrder = signal<VendorOrder | null>(null);
  viewOrder(order: VendorOrder) { this.selectedOrder.set(order); }
  viewInvoice(order: VendorOrder) { this.invoiceOrder.set(order); }

  getTimeline(status: string) {
    const steps = ['pending', 'accepted', 'packed', 'shipped', 'delivered'];
    const idx = steps.indexOf(status);
    return steps.map((s, i) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), done: i < idx, current: i === idx }));
  }
}
