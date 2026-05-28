import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { VendorAuthService } from '../../../services/vendor-auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-vendor-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <div class="brand">
          <div class="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          @if (!collapsed) {
            <div class="brand-text">
              <span class="brand-name">SellerHub</span>
              <span class="brand-sub">Vendor Portal</span>
            </div>
          }
        </div>
        <button class="toggle-btn" (click)="toggleSidebar.emit()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        @for (item of navItems; track item.route) {
          <a [routerLink]="item.route" routerLinkActive="active" class="nav-item" [title]="collapsed ? item.label : ''">
            <span class="nav-icon" [innerHTML]="item.icon"></span>
            @if (!collapsed) { <span class="nav-label">{{ item.label }}</span> }
          </a>
        }
      </nav>

      <div class="sidebar-footer">
        <button class="nav-item logout-btn" (click)="logout()" [title]="collapsed ? 'Logout' : ''">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </span>
          @if (!collapsed) { <span class="nav-label">Logout</span> }
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed; top: 0; left: 0; height: 100vh; width: 260px;
      background: linear-gradient(180deg, #1e1b4b 0%, #312e81 100%);
      display: flex; flex-direction: column;
      transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
      z-index: 100; overflow: hidden;
    }
    .sidebar.collapsed { width: 72px; }
    .sidebar-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.25rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.1);
      min-height: 72px;
    }
    .brand { display: flex; align-items: center; gap: 0.75rem; overflow: hidden; }
    .brand-icon {
      width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      display: flex; align-items: center; justify-content: center; color: #fff;
    }
    .brand-text { overflow: hidden; }
    .brand-name { display: block; font-size: 1rem; font-weight: 700; color: #fff; white-space: nowrap; }
    .brand-sub { display: block; font-size: 0.7rem; color: #a5b4fc; white-space: nowrap; }
    .toggle-btn {
      color: #a5b4fc; padding: 0.4rem; border-radius: 6px; flex-shrink: 0;
      transition: all 0.2s; cursor: pointer; background: none; border: none;
      &:hover { background: rgba(255,255,255,0.1); color: #fff; }
    }
    .sidebar-nav { flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
    .nav-item {
      display: flex; align-items: center; gap: 0.75rem; padding: 0.7rem 0.75rem;
      border-radius: 10px; color: #c7d2fe; text-decoration: none;
      transition: all 0.2s; cursor: pointer; white-space: nowrap; overflow: hidden;
      font-size: 0.875rem; font-weight: 500; border: none; background: none; width: 100%;
      &:hover { background: rgba(255,255,255,0.1); color: #fff; }
      &.active { background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #fff; box-shadow: 0 4px 12px rgba(124,58,237,0.4); }
    }
    .nav-icon { display: flex; align-items: center; flex-shrink: 0; width: 20px; height: 20px;
      svg { width: 18px; height: 18px; }
    }
    .nav-label { font-size: 0.875rem; }
    .sidebar-footer { padding: 0.75rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .logout-btn { color: #fca5a5; &:hover { background: rgba(239,68,68,0.15); color: #f87171; } }
    @media (max-width: 768px) {
      .sidebar { transform: translateX(-100%); }
      .sidebar.collapsed { transform: translateX(-100%); }
    }
  `]
})
export class VendorSidebarComponent {
  @Input() collapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/vendor/dashboard', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
    { label: 'Products', route: '/vendor/products', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>' },
    { label: 'Add Product', route: '/vendor/products/add', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>' },
    { label: 'Inventory', route: '/vendor/inventory', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' },
    { label: 'Orders', route: '/vendor/orders', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' },
    { label: 'Returns', route: '/vendor/returns', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>' },
    { label: 'Wallet', route: '/vendor/wallet', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' },
    { label: 'Reports', route: '/vendor/reports', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
    { label: 'Support Center', route: '/vendor/support', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>' },
    { label: 'Profile', route: '/vendor/profile', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
    { label: 'Settings', route: '/vendor/settings', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>' },
  ];

  constructor(private vendorAuth: VendorAuthService) {}

  logout() { this.vendorAuth.logout(); }
}
