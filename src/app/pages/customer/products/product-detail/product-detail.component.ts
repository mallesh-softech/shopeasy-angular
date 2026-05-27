import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { Product } from '../../../../models/product.model';
import { RatingComponent } from '../../../../shared/components/rating/rating.component';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CurrencyPipe,
    KeyValuePipe,
    RatingComponent,
    ProductCardComponent,
    SkeletonComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cart = inject(CartService);
  private wishlist = inject(WishlistService);

  product = signal<Product | null>(null);
  related = signal<Product[]>([]);
  loading = signal(true);
  selectedImage = signal(0);
  selectedColor = signal<string | undefined>(undefined);
  selectedSize = signal<string | undefined>(undefined);
  quantity = signal(1);
  activeTab = signal<'description' | 'specs' | 'reviews'>('description');

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) return;
      this.loading.set(true);
      this.productService.getProductById(id).subscribe((p) => {
        if (!p) {
          this.router.navigate(['/products']);
          return;
        }
        this.product.set(p);
        this.selectedColor.set(p.colors[0]);
        this.selectedSize.set(p.sizes[0]);
        this.loading.set(false);
        this.productService.getProducts({ category: p.category }).subscribe((list) => {
          this.related.set(list.filter((r) => r.id !== p.id).slice(0, 4));
        });
      });
    });
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

  incrementQty(): void {
    this.quantity.update((q) => Math.min(q + 1, 10));
  }

  decrementQty(): void {
    this.quantity.update((q) => Math.max(q - 1, 1));
  }
}
