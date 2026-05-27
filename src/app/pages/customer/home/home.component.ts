import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { Banner, Category, Product } from '../../../models/product.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, SkeletonComponent, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private productsSvc = inject(ProductService);
  private cart = inject(CartService);
  private wishlist = inject(WishlistService);

  loading = signal(true);
  banners = signal<Banner[]>([]);
  categories = signal<Category[]>([]);
  featured = signal<Product[]>([]);
  trending = signal<Product[]>([]);
  newArrivals = signal<Product[]>([]);
  bestSellers = signal<Product[]>([]);
  recentlyViewed = this.productsSvc.recentlyViewed;
  activeBanner = signal(0);

  // Deals countdown
  dealHours = signal(5);
  dealMins = signal(42);
  dealSecs = signal(17);

  private carouselTimer: ReturnType<typeof setInterval> | null = null;
  private countdownTimer: ReturnType<typeof setInterval> | null = null;

  extraCategories = [
    { id: 'containers', name: 'Containers', icon: '📦' },
    { id: 'decor', name: 'Decor', icon: '🖼️' },
    { id: 'furniture', name: 'Furniture', icon: '🪑' },
    { id: 'sofas', name: 'Sofas', icon: '🛋️' },
    { id: 'wallpaper', name: 'Wallpaper', icon: '🎨' },
    { id: 'cookware', name: 'Cookware', icon: '🍳' },
    { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
    { id: 'lighting', name: 'Lighting', icon: '💡' },
    { id: 'gardening', name: 'Gardening', icon: '🌱' },
    { id: 'bedsheets', name: 'Bedsheets', icon: '🛏️' },
    { id: 'drinkware', name: 'Drinkware', icon: '🥤' },
    { id: 'bath', name: 'Bath Linen', icon: '🛁' },
    { id: 'hardware', name: 'Hardware', icon: '🔧' },
    { id: 'rugs', name: 'Mats & Rugs', icon: '🏡' },
    { id: 'dining', name: 'Dining', icon: '🍽️' },
    { id: 'bathroom', name: 'Bathroom', icon: '🚿' },
    { id: 'utilities', name: 'Utilities', icon: '🔌' },
    { id: 'mosquito', name: 'Mosquito Nets', icon: '🪟' },
  ];

  brands = [
    { name: 'Nike', emoji: '👟', color: '#111' },
    { name: 'Apple', emoji: '🍎', color: '#555' },
    { name: 'Samsung', emoji: '📺', color: '#1428a0' },
    { name: 'Adidas', emoji: '🏃', color: '#000' },
    { name: 'Puma', emoji: '🐆', color: '#e31837' },
    { name: 'Zara', emoji: '👔', color: '#222' },
    { name: 'H&M', emoji: '🛍️', color: '#e50010' },
  ];

  lifestyles = [
    { title: 'Modern Living', sub: 'Curated home essentials', emoji: '🛋️', bg: 'linear-gradient(135deg,#667eea,#764ba2)' },
    { title: 'Fitness Life', sub: 'Train harder, live better', emoji: '💪', bg: 'linear-gradient(135deg,#f093fb,#f5576c)' },
    { title: 'Minimal Workspace', sub: 'Productive & aesthetic', emoji: '💻', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
    { title: 'Travel Essentials', sub: 'Pack smart, travel light', emoji: '✈️', bg: 'linear-gradient(135deg,#43e97b,#38f9d7)' },
    { title: 'Luxury Fashion', sub: 'Premium style picks', emoji: '👑', bg: 'linear-gradient(135deg,#fa709a,#fee140)' },
  ];

  isWishlisted(id: string): boolean { return this.wishlist.isInWishlist(id); }
  toggleWishlist(e: Event, p: Product): void { e.preventDefault(); e.stopPropagation(); this.wishlist.toggle(p); }
  addToCart(e: Event, p: Product): void { e.preventDefault(); e.stopPropagation(); this.cart.addToCart(p); }

  ngOnInit(): void {
    this.productsSvc.loadCatalog().subscribe((catalog) => {
      this.banners.set(catalog.banners);
      this.categories.set(catalog.categories);
      this.featured.set(catalog.products.filter((p) => p.tags.includes('featured')).slice(0, 8));
      this.trending.set(catalog.products.filter((p) => p.tags.includes('trending')).slice(0, 8));
      this.newArrivals.set(catalog.products.filter((p) => p.tags.includes('new')).slice(0, 4));
      this.bestSellers.set(catalog.products.filter((p) => p.tags.includes('bestseller')).slice(0, 4));
      this.loading.set(false);
      this.startCarousel();
    });
    this.startCountdown();
  }

  private startCarousel(): void {
    this.carouselTimer = setInterval(() => {
      const count = this.banners().length;
      if (count) this.activeBanner.update((i) => (i + 1) % count);
    }, 5000);
  }

  private startCountdown(): void {
    this.countdownTimer = setInterval(() => {
      let s = this.dealSecs() - 1;
      let m = this.dealMins();
      let h = this.dealHours();
      if (s < 0) { s = 59; m--; }
      if (m < 0) { m = 59; h--; }
      if (h < 0) { h = 23; m = 59; s = 59; }
      this.dealSecs.set(s);
      this.dealMins.set(m);
      this.dealHours.set(h);
    }, 1000);
  }

  setBanner(i: number): void { this.activeBanner.set(i); }

  pad(n: number): string { return n.toString().padStart(2, '0'); }

  ngOnDestroy(): void {
    if (this.carouselTimer) clearInterval(this.carouselTimer);
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  }
}
