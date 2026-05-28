import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface BankAccount {
  id: string; accountHolder: string; accountNumber: string;
  ifscCode: string; bankName: string; isPrimary: boolean; verified: boolean;
}

@Component({
  selector: 'app-vendor-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vendor-settings.component.html',
  styleUrl: './vendor-settings.component.scss'
})
export class VendorSettingsComponent {
  activeTab = signal('general');
  showAddForm = signal(false);
  addError = signal('');
  bankAccounts = signal<BankAccount[]>([
    { id: 'b1', accountHolder: 'TechMart Sellers', accountNumber: '1234567894521', ifscCode: 'SBIN0001234', bankName: 'State Bank of India', isPrimary: true, verified: true },
  ]);
  newAccount: Partial<BankAccount> = { accountHolder: '', accountNumber: '', ifscCode: '', bankName: '' };

  tabs = [
    { id: 'general', label: 'General', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>' },
    { id: 'notifications', label: 'Notifications', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>' },
    { id: 'security', label: 'Security', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>' },
    { id: 'bank', label: 'Bank Details', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' },
  ];

  notifications = [
    { key: 'new_order', label: 'New Order Received', desc: 'Get notified when a new order is placed', enabled: true },
    { key: 'order_cancel', label: 'Order Cancellation', desc: 'Alert when a customer cancels an order', enabled: true },
    { key: 'low_stock', label: 'Low Stock Alert', desc: 'Notify when product stock falls below threshold', enabled: true },
    { key: 'payment', label: 'Payment Received', desc: 'Confirmation when payment is settled', enabled: false },
    { key: 'review', label: 'New Product Review', desc: 'When a customer leaves a review', enabled: false },
  ];

  maskAccount(num: string) { return 'XXXX XXXX ' + num.slice(-4); }
  setPrimary(id: string) { this.bankAccounts.update(a => a.map(x => ({ ...x, isPrimary: x.id === id }))); }
  removeAccount(id: string) { this.bankAccounts.update(a => a.filter(x => x.id !== id)); }

  addAccount() {
    const { accountHolder, accountNumber, ifscCode, bankName } = this.newAccount;
    if (!accountHolder || !accountNumber || !ifscCode || !bankName) { this.addError.set('All fields are required.'); return; }
    this.bankAccounts.update(a => [...a, { id: 'b' + Date.now(), accountHolder: accountHolder!, accountNumber: accountNumber!, ifscCode: ifscCode!, bankName: bankName!, isPrimary: false, verified: false }]);
    this.cancelAdd();
  }

  cancelAdd() {
    this.newAccount = { accountHolder: '', accountNumber: '', ifscCode: '', bankName: '' };
    this.addError.set('');
    this.showAddForm.set(false);
  }
}
