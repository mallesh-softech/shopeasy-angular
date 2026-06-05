import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  AdminStats, VendorRequest, AdminVendor, AdminCustomer,
  AdminProduct, AdminOrder, AdminPayment, RevenueData
} from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminDataService {

  getStats(): Observable<AdminStats> {
    return of({
      totalOrders: 12847,
      totalVendors: 342,
      totalCustomers: 28491,
      totalRevenue: 4823650,
      pendingVendorRequests: 18,
      activeProducts: 9234,
      ordersGrowth: 12.4,
      revenueGrowth: 18.7,
    }).pipe(delay(600));
  }

  getVendorRequests(): Observable<VendorRequest[]> {
    return of([
      { id: 'vr-1', ownerName: 'Rajesh Kumar', businessName: 'TechZone Electronics', email: 'rajesh@techzone.com', phone: '+91 98765 43210', gstNumber: '27AAPFU0939F1ZV', businessType: 'Electronics', status: 'pending' as const, submittedAt: '2025-01-10', documents: ['gst.pdf', 'pan.pdf'] },
      { id: 'vr-2', ownerName: 'Priya Sharma', businessName: 'Fashion Hub', email: 'priya@fashionhub.com', phone: '+91 87654 32109', gstNumber: '29AABCT1332L1ZN', businessType: 'Fashion', status: 'pending' as const, submittedAt: '2025-01-11', documents: ['gst.pdf'] },
      { id: 'vr-3', ownerName: 'Amit Patel', businessName: 'Home Essentials', email: 'amit@homeessentials.com', phone: '+91 76543 21098', gstNumber: '24AAACR5055K1Z5', businessType: 'Home & Living', status: 'approved' as const, submittedAt: '2025-01-08', documents: ['gst.pdf', 'pan.pdf', 'bank.pdf'] },
      { id: 'vr-4', ownerName: 'Sunita Verma', businessName: 'Beauty World', email: 'sunita@beautyworld.com', phone: '+91 65432 10987', gstNumber: '07AAACR5055K1Z5', businessType: 'Beauty', status: 'rejected' as const, submittedAt: '2025-01-07', documents: ['gst.pdf'] },
      { id: 'vr-5', ownerName: 'Vikram Singh', businessName: 'Sports Arena', email: 'vikram@sportsarena.com', phone: '+91 54321 09876', gstNumber: '09AABCT1332L1ZN', businessType: 'Sports', status: 'pending' as const, submittedAt: '2025-01-12', documents: ['gst.pdf', 'pan.pdf'] },
    ]).pipe(delay(500));
  }

  getVendors(): Observable<AdminVendor[]> {
    return of([
      { id: 'v-1', ownerName: 'Rajesh Kumar', businessName: 'TechZone Electronics', email: 'rajesh@techzone.com', phone: '+91 98765 43210', status: 'active' as const, totalProducts: 145, revenue: 892340, joinedAt: '2024-03-15', verified: true },
      { id: 'v-2', ownerName: 'Priya Sharma', businessName: 'Fashion Hub', email: 'priya@fashionhub.com', phone: '+91 87654 32109', status: 'active' as const, totalProducts: 89, revenue: 456780, joinedAt: '2024-04-20', verified: true },
      { id: 'v-3', ownerName: 'Amit Patel', businessName: 'Home Essentials', email: 'amit@homeessentials.com', phone: '+91 76543 21098', status: 'suspended' as const, totalProducts: 67, revenue: 234560, joinedAt: '2024-05-10', verified: false },
      { id: 'v-4', ownerName: 'Sunita Verma', businessName: 'Beauty World', email: 'sunita@beautyworld.com', phone: '+91 65432 10987', status: 'active' as const, totalProducts: 112, revenue: 678900, joinedAt: '2024-02-28', verified: true },
      { id: 'v-5', ownerName: 'Vikram Singh', businessName: 'Sports Arena', email: 'vikram@sportsarena.com', phone: '+91 54321 09876', status: 'active' as const, totalProducts: 78, revenue: 345670, joinedAt: '2024-06-05', verified: true },
      { id: 'v-6', ownerName: 'Meena Joshi', businessName: 'Book Corner', email: 'meena@bookcorner.com', phone: '+91 43210 98765', status: 'pending' as const, totalProducts: 234, revenue: 123450, joinedAt: '2024-07-12', verified: false },
    ]).pipe(delay(500));
  }

  getCustomers(): Observable<AdminCustomer[]> {
    return of([
      { id: 'c-1', name: 'Arjun Mehta', email: 'arjun@email.com', phone: '+91 98765 43210', ordersCount: 24, totalSpent: 45670, status: 'active' as const, joinedAt: '2024-01-15' },
      { id: 'c-2', name: 'Kavya Reddy', email: 'kavya@email.com', phone: '+91 87654 32109', ordersCount: 18, totalSpent: 32450, status: 'active' as const, joinedAt: '2024-02-20' },
      { id: 'c-3', name: 'Rohit Gupta', email: 'rohit@email.com', phone: '+91 76543 21098', ordersCount: 7, totalSpent: 12340, status: 'blocked' as const, joinedAt: '2024-03-10' },
      { id: 'c-4', name: 'Ananya Singh', email: 'ananya@email.com', phone: '+91 65432 10987', ordersCount: 31, totalSpent: 67890, status: 'active' as const, joinedAt: '2023-12-05' },
      { id: 'c-5', name: 'Deepak Nair', email: 'deepak@email.com', phone: '+91 54321 09876', ordersCount: 12, totalSpent: 23450, status: 'active' as const, joinedAt: '2024-04-18' },
      { id: 'c-6', name: 'Pooja Iyer', email: 'pooja@email.com', phone: '+91 43210 98765', ordersCount: 45, totalSpent: 98760, status: 'active' as const, joinedAt: '2023-11-22' },
      { id: 'c-7', name: 'Sanjay Mishra', email: 'sanjay@email.com', phone: '+91 32109 87654', ordersCount: 3, totalSpent: 5670, status: 'blocked' as const, joinedAt: '2024-05-30' },
    ]).pipe(delay(500));
  }

  getProducts(): Observable<AdminProduct[]> {
    return of([
      { id: 'p-1', name: 'Sony WH-1000XM5 Headphones', vendorName: 'TechZone Electronics', category: 'Electronics', price: 29990, stock: 45, status: 'active' as const, featured: true, sales: 234 },
      { id: 'p-2', name: 'Nike Air Max 270', vendorName: 'Sports Arena', category: 'Sports', price: 8999, stock: 0, status: 'out_of_stock' as const, featured: false, sales: 567 },
      { id: 'p-3', name: 'Floral Summer Dress', vendorName: 'Fashion Hub', category: 'Fashion', price: 1499, stock: 120, status: 'active' as const, featured: true, sales: 890 },
      { id: 'p-4', name: 'Ceramic Coffee Mug Set', vendorName: 'Home Essentials', category: 'Home', price: 799, stock: 200, status: 'inactive' as const, featured: false, sales: 123 },
      { id: 'p-5', name: 'Vitamin C Serum', vendorName: 'Beauty World', category: 'Beauty', price: 599, stock: 89, status: 'active' as const, featured: false, sales: 1234 },
      { id: 'p-6', name: 'Atomic Habits Book', vendorName: 'Book Corner', category: 'Books', price: 399, stock: 300, status: 'active' as const, featured: true, sales: 456 },
    ]).pipe(delay(500));
  }

  getOrders(): Observable<AdminOrder[]> {
    return of([
      { id: 'ORD-001', customerId: 'c-1', customerName: 'Arjun Mehta', vendorName: 'TechZone Electronics', amount: 29990, paymentStatus: 'paid' as const, deliveryStatus: 'delivered' as const, orderDate: '2025-01-10', items: 1 },
      { id: 'ORD-002', customerId: 'c-2', customerName: 'Kavya Reddy', vendorName: 'Fashion Hub', amount: 2998, paymentStatus: 'paid' as const, deliveryStatus: 'shipped' as const, orderDate: '2025-01-11', items: 2 },
      { id: 'ORD-003', customerId: 'c-3', customerName: 'Rohit Gupta', vendorName: 'Sports Arena', amount: 8999, paymentStatus: 'pending' as const, deliveryStatus: 'pending' as const, orderDate: '2025-01-12', items: 1 },
      { id: 'ORD-004', customerId: 'c-4', customerName: 'Ananya Singh', vendorName: 'Beauty World', amount: 1797, paymentStatus: 'paid' as const, deliveryStatus: 'delivered' as const, orderDate: '2025-01-09', items: 3 },
      { id: 'ORD-005', customerId: 'c-5', customerName: 'Deepak Nair', vendorName: 'Home Essentials', amount: 799, paymentStatus: 'refunded' as const, deliveryStatus: 'cancelled' as const, orderDate: '2025-01-08', items: 1 },
      { id: 'ORD-006', customerId: 'c-6', customerName: 'Pooja Iyer', vendorName: 'Book Corner', amount: 1197, paymentStatus: 'paid' as const, deliveryStatus: 'shipped' as const, orderDate: '2025-01-13', items: 3 },
      { id: 'ORD-007', customerId: 'c-1', customerName: 'Arjun Mehta', vendorName: 'TechZone Electronics', amount: 5999, paymentStatus: 'failed' as const, deliveryStatus: 'cancelled' as const, orderDate: '2025-01-14', items: 1 },
    ]).pipe(delay(500));
  }

  getPayments(): Observable<AdminPayment[]> {
    return of([
      { id: 'TXN-001', orderId: 'ORD-001', customerName: 'Arjun Mehta', vendorName: 'TechZone Electronics', amount: 29990, type: 'payment' as const, status: 'success' as const, date: '2025-01-10', method: 'UPI' },
      { id: 'TXN-002', orderId: 'ORD-002', customerName: 'Kavya Reddy', vendorName: 'Fashion Hub', amount: 2998, type: 'payment' as const, status: 'success' as const, date: '2025-01-11', method: 'Card' },
      { id: 'TXN-003', orderId: 'ORD-003', customerName: 'Rohit Gupta', vendorName: 'Sports Arena', amount: 8999, type: 'payment' as const, status: 'pending' as const, date: '2025-01-12', method: 'Net Banking' },
      { id: 'TXN-004', orderId: 'ORD-005', customerName: 'Deepak Nair', vendorName: 'Home Essentials', amount: 799, type: 'refund' as const, status: 'success' as const, date: '2025-01-09', method: 'UPI' },
      { id: 'TXN-005', orderId: 'ORD-007', customerName: 'Arjun Mehta', vendorName: 'TechZone Electronics', amount: 5999, type: 'payment' as const, status: 'failed' as const, date: '2025-01-14', method: 'Card' },
      { id: 'PAY-001', orderId: '', customerName: '', vendorName: 'TechZone Electronics', amount: 25191, type: 'payout' as const, status: 'success' as const, date: '2025-01-13', method: 'Bank Transfer' },
      { id: 'PAY-002', orderId: '', customerName: '', vendorName: 'Fashion Hub', amount: 2548, type: 'payout' as const, status: 'pending' as const, date: '2025-01-14', method: 'Bank Transfer' },
    ]).pipe(delay(500));
  }

  getRevenueData(): Observable<RevenueData[]> {
    return of([
      { label: 'Jul', revenue: 285000, orders: 890 },
      { label: 'Aug', revenue: 342000, orders: 1020 },
      { label: 'Sep', revenue: 298000, orders: 945 },
      { label: 'Oct', revenue: 415000, orders: 1230 },
      { label: 'Nov', revenue: 523000, orders: 1560 },
      { label: 'Dec', revenue: 687000, orders: 2100 },
      { label: 'Jan', revenue: 482000, orders: 1450 },
    ]).pipe(delay(400));
  }
}
