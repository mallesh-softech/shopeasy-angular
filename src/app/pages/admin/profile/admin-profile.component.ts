import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminAuthService } from '../services/admin-auth.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.scss'
})
export class AdminProfileComponent {
  admin;
  activeTab = signal('Profile');
  tabs = ['Profile', 'Security', 'Activity'];
  profileSaved = signal(false);
  passwordSaved = signal(false);
  passwordError = signal('');

  profileForm: FormGroup;
  passwordForm: FormGroup;

  securityItems = [
    { label: 'Password Strength', status: 'good', statusText: 'Strong' },
    { label: 'Two-Factor Auth', status: 'warn', statusText: 'Not Enabled' },
    { label: 'Login Alerts', status: 'good', statusText: 'Enabled' },
    { label: 'Session Security', status: 'good', statusText: 'Active' },
  ];

  activityLogs = [
    { id: 1, type: 'login', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>', action: 'Logged in successfully', time: 'Just now', ip: '192.168.1.1' },
    { id: 2, type: 'update', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', action: 'Profile updated', time: '2 days ago', ip: '192.168.1.1' },
    { id: 3, type: 'security', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', action: 'Password changed', time: '1 week ago', ip: '192.168.1.1' },
    { id: 4, type: 'login', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>', action: 'Logged in from new device', time: '2 weeks ago', ip: '10.0.0.5' },
  ];

  constructor(private adminAuth: AdminAuthService, private fb: FormBuilder) {
    this.admin = this.adminAuth.admin;
    this.profileForm = this.fb.group({
      name: [this.admin()?.name || ''],
      email: [this.admin()?.email || '', [Validators.email]],
      phone: [''],
    });
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.adminAuth.updateProfile({ name: this.profileForm.value.name, email: this.profileForm.value.email });
    this.profileSaved.set(true);
    setTimeout(() => this.profileSaved.set(false), 3000);
  }

  changePassword(): void {
    this.passwordError.set('');
    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) { this.passwordError.set('Passwords do not match'); return; }
    if (this.passwordForm.invalid) return;
    this.passwordSaved.set(true);
    this.passwordForm.reset();
    setTimeout(() => this.passwordSaved.set(false), 3000);
  }
}
