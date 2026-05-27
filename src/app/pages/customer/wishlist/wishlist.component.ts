import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, EmptyStateComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent {
  wishlist = inject(WishlistService);
  cart = inject(CartService);

  moveAllToCart(): void {
    for (const p of this.wishlist.items()) {
      this.cart.addToCart(p);
    }
  }
}
