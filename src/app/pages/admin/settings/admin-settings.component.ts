import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Category { id: string; name: string; icon: string; active: boolean; }
interface Coupon { id: string; code: string; discount: number; type: 'percent' | 'flat'; minOrder: number; active: boolean; }

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss'
})
export class AdminSettingsComponent {
  activeTab = signal('Categories');
  tabs = ['Categories', 'Coupons', 'Tax & Shipping', 'Banners'];
  taxRate = 18;
  taxInclusive = false;
  freeShippingThreshold = 499;
  shippingFee = 49;
  commissionRate = 10;
  payoutCycle = 'Weekly';

  categories = signal<Category[]>([
    { id: 'c1', name: 'Electronics', icon: '💻', active: true },
    { id: 'c2', name: 'Fashion', icon: '👗', active: true },
    { id: 'c3', name: 'Beauty', icon: '💄', active: true },
    { id: 'c4', name: 'Home & Living', icon: '🏠', active: true },
    { id: 'c5', name: 'Sports', icon: '⚽', active: true },
    { id: 'c6', name: 'Books', icon: '📚', active: true },
    { id: 'c7', name: 'Toys', icon: '🧸', active: false },
    { id: 'c8', name: 'Grocery', icon: '🛒', active: false },
  ]);

  coupons = signal<Coupon[]>([
    { id: 'cp1', code: 'SAVE10', discount: 10, type: 'percent', minOrder: 500, active: true },
    { id: 'cp2', code: 'FLAT100', discount: 100, type: 'flat', minOrder: 999, active: true },
    { id: 'cp3', code: 'WELCOME20', discount: 20, type: 'percent', minOrder: 0, active: false },
    { id: 'cp4', code: 'SUMMER50', discount: 50, type: 'flat', minOrder: 299, active: true },
  ]);

  banners = [
    { id: 'b1', title: 'Summer Sale — Up to 70% Off', bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', active: true },
    { id: 'b2', title: 'New Arrivals in Electronics', bg: 'linear-gradient(135deg, #0d9488, #14b8a6)', active: true },
    { id: 'b3', title: 'Fashion Week Deals', bg: 'linear-gradient(135deg, #f97316, #fb923c)', active: false },
  ];

  addCategory(): void {
    const name = prompt('Category name:');
    if (name) this.categories.update(list => [...list, { id: 'c' + Date.now(), name, icon: '📦', active: true }]);
  }
  toggleCategory(cat: Category): void { this.categories.update(list => list.map(c => c.id === cat.id ? { ...c, active: !c.active } : c)); }
  deleteCategory(id: string): void { this.categories.update(list => list.filter(c => c.id !== id)); }
  addCoupon(): void {
    const code = prompt('Coupon code:');
    if (code) this.coupons.update(list => [...list, { id: 'cp' + Date.now(), code: code.toUpperCase(), discount: 10, type: 'percent', minOrder: 0, active: true }]);
  }
  toggleCoupon(c: Coupon): void { this.coupons.update(list => list.map(x => x.id === c.id ? { ...x, active: !x.active } : x)); }
  deleteCoupon(id: string): void { this.coupons.update(list => list.filter(c => c.id !== id)); }
}
