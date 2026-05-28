import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { VendorProduct, VendorOrder, InventoryItem, ProductReview, Coupon, Transaction, PayoutRequest, ReturnRequest, SupportTicket, FaqItem } from '../models/vendor.models';

@Injectable({ providedIn: 'root' })
export class VendorDataService {
  private products: VendorProduct[] = [
    { id: 'vp1', name: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', subcategory: 'Audio', brand: 'SoundPro', price: 4999, discount: 15, stock: 45, sku: 'SP-WNC-001', status: 'active', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop', rating: 4.5, salesCount: 234, tags: ['wireless', 'audio'], description: 'Premium wireless headphones' },
    { id: 'vp2', name: 'Running Shoes Pro X', category: 'Fashion', subcategory: 'Footwear', brand: 'SpeedRun', price: 2999, discount: 10, stock: 8, sku: 'SR-RSP-002', status: 'active', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop', rating: 4.3, salesCount: 189, tags: ['shoes', 'sports'], description: 'High performance running shoes' },
    { id: 'vp3', name: 'Smart Watch Series 5', category: 'Electronics', subcategory: 'Wearables', brand: 'TimeTech', price: 8999, discount: 20, stock: 0, sku: 'TT-SW5-003', status: 'inactive', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop', rating: 4.7, salesCount: 312, tags: ['smartwatch', 'wearable'], description: 'Advanced smart watch' },
    { id: 'vp4', name: 'Leather Handbag Premium', category: 'Fashion', subcategory: 'Bags', brand: 'LuxBag', price: 3499, discount: 5, stock: 23, sku: 'LB-LHP-004', status: 'active', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&h=80&fit=crop', rating: 4.2, salesCount: 98, tags: ['handbag', 'leather'], description: 'Premium leather handbag' },
    { id: 'vp5', name: 'Yoga Mat Premium', category: 'Sports', subcategory: 'Fitness', brand: 'FitLife', price: 1299, discount: 0, stock: 67, sku: 'FL-YMP-005', status: 'active', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=80&h=80&fit=crop', rating: 4.4, salesCount: 156, tags: ['yoga', 'fitness'], description: 'Non-slip yoga mat' },
    { id: 'vp6', name: 'Bluetooth Speaker Mini', category: 'Electronics', subcategory: 'Audio', brand: 'SoundPro', price: 1999, discount: 12, stock: 3, sku: 'SP-BSM-006', status: 'draft', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=80&h=80&fit=crop', rating: 4.1, salesCount: 78, tags: ['speaker', 'bluetooth'], description: 'Portable bluetooth speaker' },
  ];

  private orders: VendorOrder[] = [
    { id: 'ORD-2024-001', customerId: 'c1', customerName: 'Rahul Sharma', customerEmail: 'rahul@example.com', product: 'Wireless Headphones', productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50&h=50&fit=crop', amount: 4249, paymentStatus: 'paid', deliveryStatus: 'delivered', orderDate: '2024-12-01', shippingAddress: '42 MG Road, Bengaluru - 560034' },
    { id: 'ORD-2024-002', customerId: 'c2', customerName: 'Priya Patel', customerEmail: 'priya@example.com', product: 'Running Shoes Pro X', productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50&h=50&fit=crop', amount: 2699, paymentStatus: 'paid', deliveryStatus: 'shipped', orderDate: '2024-12-03', shippingAddress: '15 Park Street, Mumbai - 400001' },
    { id: 'ORD-2024-003', customerId: 'c3', customerName: 'Amit Kumar', customerEmail: 'amit@example.com', product: 'Smart Watch Series 5', productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50&h=50&fit=crop', amount: 7199, paymentStatus: 'pending', deliveryStatus: 'pending', orderDate: '2024-12-05', shippingAddress: '8 Civil Lines, Delhi - 110001' },
    { id: 'ORD-2024-004', customerId: 'c4', customerName: 'Sneha Reddy', customerEmail: 'sneha@example.com', product: 'Leather Handbag', productImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=50&h=50&fit=crop', amount: 3324, paymentStatus: 'paid', deliveryStatus: 'packed', orderDate: '2024-12-06', shippingAddress: '22 Jubilee Hills, Hyderabad - 500033' },
    { id: 'ORD-2024-005', customerId: 'c5', customerName: 'Vikram Singh', customerEmail: 'vikram@example.com', product: 'Yoga Mat Premium', productImage: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=50&h=50&fit=crop', amount: 1299, paymentStatus: 'paid', deliveryStatus: 'accepted', orderDate: '2024-12-07', shippingAddress: '5 Sector 17, Chandigarh - 160017' },
    { id: 'ORD-2024-006', customerId: 'c6', customerName: 'Meera Nair', customerEmail: 'meera@example.com', product: 'Bluetooth Speaker', productImage: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=50&h=50&fit=crop', amount: 1759, paymentStatus: 'failed', deliveryStatus: 'rejected', orderDate: '2024-12-08', shippingAddress: '33 MG Road, Kochi - 682016' },
  ];

  private reviews: ProductReview[] = [
    { id: 'r1', productId: 'vp1', customerName: 'Rahul Sharma', avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=7c3aed&color=fff', rating: 5, title: 'Excellent sound quality!', comment: 'These headphones are absolutely amazing. The noise cancellation is top-notch and the bass is deep. Highly recommend!', date: '2024-12-01', verified: true },
    { id: 'r2', productId: 'vp1', customerName: 'Priya Patel', avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=2563eb&color=fff', rating: 4, title: 'Great value for money', comment: 'Very comfortable to wear for long hours. Battery life is impressive. Only minor issue is the ear cushions could be softer.', date: '2024-11-28', verified: true },
    { id: 'r3', productId: 'vp1', customerName: 'Amit Kumar', avatar: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=059669&color=fff', rating: 5, title: 'Best purchase this year', comment: 'Crystal clear audio and the mic quality for calls is superb. The build quality feels premium.', date: '2024-11-20', verified: false },
    { id: 'r4', productId: 'vp1', customerName: 'Sneha Reddy', avatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=d97706&color=fff', rating: 3, title: 'Decent but expected more', comment: 'Sound is good but the noise cancellation is not as effective in very loud environments. Still a decent product.', date: '2024-11-15', verified: true },
    { id: 'r5', productId: 'vp2', customerName: 'Vikram Singh', avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=dc2626&color=fff', rating: 5, title: 'Perfect running shoes!', comment: 'Lightweight and very comfortable. My running performance has improved significantly. Great grip on all surfaces.', date: '2024-12-03', verified: true },
    { id: 'r6', productId: 'vp2', customerName: 'Meera Nair', avatar: 'https://ui-avatars.com/api/?name=Meera+Nair&background=7c3aed&color=fff', rating: 4, title: 'Good quality shoes', comment: 'Fits true to size. Very breathable material. Used them for a half marathon and they held up great!', date: '2024-11-30', verified: true },
    { id: 'r7', productId: 'vp2', customerName: 'Kiran Rao', avatar: 'https://ui-avatars.com/api/?name=Kiran+Rao&background=0891b2&color=fff', rating: 4, title: 'Comfortable and stylish', comment: 'Great shoes for daily jogging. The cushioning is excellent. Would buy again.', date: '2024-11-22', verified: false },
    { id: 'r8', productId: 'vp3', customerName: 'Arjun Mehta', avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=7c3aed&color=fff', rating: 5, title: 'Smartwatch of the year!', comment: 'The display is stunning and the health tracking features are very accurate. Battery lasts 3 days easily.', date: '2024-12-05', verified: true },
    { id: 'r9', productId: 'vp3', customerName: 'Divya Krishnan', avatar: 'https://ui-avatars.com/api/?name=Divya+Krishnan&background=059669&color=fff', rating: 5, title: 'Worth every rupee', comment: 'Seamless integration with my phone. The sleep tracking is surprisingly accurate. Love the always-on display.', date: '2024-11-18', verified: true },
    { id: 'r10', productId: 'vp4', customerName: 'Pooja Sharma', avatar: 'https://ui-avatars.com/api/?name=Pooja+Sharma&background=d97706&color=fff', rating: 4, title: 'Beautiful handbag', comment: 'The leather quality is excellent and the stitching is very neat. Spacious enough for daily use. Gets compliments everywhere!', date: '2024-12-06', verified: true },
    { id: 'r11', productId: 'vp5', customerName: 'Ravi Teja', avatar: 'https://ui-avatars.com/api/?name=Ravi+Teja&background=2563eb&color=fff', rating: 5, title: 'Best yoga mat ever', comment: 'Non-slip surface is excellent. The thickness is perfect — not too thick, not too thin. Easy to clean and roll up.', date: '2024-12-07', verified: true },
    { id: 'r12', productId: 'vp5', customerName: 'Ananya Iyer', avatar: 'https://ui-avatars.com/api/?name=Ananya+Iyer&background=7c3aed&color=fff', rating: 4, title: 'Great for home workouts', comment: 'Good quality mat. The grip is fantastic even when sweaty. Highly recommend for yoga and pilates.', date: '2024-11-25', verified: false },
  ];

  getReviews(productId: string): Observable<ProductReview[]> {
    return of(this.reviews.filter(r => r.productId === productId)).pipe(delay(300));
  }

  getProducts(): Observable<VendorProduct[]> {
    return of(this.products).pipe(delay(400));
  }

  getOrders(): Observable<VendorOrder[]> {
    return of(this.orders).pipe(delay(400));
  }

  getInventory(): Observable<InventoryItem[]> {
    const items: InventoryItem[] = this.products.map(p => ({
      id: p.id,
      productName: p.name,
      sku: p.sku,
      currentStock: p.stock,
      threshold: 10,
      status: p.stock === 0 ? 'out-of-stock' : p.stock <= 10 ? 'low-stock' : 'in-stock',
      image: p.image,
    }));
    return of(items).pipe(delay(400));
  }

  getDashboardStats() {
    return of({
      totalRevenue: 284750,
      totalOrders: 1247,
      totalProducts: this.products.length,
      pendingOrders: 23,
      deliveredOrders: 1189,
      refundRequests: 12,
      revenueChange: 18.5,
      ordersChange: 12.3,
      productsChange: 4.2,
    }).pipe(delay(300));
  }

  getMonthlyRevenue() {
    return of([42000, 58000, 51000, 67000, 73000, 89000, 95000, 78000, 102000, 118000, 95000, 125000]);
  }

  updateOrderStatus(orderId: string, status: VendorOrder['deliveryStatus']): Observable<boolean> {
    const order = this.orders.find(o => o.id === orderId);
    if (order) order.deliveryStatus = status;
    return of(true).pipe(delay(300));
  }

  private coupons: Coupon[] = [
    { id: 'cp1', code: 'SAVE20', discountType: 'percentage', discountValue: 20, minOrderValue: 500, usageLimit: 100, usageCount: 43, startDate: '2024-12-01', expiryDate: '2024-12-31', applicableProducts: [], applicableCategories: ['Electronics'], status: 'active' },
    { id: 'cp2', code: 'FLAT150', discountType: 'flat', discountValue: 150, minOrderValue: 1000, usageLimit: 50, usageCount: 50, startDate: '2024-11-01', expiryDate: '2024-11-30', applicableProducts: [], applicableCategories: [], status: 'expired' },
    { id: 'cp3', code: 'FASHION10', discountType: 'percentage', discountValue: 10, minOrderValue: 800, usageLimit: 200, usageCount: 87, startDate: '2024-12-10', expiryDate: '2025-01-10', applicableProducts: [], applicableCategories: ['Fashion'], status: 'active' },
    { id: 'cp4', code: 'NEWUSER50', discountType: 'flat', discountValue: 50, minOrderValue: 300, usageLimit: 500, usageCount: 12, startDate: '2024-12-15', expiryDate: '2025-02-15', applicableProducts: [], applicableCategories: [], status: 'inactive' },
  ];

  private transactions: Transaction[] = [
    { id: 'TXN-001', orderId: 'ORD-2024-001', customer: 'Rahul Sharma', amount: 4249, commission: 424, finalPayout: 3825, status: 'paid', date: '2024-12-01' },
    { id: 'TXN-002', orderId: 'ORD-2024-002', customer: 'Priya Patel', amount: 2699, commission: 270, finalPayout: 2429, status: 'processing', date: '2024-12-03' },
    { id: 'TXN-003', orderId: 'ORD-2024-003', customer: 'Amit Kumar', amount: 7199, commission: 720, finalPayout: 6479, status: 'pending', date: '2024-12-05' },
    { id: 'TXN-004', orderId: 'ORD-2024-004', customer: 'Sneha Reddy', amount: 3324, commission: 332, finalPayout: 2992, status: 'paid', date: '2024-12-06' },
    { id: 'TXN-005', orderId: 'ORD-2024-005', customer: 'Vikram Singh', amount: 1299, commission: 130, finalPayout: 1169, status: 'paid', date: '2024-12-07' },
    { id: 'TXN-006', orderId: 'ORD-2024-006', customer: 'Meera Nair', amount: 1759, commission: 176, finalPayout: 1583, status: 'failed', date: '2024-12-08' },
  ];

  private payouts: PayoutRequest[] = [
    { id: 'PAY-001', amount: 15000, requestDate: '2024-11-30', processedDate: '2024-12-02', status: 'paid', bankAccount: 'HDFC ****4521' },
    { id: 'PAY-002', amount: 8500, requestDate: '2024-12-10', status: 'processing', bankAccount: 'HDFC ****4521' },
    { id: 'PAY-003', amount: 5000, requestDate: '2024-12-15', status: 'pending', bankAccount: 'HDFC ****4521' },
  ];

  private returns: ReturnRequest[] = [
    { id: 'RET-001', orderId: 'ORD-2024-001', product: 'Wireless Headphones', customer: 'Rahul Sharma', reason: 'Product not as described', refundAmount: 4249, status: 'requested', requestDate: '2024-12-05', productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50&h=50&fit=crop' },
    { id: 'RET-002', orderId: 'ORD-2024-002', product: 'Running Shoes Pro X', customer: 'Priya Patel', reason: 'Wrong size delivered', refundAmount: 2699, status: 'approved', requestDate: '2024-12-06', productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50&h=50&fit=crop' },
    { id: 'RET-003', orderId: 'ORD-2024-004', product: 'Leather Handbag', customer: 'Sneha Reddy', reason: 'Defective product', refundAmount: 3324, status: 'under-review', requestDate: '2024-12-08', productImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=50&h=50&fit=crop' },
    { id: 'RET-004', orderId: 'ORD-2024-005', product: 'Yoga Mat Premium', customer: 'Vikram Singh', reason: 'Changed mind', refundAmount: 1299, status: 'rejected', requestDate: '2024-12-09', productImage: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=50&h=50&fit=crop' },
    { id: 'RET-005', orderId: 'ORD-2024-003', product: 'Smart Watch Series 5', customer: 'Amit Kumar', reason: 'Not working properly', refundAmount: 7199, status: 'refunded', requestDate: '2024-12-10', productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50&h=50&fit=crop' },
  ];

  private tickets: SupportTicket[] = [
    { id: 'TKT-001', subject: 'Payment not received for order ORD-2024-001', category: 'Payments', priority: 'high', status: 'open', description: 'I have not received payment for the delivered order.', createdDate: '2024-12-05', messages: [{ sender: 'admin', message: 'We are looking into this issue.', time: '2024-12-05 10:30' }] },
    { id: 'TKT-002', subject: 'Product listing not showing', category: 'Products', priority: 'medium', status: 'in-progress', description: 'My product vp3 is not visible in search results.', createdDate: '2024-12-06', messages: [] },
    { id: 'TKT-003', subject: 'Refund process query', category: 'Refunds', priority: 'low', status: 'resolved', description: 'How long does refund take to process?', createdDate: '2024-12-01', messages: [{ sender: 'admin', message: 'Refunds are processed within 5-7 business days.', time: '2024-12-02 09:00' }] },
    { id: 'TKT-004', subject: 'Account verification pending', category: 'Account issue', priority: 'urgent', status: 'open', description: 'My account has been under verification for 2 weeks.', createdDate: '2024-12-08', messages: [] },
  ];

  getCoupons(): Observable<Coupon[]> { return of(this.coupons).pipe(delay(300)); }
  saveCoupon(coupon: Coupon): Observable<Coupon> {
    const idx = this.coupons.findIndex(c => c.id === coupon.id);
    if (idx > -1) this.coupons[idx] = coupon; else this.coupons.push(coupon);
    return of(coupon).pipe(delay(400));
  }
  deleteCoupon(id: string): Observable<boolean> {
    this.coupons = this.coupons.filter(c => c.id !== id);
    return of(true).pipe(delay(300));
  }
  toggleCoupon(id: string): Observable<boolean> {
    const c = this.coupons.find(c => c.id === id);
    if (c && c.status !== 'expired') c.status = c.status === 'active' ? 'inactive' : 'active';
    return of(true).pipe(delay(200));
  }

  getTransactions(): Observable<Transaction[]> { return of(this.transactions).pipe(delay(400)); }
  getPayouts(): Observable<PayoutRequest[]> { return of(this.payouts).pipe(delay(300)); }
  requestPayout(amount: number): Observable<PayoutRequest> {
    const p: PayoutRequest = { id: 'PAY-' + Date.now(), amount, requestDate: new Date().toISOString().split('T')[0], status: 'pending', bankAccount: 'HDFC ****4521' };
    this.payouts.unshift(p);
    return of(p).pipe(delay(500));
  }

  getReturns(): Observable<ReturnRequest[]> { return of(this.returns).pipe(delay(400)); }
  updateReturnStatus(id: string, status: ReturnRequest['status']): Observable<boolean> {
    const r = this.returns.find(r => r.id === id);
    if (r) r.status = status;
    return of(true).pipe(delay(300));
  }

  getTickets(): Observable<SupportTicket[]> { return of(this.tickets).pipe(delay(400)); }
  createTicket(ticket: SupportTicket): Observable<SupportTicket> {
    this.tickets.unshift(ticket);
    return of(ticket).pipe(delay(500));
  }
  updateTicketStatus(id: string, status: SupportTicket['status']): Observable<boolean> {
    const t = this.tickets.find(t => t.id === id);
    if (t) t.status = status;
    return of(true).pipe(delay(200));
  }

  getFaqs(): Observable<FaqItem[]> {
    return of([
      { question: 'How do payouts work?', answer: 'Payouts are processed every 7 days. Once an order is delivered and the return window closes, the amount minus commission is transferred to your registered bank account.' },
      { question: 'How to add products?', answer: 'Go to Products > Add Product. Fill in all required details including name, category, price, stock, and images. Submit for review and your product will be live within 24 hours.' },
      { question: 'How do refunds work?', answer: 'When a customer raises a return request, you have 48 hours to accept or reject it. If approved, the refund is processed within 5-7 business days.' },
      { question: 'How to manage orders?', answer: 'Navigate to Orders section. You can accept, pack, ship, and mark orders as delivered. Keep your order status updated to ensure timely payouts.' },
      { question: 'How to use promotions?', answer: 'Go to Promotions section to create coupons and discount offers. Set applicable categories, minimum order value, and validity dates to run targeted campaigns.' },
    ]).pipe(delay(200));
  }

  addProduct(product: Partial<VendorProduct>): Observable<VendorProduct> {
    const newProduct: VendorProduct = {
      id: 'vp' + Date.now(),
      name: product.name || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      brand: product.brand || '',
      price: product.price || 0,
      discount: product.discount || 0,
      stock: product.stock || 0,
      sku: product.sku || 'SKU-' + Date.now(),
      status: 'draft',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop',
      rating: 0,
      salesCount: 0,
      tags: product.tags || [],
      description: product.description || '',
    };
    this.products.push(newProduct);
    return of(newProduct).pipe(delay(600));
  }
}
