import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VendorAuthService } from '../../services/vendor-auth.service';

@Component({
  selector: 'app-vendor-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-banner">
        <div class="banner-content">
          <div class="banner-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <h1>SellerHub</h1>
          <p>Your complete marketplace seller dashboard</p>
          <div class="stats-row">
            <div class="stat"><span class="stat-val">50K+</span><span class="stat-lbl">Sellers</span></div>
            <div class="stat"><span class="stat-val">2M+</span><span class="stat-lbl">Products</span></div>
            <div class="stat"><span class="stat-val">₹500Cr+</span><span class="stat-lbl">GMV</span></div>
          </div>
          <div class="features">
            @for (f of features; track f) {
              <div class="feature-item">
                <span class="check">✓</span>
                <span>{{ f }}</span>
              </div>
            }
          </div>
        </div>
        <div class="banner-illustration">
          <div class="float-card card1">
            <span>📦</span>
            <div><strong>1,247</strong><small>Orders Today</small></div>
          </div>
          <div class="float-card card2">
            <span>💰</span>
            <div><strong>₹2.8L</strong><small>Revenue</small></div>
          </div>
          <div class="float-card card3">
            <span>⭐</span>
            <div><strong>4.8</strong><small>Rating</small></div>
          </div>
        </div>
      </div>

      <div class="login-form-side">
        <div class="form-container">
          <div class="form-header">
            <h2>Welcome back, Seller!</h2>
            <p>Sign in to your vendor dashboard</p>
          </div>

          @if (error()) {
            <div class="alert-error">{{ error() }}</div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" formControlName="email" class="form-input"
                [class.invalid]="form.get('email')?.invalid && form.get('email')?.touched"
                placeholder="seller@example.com" />
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <span class="error">Valid email is required</span>
              }
            </div>

            <div class="form-group">
              <label>Password</label>
              <div class="input-wrap">
                <input [type]="showPass() ? 'text' : 'password'" formControlName="password" class="form-input"
                  [class.invalid]="form.get('password')?.invalid && form.get('password')?.touched"
                  placeholder="Enter your password" />
                <button type="button" class="eye-btn" (click)="showPass.set(!showPass())">
                  @if (showPass()) {
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  } @else {
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              @if (form.get('password')?.invalid && form.get('password')?.touched) {
                <span class="error">Password must be at least 6 characters</span>
              }
            </div>

            <div class="form-row">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="rememberMe" />
                <span>Remember me</span>
              </label>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" class="btn-submit" [disabled]="loading()">
              @if (loading()) {
                <span class="spinner"></span> Signing in...
              } @else {
                Sign In to Dashboard
              }
            </button>
          </form>

          <p class="register-link">
            New seller? <a routerLink="/vendor/auth/register">Register your business</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page { display: flex; min-height: 100vh; }
    .login-banner {
      flex: 1; background: linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%);
      display: flex; flex-direction: column; justify-content: center; padding: 3rem;
      position: relative; overflow: hidden;
      &::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
    }
    .banner-content { position: relative; z-index: 1; color: #fff; }
    .banner-logo {
      width: 56px; height: 56px; background: rgba(255,255,255,0.15); border-radius: 14px;
      display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;
      backdrop-filter: blur(10px);
    }
    .banner-content h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; }
    .banner-content p { font-size: 1.1rem; color: #c4b5fd; margin-bottom: 2rem; }
    .stats-row { display: flex; gap: 2rem; margin-bottom: 2rem; }
    .stat { display: flex; flex-direction: column; }
    .stat-val { font-size: 1.5rem; font-weight: 700; }
    .stat-lbl { font-size: 0.8rem; color: #a5b4fc; }
    .features { display: flex; flex-direction: column; gap: 0.75rem; }
    .feature-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; color: #e0e7ff; }
    .check { width: 20px; height: 20px; background: rgba(167,139,250,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; flex-shrink: 0; }
    .banner-illustration { position: absolute; bottom: 2rem; right: 2rem; }
    .float-card {
      position: absolute; background: rgba(255,255,255,0.12); backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; padding: 0.75rem 1rem;
      display: flex; align-items: center; gap: 0.75rem; color: #fff; white-space: nowrap;
      animation: float 3s ease-in-out infinite;
      span { font-size: 1.5rem; }
      div { display: flex; flex-direction: column; }
      strong { font-size: 0.9rem; font-weight: 700; }
      small { font-size: 0.7rem; color: #c4b5fd; }
    }
    .card1 { bottom: 120px; right: 20px; animation-delay: 0s; }
    .card2 { bottom: 60px; right: 160px; animation-delay: 1s; }
    .card3 { bottom: 0; right: 20px; animation-delay: 2s; }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

    .login-form-side {
      width: 480px; display: flex; align-items: center; justify-content: center;
      padding: 2rem; background: #fff;
    }
    .form-container { width: 100%; max-width: 400px; }
    .form-header { margin-bottom: 2rem; }
    .form-header h2 { font-size: 1.75rem; font-weight: 700; color: #1e1b4b; margin-bottom: 0.375rem; }
    .form-header p { color: #64748b; font-size: 0.9rem; }
    .alert-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; margin-bottom: 1.25rem; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.4rem; }
    .form-input {
      width: 100%; padding: 0.75rem 1rem; border: 1.5px solid #e2e8f0; border-radius: 10px;
      font-size: 0.9375rem; transition: all 0.2s; background: #f8fafc;
      &:focus { outline: none; border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
      &.invalid { border-color: #ef4444; }
    }
    .input-wrap { position: relative; }
    .input-wrap .form-input { padding-right: 3rem; }
    .eye-btn { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); color: #94a3b8; background: none; border: none; cursor: pointer; padding: 0.25rem; &:hover { color: #7c3aed; } }
    .error { font-size: 0.8rem; color: #ef4444; margin-top: 0.3rem; display: block; }
    .form-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #374151; cursor: pointer; input { accent-color: #7c3aed; } }
    .forgot-link { font-size: 0.875rem; color: #7c3aed; font-weight: 500; text-decoration: none; &:hover { text-decoration: underline; } }
    .btn-submit {
      width: 100%; padding: 0.875rem; background: linear-gradient(135deg, #7c3aed, #6d28d9);
      color: #fff; border: none; border-radius: 10px; font-size: 0.9375rem; font-weight: 600;
      cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.4); }
      &:disabled { opacity: 0.7; cursor: not-allowed; }
    }
    .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .register-link { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: #64748b;
      a { color: #7c3aed; font-weight: 600; text-decoration: none; &:hover { text-decoration: underline; } }
    }
    @media (max-width: 900px) {
      .login-banner { display: none; }
      .login-form-side { width: 100%; }
    }
  `]
})
export class VendorLoginComponent {
  loading = signal(false);
  error = signal('');
  showPass = signal(false);
  form!: ReturnType<FormBuilder['group']>;

  features = [
    'Real-time order management',
    'Advanced analytics & reports',
    'Inventory tracking & alerts',
    'Instant payment settlements',
  ];

  constructor(private fb: FormBuilder, private vendorAuth: VendorAuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');
    const { email, password } = this.form.value;
    this.vendorAuth.login(email!, password!).subscribe({
      next: () => this.router.navigate(['/vendor/dashboard']),
      error: (e) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
}
