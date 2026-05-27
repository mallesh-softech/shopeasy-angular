import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Address } from '../../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  user = this.auth.user;
  addresses = this.auth.defaultAddresses;
  activeTab = signal<'profile' | 'addresses' | 'security' | 'settings'>('profile');
  showAddressModal = signal(false);

  addressModalForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    addressLine: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    label: ['Home' as Address['label'], Validators.required],
  });

  profileForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: [{ value: '', disabled: true }],
    phone: ['', Validators.required],
  });

  securityForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  settings = {
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: true,
  };

  constructor() {
    const u = this.user();
    if (u) {
      this.profileForm.patchValue({
        fullName: u.fullName,
        email: u.email,
        phone: u.phone,
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    const { fullName, phone } = this.profileForm.getRawValue();
    this.auth.updateProfile({ fullName, phone });
    this.toast.success('Profile updated');
  }

  changePassword(): void {
    if (this.securityForm.invalid) return;
    const { newPassword, confirmPassword } = this.securityForm.getRawValue();
    if (newPassword !== confirmPassword) {
      this.toast.error('Passwords do not match');
      return;
    }
    this.toast.success('Password updated successfully');
    this.securityForm.reset();
  }

  openAddressModal(): void {
    this.addressModalForm.reset({ label: 'Home' });
    this.showAddressModal.set(true);
  }

  closeAddressModal(): void { this.showAddressModal.set(false); }

  setAddrLabel(type: string): void {
    this.addressModalForm.get('label')?.setValue(type as Address['label']);
  }

  saveAddress(): void {
    if (this.addressModalForm.invalid) {
      this.addressModalForm.markAllAsTouched();
      return;
    }
    const v = this.addressModalForm.getRawValue();
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
    this.toast.success('Address saved!');
    this.closeAddressModal();
  }
}
