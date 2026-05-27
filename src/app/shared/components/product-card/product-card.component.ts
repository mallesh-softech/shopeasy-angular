import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../models/product.model';
import { RatingComponent } from '../rating/rating.component';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, RatingComponent, CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  product = input.required<Product>();
  compact = input(false);

  private cart = inject(CartService);
  private wishlist = inject(WishlistService);

  isWishlisted(): boolean {
    return this.wishlist.isInWishlist(this.product().id);
  }

  toggleWishlist(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.wishlist.toggle(this.product());
  }

  addToCart(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.cart.addToCart(this.product());
  }
}
