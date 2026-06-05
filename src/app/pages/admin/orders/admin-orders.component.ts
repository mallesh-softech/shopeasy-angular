import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../services/admin-data.service';
import { AdminOrder } from '../models/admin.models';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Orders Management</h1>
          <p class="page-sub">Track and manage all platform orders</p>
        </div>
        <div class="order-summary">
          @for (s of summary; track s.label) {
            <div class="summary-chip" [class]="s.cls">
              <span class="chip-val">{{ s.count }}</span>
              <span class="chip-lbl">{{ s.label }}</span>
            </div>
          }
        </div>
      </div>

      <div class="toolbar">
        <div class="search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search by order ID or customer..." [(ngModel)]="searchQuery" />
        </div>
        <div class="filter-tabs">
          @for (s of deliveryStatuses; track s) {
            <button class="filter-tab" [class.active]="activeStatus() === s" (click)="activeStatus.set(s)">{{ s }}</button>
          }
        </div>
      </div>

      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Delivery</th>
              <th>Date</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            @for (o of filtered(); track o.id) {
              <tr>
                <td class="order-id">{{ o.id }}</td>
                <td class="name-cell">{{ o.customerName }}</td>
                <td class="name-cell vendor">{{ o.vendorName }}</td>
                <td class="num-cell">₹{{ o.amount | number }}</td>
                <td><span class="badge" [class]="'pay-' + o.paymentStatus">{{ o.paymentStatus }}</span></td>
                <td><span class="badge" [class]="'del-' + o.deliveryStatus">{{ o.deliveryStatus }}</span></td>
                <td class="date-cell">{{ o.orderDate }}</td>
                <td class="num-cell">{{ o.items }}</td>
              </tr>
            }
          </tbody>
        </table>
        @if (!filtered().length) {
          <div class="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
            <p>No orders found</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; }
    .page-sub { color: #64748b; font-size: 0.875rem; margin-top: 0.25rem; }
    .order-summary { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .summary-chip {
      display: flex; flex-direction: column; align-items: center;
      background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.4rem 0.875rem;
      &.green { border-color: rgba(16,185,129,0.3); .chip-val { color: #059669; } }
      &.blue { border-color: rgba(59,130,246,0.3); .chip-val { color: #2563eb; } }
      &.orange { border-color: rgba(245,158,11,0.3); .chip-val { color: #d97706; } }
      &.red { border-color: rgba(239,68,68,0.3); .chip-val { color: #dc2626; } }
    }
    .chip-val { font-size: 1rem; font-weight: 700; }
    .chip-lbl { font-size: 0.7rem; color: #94a3b8; }
    .toolbar { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
    .search-box {
      display: flex; align-items: center; gap: 0.5rem;
      background: #fff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 0.6rem 1rem;
      flex: 1; max-width: 320px; color: #94a3b8;
      &:focus-within { border-color: #6366f1; color: #6366f1; }
      input { border: none; background: none; outline: none; font-size: 0.875rem; color: #374151; width: 100%; }
    }
    .filter-tabs { display: flex; gap: 0.25rem; flex-wrap: wrap; }
    .filter-tab {
      padding: 0.45rem 0.875rem; border-radius: 8px; font-size: 0.8rem; font-weight: 500;
      background: #fff; color: #64748b; border: 1.5px solid #e2e8f0; cursor: pointer; transition: all 0.15s;
      &:hover { border-color: #6366f1; color: #6366f1; }
      &.active { background: #6366f1; color: #fff; border-color: #6366f1; }
    }
    .table-card { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 4px rgba(15,23,42,0.05); overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; min-width: 800px;
      th { text-align: left; padding: 0.875rem 1rem; color: #64748b; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
      td { padding: 0.875rem 1rem; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
      tr:last-child td { border-bottom: none; }
      tr:hover td { background: #fafbff; }
    }
    .order-id { font-family: monospace; font-size: 0.85rem; color: #6366f1; font-weight: 700; }
    .name-cell { font-size: 0.875rem; color: #374151; font-weight: 500; &.vendor { color: #64748b; font-weight: 400; } }
    .num-cell { font-size: 0.875rem; font-weight: 600; color: #374151; }
    .date-cell { font-size: 0.8rem; color: #94a3b8; }
    .badge {
      display: inline-flex; align-items: center; padding: 0.2rem 0.6rem;
      font-size: 0.7rem; font-weight: 600; border-radius: 999px; text-transform: capitalize;
    }
    .pay-paid { background: rgba(16,185,129,0.1); color: #059669; }
    .pay-pending { background: rgba(245,158,11,0.1); color: #d97706; }
    .pay-failed { background: rgba(239,68,68,0.1); color: #dc2626; }
    .pay-refunded { background: rgba(99,102,241,0.1); color: #6366f1; }
    .del-delivered { background: rgba(16,185,129,0.1); color: #059669; }
    .del-shipped { background: rgba(59,130,246,0.1); color: #2563eb; }
    .del-pending { background: rgba(245,158,11,0.1); color: #d97706; }
    .del-cancelled { background: rgba(239,68,68,0.1); color: #dc2626; }
    .empty-state { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 3rem; color: #94a3b8; }
  `]
})
export class AdminOrdersComponent implements OnInit {
  orders = signal<AdminOrder[]>([]);
  activeStatus = signal('All');
  searchQuery = '';
  deliveryStatuses = ['All', 'pending', 'shipped', 'delivered', 'cancelled'];

  summary = [
    { label: 'Delivered', cls: 'green', count: 0 },
    { label: 'Shipped', cls: 'blue', count: 0 },
    { label: 'Pending', cls: 'orange', count: 0 },
    { label: 'Cancelled', cls: 'red', count: 0 },
  ];

  filtered = () => {
    let list = this.orders();
    if (this.activeStatus() !== 'All') list = list.filter(o => o.deliveryStatus === this.activeStatus());
    if (this.searchQuery) list = list.filter(o => o.id.toLowerCase().includes(this.searchQuery.toLowerCase()) || o.customerName.toLowerCase().includes(this.searchQuery.toLowerCase()));
    return list;
  };

  constructor(private dataService: AdminDataService) {}
  ngOnInit(): void {
    this.dataService.getOrders().subscribe(o => {
      this.orders.set(o);
      this.summary[0].count = o.filter(x => x.deliveryStatus === 'delivered').length;
      this.summary[1].count = o.filter(x => x.deliveryStatus === 'shipped').length;
      this.summary[2].count = o.filter(x => x.deliveryStatus === 'pending').length;
      this.summary[3].count = o.filter(x => x.deliveryStatus === 'cancelled').length;
    });
  }
}
