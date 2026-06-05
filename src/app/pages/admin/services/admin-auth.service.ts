import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError, delay, tap } from 'rxjs';
import { AdminUser } from '../models/admin.models';

const ADMIN_AUTH_KEY = 'admin_auth';
const ADMIN_USER_KEY = 'admin_user';

const MOCK_ADMINS = [
  { email: 'admin@shopeasy.com', password: 'admin123', name: 'Super Admin', role: 'SUPER_ADMIN' as const },
];

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly currentAdmin = signal<AdminUser | null>(this.loadAdmin());
  readonly admin = this.currentAdmin.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentAdmin());

  constructor(private router: Router) {}

  login(email: string, password: string): Observable<AdminUser> {
    const match = MOCK_ADMINS.find(a => a.email === email && a.password === password);
    if (!match) return throwError(() => new Error('Invalid admin credentials'));

    const user: AdminUser = {
      id: 'admin-' + Date.now(),
      name: match.name,
      email: match.email,
      role: match.role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(match.name)}&background=4f46e5&color=fff`,
      lastLogin: new Date().toISOString(),
    };

    return of(user).pipe(
      delay(900),
      tap(u => {
        localStorage.setItem(ADMIN_AUTH_KEY, 'admin-jwt-' + Date.now());
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(u));
        this.currentAdmin.set(u);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    this.currentAdmin.set(null);
    this.router.navigate(['/admin/auth/login']);
  }

  updateProfile(updates: Partial<AdminUser>): void {
    const admin = this.currentAdmin();
    if (!admin) return;
    const updated = { ...admin, ...updates };
    this.currentAdmin.set(updated);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(updated));
  }

  private loadAdmin(): AdminUser | null {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
