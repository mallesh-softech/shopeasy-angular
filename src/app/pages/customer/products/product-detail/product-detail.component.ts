import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { ReviewService } from '../../../../core/services/review.service';
import { Product, CustomerReview } from '../../../../models/product.model';
import { RatingComponent } from '../../../../shared/components/rating/rating.component';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe, KeyValuePipe, FormsModule, RatingComponent, ProductCardComponent, SkeletonComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cart = inject(CartService);
  private wishlist = inject(WishlistService);
  private reviewService = inject(ReviewService);

  product = signal<Product | null>(null);
  related = signal<Product[]>([]);
  loading = signal(true);
  selectedImage = signal(0);
  selectedColor = signal<string | undefined>(undefined);
  selectedSize = signal<string | undefined>(undefined);
  quantity = signal(1);
  activeTab = signal<'description' | 'specs' | 'reviews'>('description');

  // Reviews
  reviews = signal<CustomerReview[]>([]);
  reviewsLoading = signal(false);
  showReviewForm = signal(false);
  reviewSubmitting = signal(false);
  reviewSubmitted = signal(false);
  helpfulClicked = signal<Set<string>>(new Set());

  newReview = { rating: 5, title: '', comment: '', customerName: '' };
  hoverRating = signal(0);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) return;
      this.loading.set(true);
      this.productService.getProductById(id).subscribe((p) => {
        if (!p) { this.router.navigate(['/products']); return; }
        this.product.set(p);
        this.selectedColor.set(p.colors[0]);
        this.selectedSize.set(p.sizes[0]);
        this.loading.set(false);
        this.productService.getProducts({ category: p.category }).subscribe((list) => {
          this.related.set(list.filter((r) => r.id !== p.id).slice(0, 4));
        });
        this.loadReviews(p.id);
      });
    });
  }

  loadReviews(productId: string) {
    this.reviewsLoading.set(true);
    this.reviewService.getReviews(productId).subscribe(r => {
      this.reviews.set(r);
      this.reviewsLoading.set(false);
    });
  }

  getRatingCount(star: number): number {
    return this.reviews().filter(r => Math.floor(r.rating) === star).length;
  }

  getRatingPct(star: number): number {
    const total = this.reviews().length;
    return total ? (this.getRatingCount(star) / total) * 100 : 0;
  }

  getAverageRating(): number {
    const rs = this.reviews();
    if (!rs.length) return this.product()?.rating || 0;
    return Math.round((rs.reduce((s, r) => s + r.rating, 0) / rs.length) * 10) / 10;
  }

  submitReview() {
    if (!this.newReview.title || !this.newReview.comment || !this.newReview.customerName) return;
    this.reviewSubmitting.set(true);
    const productId = this.product()!.id;
    this.reviewService.addReview({
      productId,
      customerName: this.newReview.customerName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(this.newReview.customerName)}&background=0d9488&color=fff`,
      rating: this.newReview.rating,
      title: this.newReview.title,
      comment: this.newReview.comment,
      date: new Date().toISOString().slice(0, 10),
      verified: false,
    }).subscribe(() => {
      this.reviewSubmitting.set(false);
      this.reviewSubmitted.set(true);
      this.showReviewForm.set(false);
      this.newReview = { rating: 5, title: '', comment: '', customerName: '' };
      this.loadReviews(productId);
    });
  }

  markHelpful(reviewId: string) {
    if (this.helpfulClicked().has(reviewId)) return;
    this.reviewService.markHelpful(reviewId);
    this.helpfulClicked.update(s => new Set([...s, reviewId]));
    this.reviews.update(rs => rs.map(r => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r));
  }

  isWishlisted(): boolean {
    const p = this.product();
    return p ? this.wishlist.isInWishlist(p.id) : false;
  }

  toggleWishlist(): void {
    const p = this.product();
    if (p) this.wishlist.toggle(p);
  }

  addToCart(): void {
    const p = this.product();
    if (p) this.cart.addToCart(p, this.quantity(), this.selectedColor(), this.selectedSize());
  }

  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/cart']);
  }

  incrementQty(): void { this.quantity.update((q) => Math.min(q + 1, 10)); }
  decrementQty(): void { this.quantity.update((q) => Math.max(q - 1, 1)); }
}
