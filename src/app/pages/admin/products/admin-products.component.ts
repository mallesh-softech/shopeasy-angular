import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../services/admin-data.service';
import { AdminProduct } from '../models/admin.models';

interface ProductReview {
  id: string; customerName: string; avatar: string; rating: number;
  title: string; comment: string; date: string; verified: boolean; helpful: number;
}
interface ProductDetail {
  description: string;
  specs: Record<string, string>;
  images: string[];
  brand: string;
  discount: number;
  originalPrice: number;
  deliveryEstimate: string;
  reviews: ProductReview[];
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent implements OnInit {
  products = signal<AdminProduct[]>([]);
  activeStatus = signal('All');
  searchQuery = '';
  statuses = ['All', 'active', 'inactive', 'out_of_stock'];

  filtered = () => {
    let list = this.products();
    if (this.activeStatus() !== 'All') list = list.filter(p => p.status === this.activeStatus());
    if (this.searchQuery) list = list.filter(p => p.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    return list;
  };

  detailProduct = signal<AdminProduct | null>(null);
  detail = signal<ProductDetail | null>(null);
  detailTab = signal<'description' | 'specs' | 'reviews'>('description');

  avgRating = () => {
    const reviews = this.detail()?.reviews ?? [];
    if (!reviews.length) return 0;
    return Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
  };
  ratingCount = (star: number) => (this.detail()?.reviews ?? []).filter(r => r.rating === star).length;
  ratingPct = (star: number) => {
    const total = this.detail()?.reviews.length ?? 0;
    return total ? (this.ratingCount(star) / total) * 100 : 0;
  };
  specsEntries = () => Object.entries(this.detail()?.specs ?? {});

  constructor(private dataService: AdminDataService) {}
  ngOnInit(): void { this.dataService.getProducts().subscribe(p => this.products.set(p)); }

  toggleStatus(p: AdminProduct): void {
    this.products.update(list => list.map(x => x.id === p.id ? { ...x, status: x.status === 'active' ? 'inactive' as const : 'active' as const } : x));
  }
  toggleFeatured(p: AdminProduct): void {
    this.products.update(list => list.map(x => x.id === p.id ? { ...x, featured: !x.featured } : x));
  }

  openDetail(p: AdminProduct): void {
    this.detailProduct.set(p);
    this.detailTab.set('description');
    const descMap: Record<string, string> = {
      'Electronics': 'Premium quality electronic product with cutting-edge technology. Designed for performance and durability, this product delivers an exceptional user experience with advanced features and long-lasting battery life.',
      'Sports': 'Engineered for athletes and fitness enthusiasts. Built with high-performance materials to support your active lifestyle, offering superior comfort, grip, and durability during intense workouts.',
      'Fashion': 'Crafted with premium fabrics and attention to detail. This stylish piece combines comfort with contemporary design, perfect for both casual and semi-formal occasions.',
      'Home': 'Elevate your living space with this beautifully crafted home essential. Made from high-quality materials, it blends functionality with aesthetic appeal for modern homes.',
      'Beauty': 'Formulated with dermatologist-tested ingredients to nourish and enhance your skin. Free from harmful chemicals, this product is suitable for all skin types.',
      'Books': 'A compelling read that offers deep insights and practical wisdom. Highly recommended by experts and readers worldwide for its transformative content.',
    };
    const specsMap: Record<string, Record<string, string>> = {
      'Electronics': { Brand: p.vendorName, Category: p.category, Warranty: '1 Year', 'In The Box': 'Product, Manual, Warranty Card', Weight: '250g', Connectivity: 'Bluetooth 5.0' },
      'Sports': { Brand: p.vendorName, Material: 'Mesh & Synthetic', Sole: 'Rubber', Closure: 'Lace-Up', 'Ideal For': 'Running, Training', 'Country of Origin': 'India' },
      'Fashion': { Brand: p.vendorName, Fabric: '100% Cotton', Fit: 'Regular', Occasion: 'Casual', 'Wash Care': 'Machine Wash', 'Country of Origin': 'India' },
      'Home': { Brand: p.vendorName, Material: 'Ceramic', Capacity: '350ml', 'Pack of': '4', Microwave: 'Safe', Dishwasher: 'Safe' },
      'Beauty': { Brand: p.vendorName, 'Skin Type': 'All Skin Types', Volume: '30ml', 'Key Ingredient': 'Vitamin C 20%', 'Shelf Life': '24 months', 'Country of Origin': 'India' },
      'Books': { Author: 'James Clear', Publisher: 'Penguin Random House', Pages: '320', Language: 'English', ISBN: '978-0735211292', Edition: '1st' },
    };
    const imgMap: Record<string, string> = {
      'Electronics': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      'Sports': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
      'Fashion': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop',
      'Home': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&h=300&fit=crop',
      'Beauty': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
      'Books': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop',
    };
    const names = ['Arjun M.', 'Kavya R.', 'Rohit G.', 'Ananya S.', 'Deepak N.', 'Pooja I.'];
    const titles = ['Excellent product!', 'Great value for money', 'Highly recommended', 'Good but could be better', 'Absolutely love it', 'Worth every rupee'];
    const comments = [
      'Really impressed with the quality. Exactly as described and delivered on time.',
      'Good product overall. The build quality is solid and it works perfectly.',
      'Amazing experience! Will definitely buy again from this vendor.',
      'Decent product for the price. Packaging was good and delivery was fast.',
      'Exceeded my expectations. The quality is top-notch and very durable.',
      'Perfect gift item. Looks premium and feels great to use daily.',
    ];
    const reviews: ProductReview[] = Array.from({ length: 6 }, (_, i) => ({
      id: `rev-${i}`,
      customerName: names[i],
      avatar: '',
      rating: [5, 4, 5, 3, 5, 4][i],
      title: titles[i],
      comment: comments[i],
      date: `2025-0${i + 1}-${10 + i}`,
      verified: i % 3 !== 2,
      helpful: [12, 8, 15, 3, 20, 6][i],
    }));
    this.detail.set({
      description: descMap[p.category] ?? descMap['Electronics'],
      specs: specsMap[p.category] ?? specsMap['Electronics'],
      images: [imgMap[p.category] ?? imgMap['Electronics']],
      brand: p.vendorName,
      discount: p.price < 5000 ? 15 : 20,
      originalPrice: Math.round(p.price * 1.2),
      deliveryEstimate: 'Free delivery in 3-5 business days',
      reviews,
    });
  }

  closeDetail(): void {
    this.detailProduct.set(null);
    this.detail.set(null);
  }
}
