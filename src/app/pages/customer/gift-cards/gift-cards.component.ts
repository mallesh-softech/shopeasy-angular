import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-gift-cards',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './gift-cards.component.html',
  styleUrl: './gift-cards.component.scss',
})
export class GiftCardsComponent {
  activeTab = signal<'buy' | 'redeem' | 'balance'>('buy');

  // Simulated account gift card balance
  accountBalance = signal(1250);

  amounts = [500, 1000, 2000, 5000, 10000];
  selectedAmount = signal(1000);
  customAmount = '';
  recipientEmail = '';
  recipientName = '';
  message = '';

  redeemCode = '';
  redeemPin = ['', '', '', ''];
  redeemSuccess = signal(false);

  cardBalance = signal<number | null>(null);
  balanceCode = '';

  selectAmount(a: number) { this.selectedAmount.set(a); this.customAmount = ''; }

  redeem() {
    const pin = this.redeemPin.join('');
    if (this.redeemCode.trim() && pin.length === 4) {
      this.accountBalance.update(b => b + 500);
      this.redeemSuccess.set(true);
    }
  }

  onPinInput(e: Event, index: number) {
    const input = e.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '');
    this.redeemPin[index] = val.slice(-1);
    input.value = this.redeemPin[index];
    if (val && index < 3) {
      const next = input.parentElement?.querySelectorAll('input')[index + 1] as HTMLInputElement;
      next?.focus();
    }
  }

  onPinKeydown(e: KeyboardEvent, index: number) {
    if (e.key === 'Backspace' && !this.redeemPin[index] && index > 0) {
      const prev = (e.target as HTMLInputElement).parentElement?.querySelectorAll('input')[index - 1] as HTMLInputElement;
      prev?.focus();
    }
  }

  checkBalance() {
    if (this.balanceCode.trim()) this.cardBalance.set(750);
  }
}
