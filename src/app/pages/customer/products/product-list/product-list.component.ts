import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { ProductService } from '../../../../core/services/product.service';
import { Product, ProductFilters } from '../../../../models/product.model';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

export interface FilterSection {
  key: string;
  label: string;
  type: 'checkbox' | 'radio' | 'price' | 'rating' | 'availability';
  options?: { value: string; label: string }[];
}

// Context detection keywords
const FASHION_KEYWORDS = ['shirt', 'tshirt', 't-shirt', 'pant', 'jeans', 'dress', 'kurta', 'saree', 'top', 'jacket', 'coat', 'skirt', 'legging', 'trouser', 'fashion', 'clothing', 'clothes', 'wear', 'outfit', 'hoodie', 'sweater', 'blouse', 'shorts', 'denim'];
const ELECTRONICS_KEYWORDS = ['laptop', 'phone', 'mobile', 'tablet', 'computer', 'monitor', 'keyboard', 'mouse', 'headphone', 'earphone', 'speaker', 'camera', 'tv', 'television', 'smartwatch', 'watch', 'electronics', 'gadget', 'charger', 'cable'];
const FOOTWEAR_KEYWORDS = ['shoe', 'shoes', 'sneaker', 'boot', 'sandal', 'slipper', 'heel', 'loafer', 'footwear'];
const BEAUTY_KEYWORDS = ['serum', 'cream', 'moisturizer', 'lipstick', 'foundation', 'mascara', 'perfume', 'skincare', 'beauty', 'makeup', 'shampoo', 'conditioner'];
const SPORTS_KEYWORDS = ['gym', 'yoga', 'fitness', 'sport', 'running', 'cycling', 'cricket', 'football', 'badminton', 'dumbbell', 'protein', 'mat'];

function detectContext(search: string, category: string): string {
  const q = (search + ' ' + category).toLowerCase();
  if (FASHION_KEYWORDS.some(k => q.includes(k))) return 'fashion';
  if (FOOTWEAR_KEYWORDS.some(k => q.includes(k))) return 'footwear';
  if (ELECTRONICS_KEYWORDS.some(k => q.includes(k))) return 'electronics';
  if (BEAUTY_KEYWORDS.some(k => q.includes(k))) return 'beauty';
  if (SPORTS_KEYWORDS.some(k => q.includes(k))) return 'sports';
  return 'general';
}

const FILTER_SETS: Record<string, FilterSection[]> = {
  fashion: [
    { key: 'gender', label: 'GENDER', type: 'checkbox', options: [
      { value: 'men', label: 'Men' }, { value: 'women', label: 'Women' },
      { value: 'boys', label: 'Boys' }, { value: 'girls', label: 'Girls' },
      { value: 'kids', label: 'Kids' },
    ]},
    { key: 'brand', label: 'BRAND', type: 'checkbox' },
    { key: 'discount', label: 'DISCOUNT', type: 'checkbox', options: [
      { value: '10', label: '10% and above' }, { value: '20', label: '20% and above' },
      { value: '30', label: '30% and above' }, { value: '50', label: '50% and above' },
    ]},
    { key: 'fabric', label: 'FABRIC', type: 'checkbox', options: [
      { value: 'cotton', label: 'Cotton' }, { value: 'polyester', label: 'Polyester' },
      { value: 'linen', label: 'Linen' }, { value: 'silk', label: 'Silk' },
      { value: 'denim', label: 'Denim' }, { value: 'wool', label: 'Wool' },
    ]},
    { key: 'size', label: 'SIZE', type: 'checkbox', options: [
      { value: 'XS', label: 'XS' }, { value: 'S', label: 'S' }, { value: 'M', label: 'M' },
      { value: 'L', label: 'L' }, { value: 'XL', label: 'XL' }, { value: 'XXL', label: 'XXL' },
    ]},
    { key: 'color', label: 'COLOR', type: 'checkbox', options: [
      { value: 'black', label: 'Black' }, { value: 'white', label: 'White' },
      { value: 'blue', label: 'Blue' }, { value: 'red', label: 'Red' },
      { value: 'green', label: 'Green' }, { value: 'grey', label: 'Grey' },
    ]},
    { key: 'price', label: 'PRICE', type: 'price' },
    { key: 'rating', label: 'CUSTOMER RATINGS', type: 'rating' },
    { key: 'availability', label: 'AVAILABILITY', type: 'availability' },
  ],
  footwear: [
    { key: 'gender', label: 'GENDER', type: 'checkbox', options: [
      { value: 'men', label: 'Men' }, { value: 'women', label: 'Women' },
      { value: 'boys', label: 'Boys' }, { value: 'girls', label: 'Girls' },
      { value: 'kids', label: 'Kids' },
    ]},
    { key: 'brand', label: 'BRAND', type: 'checkbox' },
    { key: 'discount', label: 'DISCOUNT', type: 'checkbox', options: [
      { value: '10', label: '10% and above' }, { value: '20', label: '20% and above' },
      { value: '30', label: '30% and above' }, { value: '50', label: '50% and above' },
    ]},
    { key: 'size', label: 'SIZE', type: 'checkbox', options: [
      { value: '6', label: '6' }, { value: '7', label: '7' }, { value: '8', label: '8' },
      { value: '9', label: '9' }, { value: '10', label: '10' }, { value: '11', label: '11' },
    ]},
    { key: 'color', label: 'COLOR', type: 'checkbox', options: [
      { value: 'black', label: 'Black' }, { value: 'white', label: 'White' },
      { value: 'brown', label: 'Brown' }, { value: 'blue', label: 'Blue' },
    ]},
    { key: 'material', label: 'MATERIAL', type: 'checkbox', options: [
      { value: 'leather', label: 'Leather' }, { value: 'mesh', label: 'Mesh' },
      { value: 'canvas', label: 'Canvas' }, { value: 'synthetic', label: 'Synthetic' },
    ]},
    { key: 'price', label: 'PRICE', type: 'price' },
    { key: 'rating', label: 'CUSTOMER RATINGS', type: 'rating' },
    { key: 'availability', label: 'AVAILABILITY', type: 'availability' },
  ],
  electronics: [
    { key: 'brand', label: 'BRAND', type: 'checkbox' },
    { key: 'discount', label: 'DISCOUNT', type: 'checkbox', options: [
      { value: '10', label: '10% and above' }, { value: '20', label: '20% and above' },
      { value: '30', label: '30% and above' }, { value: '50', label: '50% and above' },
    ]},
    { key: 'connectivity', label: 'CONNECTIVITY', type: 'checkbox', options: [
      { value: 'bluetooth', label: 'Bluetooth' }, { value: 'wifi', label: 'Wi-Fi' },
      { value: 'wired', label: 'Wired' }, { value: 'usb-c', label: 'USB-C' },
    ]},
    { key: 'color', label: 'COLOR', type: 'checkbox', options: [
      { value: 'black', label: 'Black' }, { value: 'white', label: 'White' },
      { value: 'silver', label: 'Silver' }, { value: 'gold', label: 'Gold' },
    ]},
    { key: 'warranty', label: 'WARRANTY', type: 'checkbox', options: [
      { value: '1year', label: '1 Year' }, { value: '2year', label: '2 Years' },
      { value: '3year', label: '3 Years' },
    ]},
    { key: 'price', label: 'PRICE', type: 'price' },
    { key: 'rating', label: 'CUSTOMER RATINGS', type: 'rating' },
    { key: 'availability', label: 'AVAILABILITY', type: 'availability' },
  ],
  beauty: [
    { key: 'brand', label: 'BRAND', type: 'checkbox' },
    { key: 'discount', label: 'DISCOUNT', type: 'checkbox', options: [
      { value: '10', label: '10% and above' }, { value: '20', label: '20% and above' },
      { value: '30', label: '30% and above' },
    ]},
    { key: 'skinType', label: 'SKIN TYPE', type: 'checkbox', options: [
      { value: 'oily', label: 'Oily' }, { value: 'dry', label: 'Dry' },
      { value: 'combination', label: 'Combination' }, { value: 'sensitive', label: 'Sensitive' },
      { value: 'all', label: 'All Types' },
    ]},
    { key: 'type', label: 'TYPE', type: 'checkbox', options: [
      { value: 'serum', label: 'Serum' }, { value: 'moisturizer', label: 'Moisturizer' },
      { value: 'cleanser', label: 'Cleanser' }, { value: 'toner', label: 'Toner' },
      { value: 'sunscreen', label: 'Sunscreen' },
    ]},
    { key: 'price', label: 'PRICE', type: 'price' },
    { key: 'rating', label: 'CUSTOMER RATINGS', type: 'rating' },
    { key: 'availability', label: 'AVAILABILITY', type: 'availability' },
  ],
  sports: [
    { key: 'brand', label: 'BRAND', type: 'checkbox' },
    { key: 'discount', label: 'DISCOUNT', type: 'checkbox', options: [
      { value: '10', label: '10% and above' }, { value: '20', label: '20% and above' },
      { value: '30', label: '30% and above' },
    ]},
    { key: 'gender', label: 'GENDER', type: 'checkbox', options: [
      { value: 'men', label: 'Men' }, { value: 'women', label: 'Women' },
      { value: 'unisex', label: 'Unisex' },
    ]},
    { key: 'material', label: 'MATERIAL', type: 'checkbox', options: [
      { value: 'cotton', label: 'Cotton' }, { value: 'polyester', label: 'Polyester' },
      { value: 'nylon', label: 'Nylon' }, { value: 'tpe', label: 'TPE' },
    ]},
    { key: 'color', label: 'COLOR', type: 'checkbox', options: [
      { value: 'black', label: 'Black' }, { value: 'blue', label: 'Blue' },
      { value: 'red', label: 'Red' }, { value: 'green', label: 'Green' },
    ]},
    { key: 'price', label: 'PRICE', type: 'price' },
    { key: 'rating', label: 'CUSTOMER RATINGS', type: 'rating' },
    { key: 'availability', label: 'AVAILABILITY', type: 'availability' },
  ],
  general: [
    { key: 'brand', label: 'BRAND', type: 'checkbox' },
    { key: 'discount', label: 'DISCOUNT', type: 'checkbox', options: [
      { value: '10', label: '10% and above' }, { value: '20', label: '20% and above' },
      { value: '30', label: '30% and above' }, { value: '50', label: '50% and above' },
    ]},
    { key: 'price', label: 'PRICE', type: 'price' },
    { key: 'rating', label: 'CUSTOMER RATINGS', type: 'rating' },
    { key: 'availability', label: 'AVAILABILITY', type: 'availability' },
  ],
};

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, RouterLink, TitleCasePipe, ProductCardComponent, SkeletonComponent, EmptyStateComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  products = signal<Product[]>([]);
  brands = signal<string[]>([]);

  filters: ProductFilters = {};
  extraFilters: Record<string, string[]> = {};
  sidebarOpen = signal(false);
  currentPage = signal(1);
  pageSize = 8;

  filterContext = signal<string>('general');
  openSections: Record<string, boolean> = {};
  detectedCategory = signal<string | null>(null);

  // The category to show in breadcrumb (explicit filter or auto-detected)
  get breadcrumbCategory(): string | null {
    return this.filters.category || this.detectedCategory();
  }

  sortOptions = [
    { value: '', label: 'Relevance' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'price-asc', label: 'Price -- Low to High' },
    { value: 'price-desc', label: 'Price -- High to Low' },
    { value: 'rating', label: 'Newest First' },
  ];

  get dynamicSections(): FilterSection[] {
    return FILTER_SETS[this.filterContext()] ?? FILTER_SETS['general'];
  }

  ngOnInit(): void {
    this.productService.getBrands().subscribe((b) => this.brands.set(b));
    this.route.queryParams.subscribe((params) => {
      this.filters = {
        search: params['q'] || undefined,
        category: params['category'] || undefined,
        brand: params['brand'] || undefined,
        sort: params['sort'] as ProductFilters['sort'],
        minPrice: params['minPrice'] ? +params['minPrice'] : undefined,
        maxPrice: params['maxPrice'] ? +params['maxPrice'] : undefined,
        minRating: params['minRating'] ? +params['minRating'] : undefined,
        inStock: params['inStock'] === 'true',
      };
      const ctx = detectContext(this.filters.search || '', this.filters.category || '');
      this.filterContext.set(ctx);
      // init open state for new sections
      this.dynamicSections.forEach(s => {
        if (this.openSections[s.key] === undefined) this.openSections[s.key] = false;
      });
      this.currentPage.set(1);
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts(this.filters).subscribe((list) => {
      this.products.set(list);
      this.loading.set(false);
      // Auto-detect category from results when searching
      if (!this.filters.category && list.length > 0 && this.filters.search) {
        const topCategory = list[0].category;
        const allSame = list.every(p => p.category === topCategory);
        this.detectedCategory.set(allSame ? topCategory : null);
      } else {
        this.detectedCategory.set(null);
      }
    });
  }

  applyFilters(): void {
    this.router.navigate([], {
      queryParams: {
        q: this.filters.search || null,
        category: this.filters.category || null,
        brand: this.filters.brand || null,
        sort: this.filters.sort || null,
        minPrice: this.filters.minPrice ?? null,
        maxPrice: this.filters.maxPrice ?? null,
        minRating: this.filters.minRating ?? null,
        inStock: this.filters.inStock || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  clearFilters(): void {
    this.filters = {};
    this.extraFilters = {};
    this.router.navigate(['/products']);
  }

  toggleSection(key: string): void {
    this.openSections[key] = !this.openSections[key];
  }

  setSort(value: string): void {
    this.filters.sort = value as ProductFilters['sort'];
    this.applyFilters();
  }

  toggleBrand(brand: string): void {
    this.filters.brand = this.filters.brand === brand ? undefined : brand;
    this.applyFilters();
  }

  setRating(value: number): void {
    this.filters.minRating = this.filters.minRating === value ? undefined : value;
    this.applyFilters();
  }

  toggleExtra(key: string, value: string): void {
    const current = this.extraFilters[key] || [];
    const idx = current.indexOf(value);
    this.extraFilters = {
      ...this.extraFilters,
      [key]: idx >= 0 ? current.filter(v => v !== value) : [...current, value],
    };
  }

  isExtraSelected(key: string, value: string): boolean {
    return (this.extraFilters[key] || []).includes(value);
  }

  getSectionOptions(section: FilterSection): { value: string; label: string }[] {
    if (section.key === 'brand') {
      return this.brands().map(b => ({ value: b, label: b }));
    }
    return section.options || [];
  }

  paginatedProducts(): Product[] {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.products().slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.products().length / this.pageSize) || 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  pageNumbers(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }
}
