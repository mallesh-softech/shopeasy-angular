import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';
import { PaymentMethod } from '../../../models/order.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent {
  private fb = inject(FormBuilder);
  private cart = inject(CartService);
  private auth = inject(AuthService);
  private orders = inject(OrderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  paymentMethod = signal<PaymentMethod>('card');
  processing = signal(false);

  cardForm = this.fb.group({
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    name: ['', Validators.required],
    expiry: ['', Validators.required],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  upiForm = this.fb.group({
    upiId: ['', [Validators.required, Validators.pattern(/^[\w.-]+@[\w]+$/)]],
  });

  methods: { id: PaymentMethod; label: string; icon: string }[] = [
    { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
    { id: 'upi', label: 'UPI', icon: '📱' },
    { id: 'wallet', label: 'Wallet', icon: '👛' },
    { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
    { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
  ];

  get summary() {
    return this.cart.summary();
  }

  selectMethod(method: PaymentMethod): void {
    this.paymentMethod.set(method);
  }

  pay(): void {
    const method = this.paymentMethod();
    if (method === 'card' && this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }
    if (method === 'upi' && this.upiForm.invalid) {
      this.upiForm.markAllAsTouched();
      return;
    }

    const addressId = this.route.snapshot.queryParams['addressId'];
    const address =
      this.auth.defaultAddresses().find((a) => a.id === addressId) ||
      this.auth.defaultAddresses().find((a) => a.isDefault);

    if (!address) {
      this.toast.error('Please select a delivery address');
      this.router.navigate(['/checkout']);
      return;
    }

    this.processing.set(true);
    setTimeout(() => {
      const order = this.orders.createOrder(address, method);
      this.processing.set(false);
      this.toast.success('Payment successful!');
      this.router.navigate(['/orders/confirmation', order.id]);
    }, 1500);
  }
}
