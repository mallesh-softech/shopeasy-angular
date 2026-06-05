import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminAuthService } from '../../pages/admin/services/admin-auth.service';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-topbar.component.html',
  styleUrl: './admin-topbar.component.scss'
})
export class AdminTopbarComponent {
  dropdownOpen = signal(false);
  notifOpen = signal(false);
  admin;

  notifications = signal([
    { id: 1, icon: '🛒', title: 'New Order Placed', message: 'Order #ORD-2025-018 placed by Kiran Rao.', time: '2 mins ago', read: false },
    { id: 2, icon: '🏪', title: 'New Vendor Request', message: 'StyleCraft Apparel submitted a registration.', time: '15 mins ago', read: false },
    { id: 3, icon: '⚠️', title: 'Low Stock Alert', message: 'Wireless Headphones Pro has only 5 units left.', time: '1 hour ago', read: false },
    { id: 4, icon: '💰', title: 'Payment Received', message: '₹29,990 payment confirmed for ORD-2025-015.', time: '3 hours ago', read: true },
    { id: 5, icon: '👤', title: 'New Customer Signup', message: 'Priya Sharma created a new account.', time: 'Yesterday', read: true },
  ]);

  unreadCount = signal(0);

  constructor(private adminAuth: AdminAuthService) {
    this.admin = this.adminAuth.admin;
    this.updateUnread();
  }

  updateUnread() {
    this.unreadCount.set(this.notifications().filter(n => !n.read).length);
  }

  markAllRead() {
    this.notifications.update(ns => ns.map(n => ({ ...n, read: true })));
    this.unreadCount.set(0);
  }

  logout() { this.adminAuth.logout(); }
}
