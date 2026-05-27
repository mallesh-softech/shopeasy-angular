import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { Order } from '../../../../models/order.model';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.scss',
})
export class OrderTrackingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orders = inject(OrderService);

  order = signal<Order | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.order.set(this.orders.getOrder(id) || null);
  }
}
