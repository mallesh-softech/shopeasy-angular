import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Address } from '../../../models/user.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  readonly cart = inject(CartService);
  private auth = inject(AuthService);
  private router = inject(Router);

  step = signal(1);
  addresses = this.auth.defaultAddresses;
  selectedAddressId = signal<string | null>(null);
  expressDelivery = signal(false);
  showAddressModal = signal(false);

  modalForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    addressLine: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    label: ['Home' as Address['label'], Validators.required],
  });

  constructor() {
    const defaultAddr = this.addresses().find((a) => a.isDefault);
    if (defaultAddr) this.selectedAddressId.set(defaultAddr.id);
  }

  get summary() { return this.cart.summary(); }

  selectAddress(id: string): void { this.selectedAddressId.set(id); }

  openModal(): void {
    this.modalForm.reset({ label: 'Home' });
    this.showAddressModal.set(true);
  }

  closeModal(): void { this.showAddressModal.set(false); }

  saveModalAddress(): void {
    if (this.modalForm.invalid) {
      this.modalForm.markAllAsTouched();
      return;
    }
    const v = this.modalForm.getRawValue();
    const newAddr: Address = {
      id: 'addr-' + Date.now(),
      label: v.label,
      name: v.name,
      phone: v.phone,
      addressLine: v.addressLine,
      city: v.city,
      state: v.state,
      pincode: v.pincode,
      isDefault: false,
    };
    this.auth.defaultAddresses.update((list) => [...list, newAddr]);
    this.selectedAddressId.set(newAddr.id);
    this.closeModal();
  }

  nextStep(): void {
    if (this.step() === 1 && !this.selectedAddressId()) {
      alert('Please select or add a delivery address.');
      return;
    }
    if (this.step() < 3) {
      this.step.update((s) => s + 1);
    } else {
      this.router.navigate(['/payment'], {
        queryParams: { addressId: this.selectedAddressId() },
      });
    }
  }

  prevStep(): void { this.step.update((s) => Math.max(1, s - 1)); }

  setAddressLabel(type: string): void {
    this.modalForm.get('label')?.setValue(type as Address['label']);
  }

  getSelectedAddress(): Address | null {
    const id = this.selectedAddressId();
    return id ? (this.addresses().find((a) => a.id === id) || null) : null;
  }
}
