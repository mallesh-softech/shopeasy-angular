import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ProductService } from '../../core/services/product.service';
import { ToastContainerComponent } from '../../shared/components/toast/toast-container.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, ToastContainerComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private auth = inject(AuthService);
  private cart = inject(CartService);
  private wishlist = inject(WishlistService);
  private products = inject(ProductService);
  private router = inject(Router);

  readonly user = this.auth.user;
  readonly cartCount = this.cart.itemCount;
  readonly wishlistCount = this.wishlist.count;

  searchQuery = '';
  searchSuggestions = signal<string[]>([]);
  showSuggestions = signal(false);
  profileOpen = signal(false);
  mobileMenuOpen = signal(false);
  categoriesOpen = signal(false);
  notificationsOpen = signal(false);

  notifications = [
    { id: 1, icon: '🚚', title: 'Order Shipped!', message: 'Your order #ORD-1042 is on the way.', time: '2 mins ago', read: false },
    { id: 2, icon: '✅', title: 'Order Delivered', message: 'Order #ORD-1038 has been delivered.', time: '1 hour ago', read: false },
    { id: 3, icon: '🎉', title: 'Special Offer!', message: 'Extra 20% off on Electronics today only!', time: '3 hours ago', read: true },
    { id: 4, icon: '💳', title: 'Payment Successful', message: 'Payment of ₹2,499 received for order #ORD-1042.', time: 'Yesterday', read: true },
    { id: 5, icon: '⭐', title: 'Rate your purchase', message: 'How was your Nike Air Max? Leave a review!', time: '2 days ago', read: true },
  ];

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  markAllRead(): void {
    this.notifications.forEach((n) => (n.read = true));
  }

  private search$ = new Subject<string>();

  categories = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'home', name: 'Home & Living' },
    { id: 'beauty', name: 'Beauty' },
    { id: 'sports', name: 'Sports' },
    { id: 'books', name: 'Books' },
  ];

  constructor() {
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => this.products.searchSuggestions(q)),
        takeUntilDestroyed(),
      )
      .subscribe((s) => {
        this.searchSuggestions.set(s);
        this.showSuggestions.set(s.length > 0);
      });
  }

  onSearchInput(): void {
    this.search$.next(this.searchQuery);
  }

  submitSearch(): void {
    this.showSuggestions.set(false);
    this.router.navigate(['/products'], {
      queryParams: { q: this.searchQuery || undefined },
    });
  }

  selectSuggestion(s: string): void {
    this.searchQuery = s;
    this.showSuggestions.set(false);
    this.router.navigate(['/products'], { queryParams: { q: s } });
  }

  logout(): void {
    this.profileOpen.set(false);
    this.auth.logout();
  }

  toggleProfile(): void {
    this.profileOpen.update((v) => !v);
  }
}
