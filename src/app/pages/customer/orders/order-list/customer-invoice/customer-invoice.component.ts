import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { Order } from '../../../../../models/order.model';

@Component({
  selector: 'app-customer-invoice',
  standalone: true,
  imports: [DatePipe, UpperCasePipe],
  templateUrl: './customer-invoice.component.html',
  styleUrl: './customer-invoice.component.scss'
})
export class CustomerInvoiceComponent {
  @Input() order!: Order;
  @Output() close = new EventEmitter<void>();

  basePrice(price: number): number {
    return Math.round(price / 1.18);
  }

  cgst(price: number, qty: number): number {
    return Math.round(this.basePrice(price) * qty * 0.09);
  }

  sgst(price: number, qty: number): number {
    return Math.round(this.basePrice(price) * qty * 0.09);
  }

  get subtotal(): number {
    return this.order.items.reduce((s, i) => s + this.basePrice(i.price) * i.quantity, 0);
  }

  get totalCgst(): number {
    return this.order.items.reduce((s, i) => s + this.cgst(i.price, i.quantity), 0);
  }

  get totalSgst(): number {
    return this.order.items.reduce((s, i) => s + this.sgst(i.price, i.quantity), 0);
  }

  print(): void {
    window.print();
  }
}
