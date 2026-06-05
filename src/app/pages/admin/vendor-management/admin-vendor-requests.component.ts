import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminDataService } from '../services/admin-data.service';
import { VendorRequest } from '../models/admin.models';

@Component({
  selector: 'app-admin-vendor-requests',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-vendor-requests.component.html',
  styleUrl: './admin-vendor-requests.component.scss'
})
export class AdminVendorRequestsComponent implements OnInit {
  requests = signal<VendorRequest[]>([]);
  activeStatus = signal('all');
  statuses = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];

  filtered = () => {
    const s = this.activeStatus();
    return s === 'all' ? this.requests() : this.requests().filter(r => r.status === s);
  };

  getCount(status: string) {
    return status === 'all' ? this.requests().length : this.requests().filter(r => r.status === status).length;
  }

  constructor(private dataService: AdminDataService) {}

  ngOnInit(): void {
    this.dataService.getVendorRequests().subscribe(r => this.requests.set(r));
  }

  updateStatus(req: VendorRequest, status: 'approved' | 'rejected'): void {
    this.requests.update(list => list.map(r => r.id === req.id ? { ...r, status } : r));
  }
}
