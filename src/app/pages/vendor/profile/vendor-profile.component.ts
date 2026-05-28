import { Component, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VendorAuthService } from '../services/vendor-auth.service';
import { VendorDataService } from '../services/vendor-data.service';
import { VendorUser } from '../models/vendor.models';

@Component({
  selector: 'app-vendor-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vendor-profile.component.html',
  styleUrl: './vendor-profile.component.scss'
})
export class VendorProfileComponent {
  editing = signal(false);
  editingAddr = signal(false);
  vendor!: Signal<VendorUser | null>;
  editBiz = { businessName: '', ownerName: '', phone: '' };
  editAddr = { address: '', city: '', state: '', pincode: '' };
  address = { address: '42 MG Road, Koramangala', city: 'Bengaluru', state: 'Karnataka', pincode: '560034' };
  states = ['Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'];
  documents = [
    { name: 'GST Certificate', status: 'Uploaded on Dec 1, 2024', type: 'verified', label: 'Verified' },
    { name: 'PAN Card', status: 'Uploaded on Dec 1, 2024', type: 'verified', label: 'Verified' },
    { name: 'Business License', status: 'Under review', type: 'pending', label: 'Pending' },
    { name: 'Bank Proof', status: 'Uploaded on Dec 1, 2024', type: 'verified', label: 'Verified' },
  ];

  constructor(private vendorAuth: VendorAuthService, private data: VendorDataService) {
    this.vendor = this.vendorAuth.vendor;
    const v = this.vendor();
    this.editBiz = { businessName: v?.businessName || '', ownerName: v?.ownerName || '', phone: v?.phone || '' };
    this.editAddr = { ...this.address };
  }

  saveBiz() { this.editing.set(false); }
  saveAddr() { this.address = { ...this.editAddr }; this.editingAddr.set(false); }

  exportCSV() {
    this.data.getProducts().subscribe(products => {
      this.data.getOrders().subscribe(orders => {
        this.data.getInventory().subscribe(inventory => {
          const sections: string[] = [];
          sections.push('PRODUCTS');
          sections.push('ID,Name,Category,Brand,Price,Discount,Stock,SKU,Status,Rating,Sales');
          products.forEach(p => sections.push(`${p.id},"${p.name}","${p.category}","${p.brand}",${p.price},${p.discount}%,${p.stock},"${p.sku}","${p.status}",${p.rating},${p.salesCount}`));
          sections.push('');
          sections.push('ORDERS');
          sections.push('ID,Customer,Email,Product,Amount,Payment Status,Delivery Status,Date,Shipping Address');
          orders.forEach(o => sections.push(`${o.id},"${o.customerName}","${o.customerEmail}","${o.product}",${o.amount},"${o.paymentStatus}","${o.deliveryStatus}","${o.orderDate}","${o.shippingAddress}"`));
          sections.push('');
          sections.push('INVENTORY');
          sections.push('ID,Product Name,SKU,Current Stock,Threshold,Status');
          inventory.forEach(i => sections.push(`${i.id},"${i.productName}","${i.sku}",${i.currentStock},${i.threshold},"${i.status}"`));
          const blob = new Blob([sections.join('\n')], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `vendor-data-${new Date().toISOString().slice(0, 10)}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        });
      });
    });
  }
}
