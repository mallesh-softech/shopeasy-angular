import { Injectable, computed, signal } from '@angular/core';
import { CartItem, CartSummary, SavedForLaterItem } from '../../models/cart.model';
import { Product } from '../../models/product.model';
import { ToastService } from './toast.service';

const CART_KEY = 'shopeasy_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>(this.loadCart());
  readonly savedForLater = signal<SavedForLaterItem[]>([]);
  readonly couponCode = signal<string | null>(null);

  readonly itemCount = computed(() =>
    this.items().reduce((sum, i) => sum + i.quantity, 0),
  );

  readonly summary = computed((): CartSummary => {
    const items = this.items();
    const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const discount = this.couponCode() === 'SAVE10' ? Math.round(subtotal * 0.1) : 0;
    const deliveryFee = subtotal > 999 || subtotal === 0 ? 0 : 49;
    const taxable = subtotal - discount;
    const tax = Math.round(taxable * 0.18);
    const total = taxable + deliveryFee + tax;
    return {
      subtotal,
      discount,
      deliveryFee,
      tax,
      total,
      itemCount: this.itemCount(),
    };
  });

  constructor(private toast: ToastService) {}

  addToCart(
    product: Product,
    quantity = 1,
    selectedColor?: string,
    selectedSize?: string,
  ): void {
    this.items.update((list) => {
      const existing = list.find(
        (i) =>
          i.product.id === product.id &&
          i.selectedColor === selectedColor &&
          i.selectedSize === selectedSize,
      );
      if (existing) {
        return list.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...list, { product, quantity, selectedColor, selectedSize }];
    });
    this.persist();
    this.toast.success(`${product.title} added to cart`);
  }

  updateQuantity(
    productId: string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string,
  ): void {
    if (quantity < 1) {
      this.removeItem(productId, selectedColor, selectedSize);
      return;
    }
    this.items.update((list) =>
      list.map((i) =>
        i.product.id === productId &&
        i.selectedColor === selectedColor &&
        i.selectedSize === selectedSize
          ? { ...i, quantity }
          : i,
      ),
    );
    this.persist();
  }

  removeItem(productId: string, selectedColor?: string, selectedSize?: string): void {
    this.items.update((list) =>
      list.filter(
        (i) =>
          !(
            i.product.id === productId &&
            i.selectedColor === selectedColor &&
            i.selectedSize === selectedSize
          ),
      ),
    );
    this.persist();
    this.toast.info('Item removed from cart');
  }

  saveForLater(item: CartItem): void {
    this.removeItem(item.product.id, item.selectedColor, item.selectedSize);
    this.savedForLater.update((list) => [
      ...list,
      {
        product: item.product,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      },
    ]);
    this.toast.info('Saved for later');
  }

  moveToCart(saved: SavedForLaterItem): void {
    this.addToCart(saved.product, 1, saved.selectedColor, saved.selectedSize);
    this.savedForLater.update((list) =>
      list.filter((s) => s.product.id !== saved.product.id),
    );
  }

  applyCoupon(code: string): boolean {
    if (code.toUpperCase() === 'SAVE10') {
      this.couponCode.set('SAVE10');
      this.toast.success('Coupon applied! 10% off');
      return true;
    }
    this.toast.error('Invalid coupon code');
    return false;
  }

  clearCart(): void {
    this.items.set([]);
    this.couponCode.set(null);
    this.persist();
  }

  private persist(): void {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items()));
  }

  private loadCart(): CartItem[] {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
