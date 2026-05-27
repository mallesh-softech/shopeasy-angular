import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../../models/product.model';
import { ToastService } from './toast.service';

const WISHLIST_KEY = 'shopeasy_wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  readonly items = signal<Product[]>(this.load());

  readonly count = computed(() => this.items().length);

  constructor(private toast: ToastService) {}

  isInWishlist(productId: string): boolean {
    return this.items().some((p) => p.id === productId);
  }

  toggle(product: Product): void {
    if (this.isInWishlist(product.id)) {
      this.remove(product.id);
    } else {
      this.add(product);
    }
  }

  add(product: Product): void {
    if (this.isInWishlist(product.id)) return;
    this.items.update((list) => [...list, product]);
    this.persist();
    this.toast.success('Added to wishlist');
  }

  remove(productId: string): void {
    this.items.update((list) => list.filter((p) => p.id !== productId));
    this.persist();
    this.toast.info('Removed from wishlist');
  }

  private persist(): void {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(this.items()));
  }

  private load(): Product[] {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
