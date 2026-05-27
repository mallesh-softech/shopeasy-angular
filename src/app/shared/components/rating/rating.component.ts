import { Component, input } from '@angular/core';

@Component({
  selector: 'app-rating',
  standalone: true,
  template: `
    <div class="rating" [attr.aria-label]="rating() + ' out of 5 stars'">
      @for (star of stars; track $index) {
        <span class="star" [class.filled]="$index < fullStars()" [class.half]="$index === fullStars() && hasHalf()">★</span>
      }
      @if (showCount()) {
        <span class="count">({{ count() }})</span>
      }
    </div>
  `,
  styles: `
    .rating {
      display: inline-flex;
      align-items: center;
      gap: 0.15rem;
    }
    .star {
      color: #e2e8f0;
      font-size: 0.9rem;
      &.filled,
      &.half {
        color: #f59e0b;
      }
    }
    .count {
      font-size: 0.8125rem;
      color: var(--color-text-muted);
      margin-left: 0.25rem;
    }
  `,
})
export class RatingComponent {
  rating = input(0);
  count = input(0);
  showCount = input(false);
  stars = [0, 1, 2, 3, 4];

  fullStars(): number {
    return Math.floor(this.rating());
  }

  hasHalf(): boolean {
    return this.rating() % 1 >= 0.5;
  }
}
