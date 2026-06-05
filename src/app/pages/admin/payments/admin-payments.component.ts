import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../services/admin-data.service';
import { AdminPayment } from '../models/admin.models';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-payments.component.html',
  styleUrl: './admin-payments.component.scss'
})
export class AdminPaymentsComponent implements OnInit {
  payments = signal<AdminPayment[]>([]);
  activeType = signal('All');
  types = ['All', 'payment', 'payout', 'refund'];

  successTotal = () => this.payments().filter(p => p.status === 'success' && p.type === 'payment').reduce((s, p) => s + p.amount, 0);
  pendingCount = () => this.payments().filter(p => p.status === 'pending').length;
  refundCount = () => this.payments().filter(p => p.type === 'refund').length;
  failedCount = () => this.payments().filter(p => p.status === 'failed').length;

  filtered = () => {
    const t = this.activeType();
    return t === 'All' ? this.payments() : this.payments().filter(p => p.type === t);
  };

  constructor(private dataService: AdminDataService) {}
  ngOnInit(): void { this.dataService.getPayments().subscribe(p => this.payments.set(p)); }
}
