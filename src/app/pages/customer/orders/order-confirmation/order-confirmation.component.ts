import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../../../core/services/order.service';
import { Order } from '../../../../models/order.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss',
})
export class OrderConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orders = inject(OrderService);

  order = signal<Order | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.order.set(this.orders.getOrder(id) || null);
    }
  }
}
