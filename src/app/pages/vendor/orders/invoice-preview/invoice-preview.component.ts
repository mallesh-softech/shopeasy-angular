import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { VendorOrder } from '../../models/vendor.models';

@Component({
  selector: 'app-invoice-preview',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './invoice-preview.component.html',
  styleUrl: './invoice-preview.component.scss'
})
export class InvoicePreviewComponent {
  @Input() order!: VendorOrder;
  @Output() close = new EventEmitter<void>();

  get baseAmount(): number {
    return Math.round(this.order.amount / 1.18);
  }

  get cgst(): number {
    return Math.round(this.baseAmount * 0.09);
  }

  get sgst(): number {
    return Math.round(this.baseAmount * 0.09);
  }

  printInvoice(): void {
    window.print();
  }
}
