export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  avatar?: string;
  lastLogin?: string;
}

export interface AdminStats {
  totalOrders: number;
  totalVendors: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingVendorRequests: number;
  activeProducts: number;
  ordersGrowth: number;
  revenueGrowth: number;
}

export interface VendorRequest {
  id: string;
  ownerName: string;
  businessName: string;
  email: string;
  phone: string;
  gstNumber: string;
  businessType: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  documents: string[];
}

export interface AdminVendor {
  id: string;
  ownerName: string;
  businessName: string;
  email: string;
  phone: string;
  status: 'active' | 'suspended' | 'pending';
  totalProducts: number;
  revenue: number;
  joinedAt: string;
  verified: boolean;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  status: 'active' | 'blocked';
  joinedAt: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  vendorName: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  featured: boolean;
  sales: number;
}

export interface AdminOrder {
  id: string;
  customerId: string;
  customerName: string;
  vendorName: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  deliveryStatus: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  items: number;
}

export interface AdminPayment {
  id: string;
  orderId: string;
  customerName: string;
  vendorName: string;
  amount: number;
  type: 'payment' | 'payout' | 'refund';
  status: 'success' | 'failed' | 'pending';
  date: string;
  method: string;
}

export interface RevenueData {
  label: string;
  revenue: number;
  orders: number;
}

export interface VendorPerformance {
  totalOrders: number;
  delivered: number;
  returned: number;
  pending: number;
  cancelled: number;
  revenue: number;
  avgOrderValue: number;
  topCategory: string;
}

export interface CustomerDetail {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CustomerOrder {
  id: string;
  product: string;
  vendor: string;
  amount: number;
  date: string;
  deliveryStatus: 'delivered' | 'shipped' | 'pending' | 'cancelled' | 'returned' | 'refunded';
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'failed';
}
