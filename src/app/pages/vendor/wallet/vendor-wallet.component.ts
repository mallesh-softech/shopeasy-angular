import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { VendorDataService } from '../services/vendor-data.service';
import { Transaction, PayoutRequest } from '../models/vendor.models';

@Component({
  selector: 'app-vendor-wallet',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vendor-wallet.component.html',
  styleUrl: './vendor-wallet.component.scss'
})
export class VendorWalletComponent implements OnInit {
  loading = signal(true);
  transactions = signal<Transaction[]>([]);
  payouts = signal<PayoutRequest[]>([]);
  showWithdraw = signal(false);
  withdrawing = signal(false);
  withdrawForm!: FormGroup;

  months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  monthlyData = [42000,58000,51000,67000,73000,89000,95000,78000,102000,118000,95000,125000];
  maxMonthly = 125000;

  constructor(private data: VendorDataService, private fb: FormBuilder) {}

  ngOnInit() {
    this.withdrawForm = this.fb.group({ amount: ['', [Validators.required, Validators.min(100)]] });
    this.data.getTransactions().subscribe(t => {
      this.transactions.set(t);
      this.data.getPayouts().subscribe(p => { this.payouts.set(p); this.loading.set(false); });
    });
  }

  get totalEarnings() { return this.transactions().filter(t => t.status === 'paid').reduce((s, t) => s + t.finalPayout, 0); }
  get pendingPayouts() { return this.transactions().filter(t => t.status === 'pending').reduce((s, t) => s + t.finalPayout, 0); }
  get withdrawable() { return this.totalEarnings - this.payouts().filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0); }
  get totalRefunds() { return 3240; }

  requestWithdraw() {
    if (this.withdrawForm.invalid) { this.withdrawForm.markAllAsTouched(); return; }
    this.withdrawing.set(true);
    this.data.requestPayout(+this.withdrawForm.value.amount!).subscribe(p => {
      this.payouts.update(list => [p, ...list]);
      this.withdrawing.set(false);
      this.showWithdraw.set(false);
      this.withdrawForm.reset();
    });
  }

  barHeight(val: number) { return Math.round((val / this.maxMonthly) * 100); }
}
