import { Component, Signal, signal } from '@angular/core';
import { VendorAuthService } from '../../../services/vendor-auth.service';
import { VendorUser } from '../../../models/vendor.models';

@Component({
  selector: 'app-vendor-topbar',
  standalone: true,
  imports: [],
  template: `
    <header class="topbar">
      <div class="topbar-left">
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search products, orders..." />
        </div>
      </div>

      <div class="topbar-right">

        <!-- NOTIFICATIONS -->
        <div class="notif-menu">
          <button class="icon-btn" (click)="notifOpen.set(!notifOpen())" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            @if (unreadCount() > 0) {
              <span class="badge">{{ unreadCount() }}</span>
            }
          </button>

          @if (notifOpen()) {
            <div class="notif-dropdown">
              <div class="notif-header">
                <strong>Notifications</strong>
                <button (click)="markAllRead()">Mark all read</button>
              </div>
              @for (n of notifications(); track n.id) {
                <div class="notif-item" [class.unread]="!n.read" (click)="n.read = true">
                  <span class="notif-icon">{{ n.icon }}</span>
                  <div class="notif-body">
                    <p class="notif-title">{{ n.title }}</p>
                    <p class="notif-msg">{{ n.message }}</p>
                    <span class="notif-time">{{ n.time }}</span>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <div class="vendor-profile">
          <img [src]="vendor()?.avatar || 'https://ui-avatars.com/api/?name=Vendor&background=7c3aed&color=fff'" [alt]="vendor()?.ownerName" />
          <div class="profile-info">
            <span class="profile-name">{{ vendor()?.ownerName || 'Vendor' }}</span>
            <span class="profile-shop">{{ vendor()?.businessName || 'My Shop' }}</span>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      height: 72px; background: #fff; border-bottom: 1px solid #e2e8f0;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 1.5rem; position: sticky; top: 0; z-index: 50;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .topbar-left { display: flex; align-items: center; gap: 1rem; }
    .search-box {
      display: flex; align-items: center; gap: 0.5rem;
      background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px;
      padding: 0.5rem 1rem; width: 280px; transition: all 0.2s;
      svg { color: #94a3b8; flex-shrink: 0; }
      input { border: none; background: none; outline: none; font-size: 0.875rem; color: #1e293b; width: 100%;
        &::placeholder { color: #94a3b8; }
      }
      &:focus-within { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
    }
    .topbar-right { display: flex; align-items: center; gap: 0.5rem; }
    .icon-btn {
      position: relative; color: #64748b; padding: 0.5rem; border-radius: 8px;
      cursor: pointer; background: none; border: none; transition: all 0.2s;
      &:hover { background: #f1f5f9; color: #7c3aed; }
    }
    .badge {
      position: absolute; top: 4px; right: 4px; min-width: 16px; height: 16px;
      background: #ef4444; color: #fff; font-size: 0.65rem; font-weight: 700;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      padding: 0 3px;
    }

    /* Notifications dropdown */
    .notif-menu { position: relative; }
    .notif-dropdown {
      position: absolute; top: calc(100% + 8px); right: 0; width: 320px;
      background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
      box-shadow: 0 12px 40px rgba(15,23,42,0.15); z-index: 100; overflow: hidden;
    }
    .notif-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.875rem 1rem; border-bottom: 1px solid #f1f5f9;
      strong { font-size: 0.9rem; font-weight: 700; color: #1e1b4b; }
      button { font-size: 0.75rem; color: #7c3aed; font-weight: 600; cursor: pointer; background: none; border: none;
        &:hover { text-decoration: underline; }
      }
    }
    .notif-item {
      display: flex; gap: 0.75rem; padding: 0.875rem 1rem;
      border-bottom: 1px solid #f8fafc; cursor: pointer; transition: background 0.15s;
      &:last-child { border-bottom: none; }
      &.unread { background: rgba(124,58,237,0.04); }
      &:hover { background: #f8fafc; }
    }
    .notif-icon { font-size: 1.375rem; flex-shrink: 0; margin-top: 2px; }
    .notif-body { flex: 1; min-width: 0; }
    .notif-title { font-size: 0.8375rem; font-weight: 600; color: #1e1b4b; margin-bottom: 0.15rem; }
    .notif-msg { font-size: 0.8rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .notif-time { font-size: 0.72rem; color: #94a3b8; margin-top: 0.25rem; display: block; }

    .vendor-profile {
      display: flex; align-items: center; gap: 0.625rem; padding: 0.375rem 0.75rem;
      border-radius: 10px; cursor: pointer; transition: all 0.2s; margin-left: 0.5rem;
      &:hover { background: #f8fafc; }
      img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0; }
    }
    .profile-info { display: flex; flex-direction: column; }
    .profile-name { font-size: 0.875rem; font-weight: 600; color: #1e293b; line-height: 1.2; }
    .profile-shop { font-size: 0.75rem; color: #7c3aed; font-weight: 500; }
    @media (max-width: 640px) {
      .search-box { display: none; }
      .profile-info { display: none; }
    }
  `]
})
export class VendorTopbarComponent {
  vendor: Signal<VendorUser | null>;
  notifOpen = signal(false);

  notifications = signal([
    { id: 1, icon: '🛒', title: 'New Order Received!', message: 'Order #ORD-2024-007 placed by Kiran Rao.', time: '2 mins ago', read: false },
    { id: 2, icon: '⚠️', title: 'Low Stock Alert', message: 'Running Shoes Pro X has only 8 units left.', time: '30 mins ago', read: false },
    { id: 3, icon: '💰', title: 'Payment Settled', message: '₹12,450 credited to your bank account.', time: '2 hours ago', read: false },
    { id: 4, icon: '⭐', title: 'New Product Review', message: 'Customer rated Headphones 5 stars!', time: 'Yesterday', read: true },
    { id: 5, icon: '📦', title: 'Order Delivered', message: 'Order #ORD-2024-001 marked as delivered.', time: '2 days ago', read: true },
  ]);

  unreadCount = signal(0);

  constructor(private vendorAuth: VendorAuthService) {
    this.vendor = this.vendorAuth.vendor;
    this.updateUnread();
  }

  updateUnread() {
    this.unreadCount.set(this.notifications().filter(n => !n.read).length);
  }

  markAllRead() {
    this.notifications.update(ns => ns.map(n => ({ ...n, read: true })));
    this.unreadCount.set(0);
  }
}
