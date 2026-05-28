import { Component, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { VendorDataService } from '../../services/vendor-data.service';
import { VendorProduct } from '../../models/vendor.models';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit {
  saving = signal(false);
  success = signal(false);
  isEditMode = signal(false);
  mainImage = signal<string | null>(null);
  galleryImages = signal<string[]>([]);
  tags = signal<string[]>([]);
  form!: ReturnType<FormBuilder['group']>;
  private editProductId: string | null = null;

  get variants() { return this.form.get('variants') as FormArray; }

  constructor(private fb: FormBuilder, private data: VendorDataService, private router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      brand: [''],
      category: ['', Validators.required],
      subcategory: [''],
      price: [null as number | null, [Validators.required, Validators.min(1)]],
      discount: [0],
      stock: [null as number | null, [Validators.required, Validators.min(0)]],
      sku: [''],
      status: ['draft'],
      variants: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) { this.editProductId = id; this.isEditMode.set(true); this.loadProductForEdit(id); }
    });
  }

  private loadProductForEdit(id: string) {
    this.data.getProducts().subscribe(products => {
      const product = products.find((p: VendorProduct) => p.id === id);
      if (!product) return;
      this.form.patchValue({ name: product.name, description: product.description, brand: product.brand, category: product.category, subcategory: product.subcategory, price: product.price, discount: product.discount, stock: product.stock, sku: product.sku, status: product.status });
      this.tags.set([...product.tags]);
      this.mainImage.set(product.image);
    });
  }

  finalPrice() { const p = this.form.value.price || 0; const d = this.form.value.discount || 0; return (p - (p * d / 100)).toFixed(0); }
  savings() { const p = this.form.value.price || 0; const d = this.form.value.discount || 0; return (p * d / 100).toFixed(0); }
  isInvalid(field: string) { const c = this.form.get(field); return c?.invalid && c?.touched; }
  addVariant() { this.variants.push(this.fb.group({ name: [''], value: [''] })); }
  removeVariant(i: number) { this.variants.removeAt(i); }

  addTag(e: Event) {
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    const val = input.value.trim();
    if (val && !this.tags().includes(val)) { this.tags.update(t => [...t, val]); input.value = ''; }
  }

  removeTag(tag: string) { this.tags.update(t => t.filter(x => x !== tag)); }

  onImageSelect(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) { const reader = new FileReader(); reader.onload = () => this.mainImage.set(reader.result as string); reader.readAsDataURL(file); }
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file) { const reader = new FileReader(); reader.onload = () => this.mainImage.set(reader.result as string); reader.readAsDataURL(file); }
  }

  onSubmit(mode: 'draft' | 'publish') {
    if (mode === 'publish') { this.form.markAllAsTouched(); if (this.form.invalid) return; }
    this.saving.set(true);
    const productData = { ...this.form.value, tags: this.tags(), status: mode === 'publish' ? 'active' : 'draft' } as any;
    this.data.addProduct(productData).subscribe(() => {
      this.saving.set(false); this.success.set(true);
      setTimeout(() => this.router.navigate(['/vendor/products']), 1500);
    });
  }
}
