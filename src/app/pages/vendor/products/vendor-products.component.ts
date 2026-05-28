import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { VendorDataService } from '../services/vendor-data.service';
import { VendorProduct, ProductReview } from '../models/vendor.models';

@Component({
  selector: 'app-vendor-products',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './vendor-products.component.html',
  styleUrl: './vendor-products.component.scss'
})
export class VendorProductsComponent implements OnInit {
  loading = signal(true);
  viewMode = signal<'grid' | 'table'>('grid');
  products = signal<VendorProduct[]>([]);
  filtered = signal<VendorProduct[]>([]);
  reviewProduct = signal<VendorProduct | null>(null);
  reviews = signal<ProductReview[]>([]);
  reviewsLoading = signal(false);
  private searchTerm = '';
  private categoryFilter = '';
  private statusFilter = '';

  constructor(private data: VendorDataService, private router: Router) {}

  ngOnInit() {
    this.data.getProducts().subscribe(p => {
      this.products.set(p);
      this.filtered.set(p);
      this.loading.set(false);
    });
  }

  onSearch(e: Event) {
    this.searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }

  onFilter(e: Event) {
    this.categoryFilter = (e.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onStatusFilter(e: Event) {
    this.statusFilter = (e.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  applyFilters() {
    let result = this.products();
    if (this.searchTerm) result = result.filter(p => p.name.toLowerCase().includes(this.searchTerm));
    if (this.categoryFilter) result = result.filter(p => p.category === this.categoryFilter);
    if (this.statusFilter) result = result.filter(p => p.status === this.statusFilter);
    this.filtered.set(result);
  }

  editProduct(id: string) {
    this.router.navigate(['/vendor/products/add'], { queryParams: { id } });
  }

  toggleStatus(p: VendorProduct) {
    p.status = p.status === 'active' ? 'inactive' : 'active';
    this.filtered.set([...this.filtered()]);
  }

  deleteProduct(id: string) {
    this.products.update(ps => ps.filter(p => p.id !== id));
    this.filtered.update(ps => ps.filter(p => p.id !== id));
  }

  openReviews(p: VendorProduct) {
    this.reviewProduct.set(p);
    this.reviews.set([]);
    this.reviewsLoading.set(true);
    this.data.getReviews(p.id).subscribe(r => {
      this.reviews.set(r);
      this.reviewsLoading.set(false);
    });
  }

  closeReviews() {
    this.reviewProduct.set(null);
    this.reviews.set([]);
  }

  getStars(rating: number): string {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
  }

  getRatingCount(star: number): number {
    return this.reviews().filter(r => Math.floor(r.rating) === star).length;
  }

  getRatingPct(star: number): number {
    const total = this.reviews().length;
    if (!total) return 0;
    return (this.getRatingCount(star) / total) * 100;
  }
}
