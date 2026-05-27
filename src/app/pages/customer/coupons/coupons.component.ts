import { Component, signal } from '@angular/core';

interface Coupon {
  code: string;
  title: string;
  desc: string;
  discount: string;
  expiry: string;
  minOrder: number;
  category: string;
  used: boolean;
}

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [],
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss',
})
export class CouponsComponent {
  activeTab = signal<'available' | 'used'>('available');
  copiedCode = signal('');

  coupons: Coupon[] = [
    { code: 'SAVE200', title: 'Flat ₹200 Off', desc: 'Get ₹200 off on orders above ₹999', discount: '₹200 OFF', expiry: '31 Dec 2025', minOrder: 999, category: 'All', used: false },
    { code: 'FIRST50', title: '50% Off First Order', desc: 'Get 50% off on your first purchase', discount: '50% OFF', expiry: '31 Mar 2025', minOrder: 499, category: 'All', used: false },
    { code: 'ELEC10', title: '10% Off Electronics', desc: '10% off on all electronics', discount: '10% OFF', expiry: '28 Feb 2025', minOrder: 2000, category: 'Electronics', used: false },
    { code: 'FASHION15', title: '15% Off Fashion', desc: '15% off on clothing & accessories', discount: '15% OFF', expiry: '15 Jan 2025', minOrder: 799, category: 'Fashion', used: false },
    { code: 'FREESHIP', title: 'Free Shipping', desc: 'Free delivery on any order', discount: 'FREE SHIP', expiry: '31 Jan 2025', minOrder: 0, category: 'All', used: false },
    { code: 'SUMMER30', title: '30% Summer Sale', desc: '30% off on summer collection', discount: '30% OFF', expiry: '30 Jun 2025', minOrder: 1499, category: 'Fashion', used: true },
  ];

  get available() { return this.coupons.filter(c => !c.used); }
  get used() { return this.coupons.filter(c => c.used); }

  copy(code: string) {
    navigator.clipboard.writeText(code).catch(() => {});
    this.copiedCode.set(code);
    setTimeout(() => this.copiedCode.set(''), 2000);
  }
}
