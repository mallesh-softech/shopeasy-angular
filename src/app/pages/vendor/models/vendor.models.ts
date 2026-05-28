export interface VendorUser {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  gstNumber: string;
  businessType: string;
  status: 'pending' | 'approved' | 'rejected';
  avatar?: string;
  address?: VendorAddress;
  bankDetails?: BankDetails;
}

export interface VendorAddress {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface VendorProduct {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  discount: number;
  stock: number;
  sku: string;
  status: 'active' | 'inactive' | 'draft';
  image: string;
  rating: number;
  salesCount: number;
  tags: string[];
  description: string;
}

export interface VendorOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  product: string;
  productImage: string;
  amount: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  deliveryStatus: 'pending' | 'accepted' | 'packed' | 'shipped' | 'delivered' | 'rejected';
  orderDate: string;
  shippingAddress: string;
}

export interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  threshold: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  image: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  avatar: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

export interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  change: number;
  color: string;
}

// Promotions
export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  usageLimit: number;
  usageCount: number;
  startDate: string;
  expiryDate: string;
  applicableProducts: string[];
  applicableCategories: string[];
  status: 'active' | 'inactive' | 'expired';
}

// Wallet
export interface Transaction {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  commission: number;
  finalPayout: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  date: string;
}

export interface PayoutRequest {
  id: string;
  amount: number;
  requestDate: string;
  processedDate?: string;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  bankAccount: string;
}

// Returns
export interface ReturnRequest {
  id: string;
  orderId: string;
  product: string;
  customer: string;
  reason: string;
  refundAmount: number;
  status: 'requested' | 'under-review' | 'approved' | 'rejected' | 'refunded';
  requestDate: string;
  productImage: string;
}

// Support
export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  description: string;
  createdDate: string;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  sender: 'vendor' | 'admin';
  message: string;
  time: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  open?: boolean;
}
