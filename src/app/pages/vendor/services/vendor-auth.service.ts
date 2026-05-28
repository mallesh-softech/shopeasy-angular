import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError, delay, tap } from 'rxjs';
import { VendorUser } from '../models/vendor.models';

const VENDOR_AUTH_KEY = 'vendor_auth';
const VENDOR_USER_KEY = 'vendor_user';

@Injectable({ providedIn: 'root' })
export class VendorAuthService {
  private readonly currentVendor = signal<VendorUser | null>(this.loadVendor());
  readonly vendor = this.currentVendor.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentVendor());

  constructor(private router: Router) {}

  login(email: string, password: string): Observable<VendorUser> {
    if (!email || !password || password.length < 6) {
      return throwError(() => new Error('Invalid credentials'));
    }
    const vendor: VendorUser = {
      id: 'vendor-1',
      businessName: 'TechMart Sellers',
      ownerName: email.split('@')[0].replace(/[._]/g, ' '),
      email,
      phone: '+91 98765 43210',
      gstNumber: '27AAPFU0939F1ZV',
      businessType: 'Retailer',
      status: 'approved',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=7c3aed&color=fff`,
    };
    return of(vendor).pipe(
      delay(900),
      tap((v) => {
        localStorage.setItem(VENDOR_AUTH_KEY, 'vendor-jwt-' + Date.now());
        localStorage.setItem(VENDOR_USER_KEY, JSON.stringify(v));
        this.currentVendor.set(v);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(VENDOR_AUTH_KEY);
    localStorage.removeItem(VENDOR_USER_KEY);
    this.currentVendor.set(null);
    this.router.navigate(['/vendor/auth/login']);
  }

  private loadVendor(): VendorUser | null {
    const raw = localStorage.getItem(VENDOR_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
