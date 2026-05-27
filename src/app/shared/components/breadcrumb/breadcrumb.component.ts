import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      @for (item of items(); track item.label; let last = $last) {
        @if (!last && item.path) {
          <a [routerLink]="item.path">{{ item.label }}</a>
          <span class="sep">/</span>
        } @else {
          <span class="current">{{ item.label }}</span>
        }
      }
    </nav>
  `,
  styles: `
    .breadcrumb {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.875rem;
      margin-bottom: 1.25rem;
      a {
        color: var(--color-text-muted);
        &:hover {
          color: var(--color-primary);
        }
      }
      .sep {
        color: var(--color-text-light);
      }
      .current {
        color: var(--color-navy);
        font-weight: 500;
      }
    }
  `,
})
export class BreadcrumbComponent {
  items = input<BreadcrumbItem[]>([]);
}
