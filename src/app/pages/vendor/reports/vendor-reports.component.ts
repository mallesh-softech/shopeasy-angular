import { Component, OnInit, signal } from '@angular/core';
import { VendorDataService } from '../services/vendor-data.service';

@Component({
  selector: 'app-vendor-reports',
  standalone: true,
  imports: [],
  templateUrl: './vendor-reports.component.html',
  styleUrl: './vendor-reports.component.scss'
})
export class VendorReportsComponent implements OnInit {
  Math = Math;
  activeFilter = signal('Monthly');
  selectedMonth = signal<number | null>(null);
  selectedYear = signal<number | null>(null);
  filters = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
  months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  years = [2022, 2023, 2024, 2025];
  kpis = signal<any[]>([]);
  chartPoints = signal<{x: number, y: number}[]>([]);
  topProducts = signal<any[]>([]);
  donutSegments = signal<any[]>([]);
  salesSummary = signal<any[]>([]);
  private revenue = [42, 58, 51, 67, 73, 89, 95, 78, 102, 118, 95, 125];

  constructor(private data: VendorDataService) {}

  ngOnInit() {
    this.kpis.set([
      { label: 'Total Revenue', value: '₹2.84L', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>', change: 18.5, color: '#7c3aed' },
      { label: 'Total Orders', value: '1,247', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', change: 12.3, color: '#2563eb' },
      { label: 'Avg Order Value', value: '₹2,282', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', change: 5.7, color: '#0891b2' },
      { label: 'Conversion Rate', value: '3.8%', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>', change: -1.2, color: '#d97706' },
    ]);
    const maxR = Math.max(...this.revenue);
    this.chartPoints.set(this.revenue.map((v, i) => ({ x: (i / 11) * 580 + 10, y: 190 - (v / maxR) * 170 })));
    this.topProducts.set([
      { name: 'Headphones', revenue: 125, pct: 100, color: '#7c3aed' },
      { name: 'Smart Watch', revenue: 98, pct: 78, color: '#2563eb' },
      { name: 'Running Shoes', revenue: 76, pct: 61, color: '#0891b2' },
      { name: 'Handbag', revenue: 54, pct: 43, color: '#059669' },
      { name: 'Yoga Mat', revenue: 32, pct: 26, color: '#d97706' },
    ]);
    const circumference = 2 * Math.PI * 45;
    const segments = [
      { label: 'Delivered', pct: 72, color: '#10b981' },
      { label: 'Shipped', pct: 12, color: '#3b82f6' },
      { label: 'Pending', pct: 10, color: '#f59e0b' },
      { label: 'Rejected', pct: 6, color: '#ef4444' },
    ];
    let offset = 0;
    this.donutSegments.set(segments.map(s => {
      const dash = (s.pct / 100) * circumference;
      const seg = { ...s, dash: `${dash} ${circumference}`, offset: -offset };
      offset += dash;
      return seg;
    }));
    this.salesSummary.set(this.months.slice(6).map((m, i) => ({
      month: m, orders: 80 + i * 15, revenue: this.revenue[i + 6], avg: Math.floor(1800 + i * 120), growth: [8.2, -3.1, 12.5, 15.7, -8.3, 31.6][i],
    })));
  }

  onMonthChange(e: Event) { const v = (e.target as HTMLSelectElement).value; this.selectedMonth.set(v === '' ? null : +v); }
  onYearChange(e: Event) { const v = (e.target as HTMLSelectElement).value; this.selectedYear.set(v === '' ? null : +v); }
  clearDateFilter() { this.selectedMonth.set(null); this.selectedYear.set(null); }

  linePath() {
    const pts = this.chartPoints();
    if (!pts.length) return '';
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }

  areaPath() {
    const pts = this.chartPoints();
    if (!pts.length) return '';
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return `${line} L ${pts[pts.length - 1].x} 190 L ${pts[0].x} 190 Z`;
  }
}
