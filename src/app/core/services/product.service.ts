import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import {
  Banner,
  Category,
  Product,
  ProductCatalog,
  ProductFilters,
} from '../../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private catalog = signal<ProductCatalog | null>(null);
  readonly recentlyViewed = signal<Product[]>([]);

  constructor(private http: HttpClient) {}

  loadCatalog(): Observable<ProductCatalog> {
    if (this.catalog()) {
      return of(this.catalog()!);
    }
    return this.http.get<ProductCatalog>('assets/data/products.json').pipe(
      tap((data) => this.catalog.set(data)),
    );
  }

  getCategories(): Observable<Category[]> {
    return this.loadCatalog().pipe(map((c) => c.categories));
  }

  getBanners(): Observable<Banner[]> {
    return this.loadCatalog().pipe(map((c) => c.banners));
  }

  getProducts(filters?: ProductFilters): Observable<Product[]> {
    return this.loadCatalog().pipe(
      map((c) => this.applyFilters(c.products, filters)),
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.loadCatalog().pipe(
      map((c) => c.products.find((p) => p.id === id)),
      tap((p) => {
        if (p) this.addRecentlyViewed(p);
      }),
    );
  }

  getBrands(): Observable<string[]> {
    return this.loadCatalog().pipe(
      map((c) => [...new Set(c.products.map((p) => p.brand))].sort()),
    );
  }

  searchSuggestions(query: string): Observable<string[]> {
    const q = query.trim().toLowerCase();
    if (!q) return of([]);
    return this.loadCatalog().pipe(
      map((c) =>
        c.products
          .filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q),
          )
          .slice(0, 6)
          .map((p) => p.title),
      ),
    );
  }

  getByTag(tag: string): Observable<Product[]> {
    return this.loadCatalog().pipe(
      map((c) => c.products.filter((p) => p.tags.includes(tag))),
    );
  }

  private addRecentlyViewed(product: Product): void {
    this.recentlyViewed.update((list) => {
      const filtered = list.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  }

  private applyFilters(products: Product[], filters?: ProductFilters): Product[] {
    let result = [...products];
    if (!filters) return result;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.brand) {
      result = result.filter((p) => p.brand === filters.brand);
    }
    if (filters.minPrice != null) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice != null) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.minRating != null) {
      result = result.filter((p) => p.rating >= filters.minRating!);
    }
    if (filters.inStock) {
      result = result.filter((p) => p.inStock);
    }

    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      default:
        break;
    }
    return result;
  }
}
