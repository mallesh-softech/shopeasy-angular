import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { delay, Observable, of, tap, throwError } from 'rxjs';
import { LoginCredentials, SignupData, User, Address } from '../../models/user.model';

const AUTH_KEY = 'shopeasy_auth';
const USER_KEY = 'shopeasy_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUser = signal<User | null>(this.loadUser());

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly token = signal<string | null>(this.loadToken());

  readonly defaultAddresses = signal<Address[]>([
    {
      id: 'addr-1',
      label: 'Home',
      name: 'Demo User',
      phone: '+91 98765 43210',
      addressLine: '42 MG Road, Koramangala',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560034',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Work',
      name: 'Demo User',
      phone: '+91 98765 43210',
      addressLine: 'Tech Park, Phase 2, Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      isDefault: false,
    },
  ]);

  constructor(private router: Router) {}

  login(credentials: LoginCredentials): Observable<User> {
    if (!credentials.email || !credentials.password) {
      return throwError(() => new Error('Email and password are required'));
    }
    if (credentials.password.length < 6) {
      return throwError(() => new Error('Invalid email or password'));
    }

    const user: User = {
      id: 'user-1',
      fullName: credentials.email.split('@')[0].replace(/[._]/g, ' '),
      email: credentials.email,
      phone: '+91 98765 43210',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.email)}&background=0d9488&color=fff`,
    };

    return of(user).pipe(
      delay(800),
      tap((u) => {
        const token = 'demo-jwt-' + Date.now();
        this.persist(u, token, credentials.rememberMe);
        this.currentUser.set(u);
        this.token.set(token);
      }),
    );
  }

  signup(data: SignupData): Observable<User> {
    if (data.password !== data.confirmPassword) {
      return throwError(() => new Error('Passwords do not match'));
    }
    const user: User = {
      id: 'user-' + Date.now(),
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=0d9488&color=fff`,
    };
    return of(user).pipe(
      delay(1000),
      tap((u) => {
        const token = 'demo-jwt-' + Date.now();
        this.persist(u, token, true);
        this.currentUser.set(u);
        this.token.set(token);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.token.set(null);
    this.router.navigate(['/auth/login']);
  }

  updateProfile(updates: Partial<User>): void {
    const user = this.currentUser();
    if (!user) return;
    const updated = { ...user, ...updates };
    this.currentUser.set(updated);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
  }

  private persist(user: User, token: string, remember?: boolean): void {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(AUTH_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));
    if (!remember) {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  private loadToken(): string | null {
    return localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
  }
}
