export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  gradient: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  inStock: boolean;
  stockCount: number;
  colors: string[];
  sizes: string[];
  tags: string[];
  description: string;
  specifications: Record<string, string>;
  deliveryEstimate: string;
}

export interface ProductCatalog {
  categories: Category[];
  banners: Banner[];
  products: Product[];
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  search?: string;
  sort?: 'price-asc' | 'price-desc' | 'rating' | 'discount' | 'newest' | 'popularity' | '';
}
