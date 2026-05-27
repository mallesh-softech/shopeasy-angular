import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state fade-in">
      <div class="empty-state__icon">{{ icon() }}</div>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
      @if (actionLabel()) {
        <button type="button" class="btn btn--primary" (click)="action.emit()">{{ actionLabel() }}</button>
      }
    </div>
  `,
  styles: `
    .empty-state {
      text-align: center;
      padding: 3rem 1.5rem;
      &__icon {
        font-size: 3.5rem;
        margin-bottom: 1rem;
        opacity: 0.8;
      }
      h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-navy);
        margin-bottom: 0.5rem;
      }
      p {
        color: var(--color-text-muted);
        max-width: 360px;
        margin: 0 auto 1.5rem;
      }
    }
  `,
})
export class EmptyStateComponent {
  icon = input('📦');
  title = input('Nothing here yet');
  message = input('Check back later.');
  actionLabel = input<string | null>(null);
  action = output<void>();
}
