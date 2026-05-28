import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorDataService } from '../services/vendor-data.service';
import { Coupon } from '../models/vendor.models';

@Component({
  selector: 'app-vendor-promotions',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vendor-promotions.component.html',
  styleUrl: './vendor-promotions.component.scss'
})
export class VendorPromotionsComponent implements OnInit {
  loading = signal(true);
  coupons = signal<Coupon[]>([]);
  showForm = signal(false);
  editingCoupon = signal<Coupon | null>(null);
  saving = signal(false);
  form!: FormGroup;

  categories = ['Electronics', 'Fashion', 'Sports', 'Home & Kitchen', 'Beauty', 'Books'];

  constructor(private data: VendorDataService, private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    this.data.getCoupons().subscribe(c => { this.coupons.set(c); this.loading.set(false); });
  }

  buildForm(coupon?: Coupon) {
    this.form = this.fb.group({
      code: [coupon?.code || '', [Validators.required, Validators.minLength(3)]],
      discountType: [coupon?.discountType || 'percentage', Validators.required],
      discountValue: [coupon?.discountValue || '', [Validators.required, Validators.min(1)]],
      minOrderValue: [coupon?.minOrderValue || '', [Validators.required, Validators.min(0)]],
      usageLimit: [coupon?.usageLimit || 100, [Validators.required, Validators.min(1)]],
      startDate: [coupon?.startDate || '', Validators.required],
      expiryDate: [coupon?.expiryDate || '', Validators.required],
      applicableCategories: [coupon?.applicableCategories?.join(', ') || ''],
    });
  }

  openCreate() { this.editingCoupon.set(null); this.buildForm(); this.showForm.set(true); }
  editCoupon(c: Coupon) { this.editingCoupon.set(c); this.buildForm(c); this.showForm.set(true); }

  duplicate(c: Coupon) {
    const dup: Coupon = { ...c, id: 'cp' + Date.now(), code: c.code + '_COPY', usageCount: 0, status: 'inactive' };
    this.data.saveCoupon(dup).subscribe(() => this.coupons.update(list => [...list, dup]));
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const v = this.form.value;
    const coupon: Coupon = {
      id: this.editingCoupon()?.id || 'cp' + Date.now(),
      code: v.code.toUpperCase(),
      discountType: v.discountType,
      discountValue: +v.discountValue,
      minOrderValue: +v.minOrderValue,
      usageLimit: +v.usageLimit,
      usageCount: this.editingCoupon()?.usageCount || 0,
      startDate: v.startDate,
      expiryDate: v.expiryDate,
      applicableProducts: [],
      applicableCategories: v.applicableCategories ? v.applicableCategories.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      status: 'active',
    };
    this.data.saveCoupon(coupon).subscribe(() => {
      if (this.editingCoupon()) {
        this.coupons.update(list => list.map(c => c.id === coupon.id ? coupon : c));
      } else {
        this.coupons.update(list => [...list, coupon]);
      }
      this.saving.set(false);
      this.showForm.set(false);
    });
  }

  toggle(c: Coupon) {
    if (c.status === 'expired') return;
    this.data.toggleCoupon(c.id).subscribe(() => {
      this.coupons.update(list => list.map(x => x.id === c.id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x));
    });
  }

  delete(id: string) {
    this.data.deleteCoupon(id).subscribe(() => this.coupons.update(list => list.filter(c => c.id !== id)));
  }

  get active() { return this.coupons().filter(c => c.status === 'active').length; }
  get expired() { return this.coupons().filter(c => c.status === 'expired').length; }
  get totalUsage() { return this.coupons().reduce((s, c) => s + c.usageCount, 0); }
}
