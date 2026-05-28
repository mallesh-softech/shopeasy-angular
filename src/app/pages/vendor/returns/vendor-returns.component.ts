import { Component, OnInit, signal } from '@angular/core';
import { VendorDataService } from '../services/vendor-data.service';
import { ReturnRequest } from '../models/vendor.models';

@Component({
  selector: 'app-vendor-returns',
  standalone: true,
  imports: [],
  templateUrl: './vendor-returns.component.html',
  styleUrl: './vendor-returns.component.scss'
})
export class VendorReturnsComponent implements OnInit {
  loading = signal(true);
  returns = signal<ReturnRequest[]>([]);
  filtered = signal<ReturnRequest[]>([]);
  activeFilter = signal('all');
  selectedReturn = signal<ReturnRequest | null>(null);

  filters = [
    { label: 'All', value: 'all' },
    { label: 'Requested', value: 'requested' },
    { label: 'Under Review', value: 'under-review' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Refunded', value: 'refunded' },
  ];

  constructor(private data: VendorDataService) {}

  ngOnInit() {
    this.data.getReturns().subscribe(r => {
      this.returns.set(r);
      this.filtered.set(r);
      this.loading.set(false);
    });
  }

  setFilter(f: string) {
    this.activeFilter.set(f);
    this.filtered.set(f === 'all' ? this.returns() : this.returns().filter(r => r.status === f));
  }

  updateStatus(r: ReturnRequest, status: ReturnRequest['status']) {
    this.data.updateReturnStatus(r.id, status).subscribe(() => {
      this.returns.update(list => list.map(x => x.id === r.id ? { ...x, status } : x));
      this.filtered.update(list => list.map(x => x.id === r.id ? { ...x, status } : x));
      if (this.selectedReturn()?.id === r.id) this.selectedReturn.update(s => s ? { ...s, status } : null);
    });
  }

  getCount(f: string) {
    return f === 'all' ? this.returns().length : this.returns().filter(r => r.status === f).length;
  }

  get totalRequests() { return this.returns().length; }
  get pendingCount() { return this.returns().filter(r => r.status === 'requested' || r.status === 'under-review').length; }
  get approvedCount() { return this.returns().filter(r => r.status === 'approved' || r.status === 'refunded').length; }
  get rejectedCount() { return this.returns().filter(r => r.status === 'rejected').length; }

  getTimeline(status: string) {
    const steps = ['requested', 'under-review', 'approved', 'refunded'];
    const idx = steps.indexOf(status);
    return steps.map((s, i) => ({ label: s.replace('-', ' '), done: i < idx, current: i === idx }));
  }
}
