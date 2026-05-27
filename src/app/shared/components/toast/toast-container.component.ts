import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div class="toast-container" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast--{{ toast.type }}" (click)="toastService.dismiss(toast.id)">
          <span class="toast__icon">{{ icons[toast.type] }}</span>
          <span>{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    .toast-container {
      position: fixed;
      top: calc(var(--nav-height) + 1rem);
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 360px;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.25rem;
      background: var(--color-surface);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      border-left: 4px solid;
      cursor: pointer;
      animation: fadeIn 0.3s ease;
      font-size: 0.9rem;
      font-weight: 500;
      &--success {
        border-color: var(--color-success);
      }
      &--error {
        border-color: var(--color-danger);
      }
      &--warning {
        border-color: var(--color-warning);
      }
      &--info {
        border-color: var(--color-primary);
      }
      &__icon {
        font-size: 1.1rem;
      }
    }
  `,
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
  readonly icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
}
