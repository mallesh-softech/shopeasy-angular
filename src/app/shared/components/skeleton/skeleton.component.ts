import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `<div class="skeleton" [style.width]="width()" [style.height]="height()" [class.circle]="circle()"></div>`,
  styles: `
    .skeleton {
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--radius-md);
      &.circle {
        border-radius: 50%;
      }
    }
  `,
})
export class SkeletonComponent {
  width = input('100%');
  height = input('1rem');
  circle = input(false);
}
