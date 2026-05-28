import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { VendorDataService } from '../services/vendor-data.service';
import { SupportTicket, FaqItem, TicketMessage } from '../models/vendor.models';

@Component({
  selector: 'app-vendor-support',
  standalone: true,
  imports: [ReactiveFormsModule, TitleCasePipe],
  templateUrl: './vendor-support.component.html',
  styleUrl: './vendor-support.component.scss'
})
export class VendorSupportComponent implements OnInit {
  loading = signal(true);
  tickets = signal<SupportTicket[]>([]);
  faqs = signal<FaqItem[]>([]);
  activeTab = signal<'tickets' | 'new' | 'faq' | 'chat'>('tickets');
  selectedTicket = signal<SupportTicket | null>(null);
  submitting = signal(false);
  chatMessage = signal('');

  chatMessages = signal<TicketMessage[]>([
    { sender: 'admin', message: 'Hello! How can I help you today?', time: '10:00 AM' },
    { sender: 'vendor', message: 'I have a question about my payout.', time: '10:01 AM' },
    { sender: 'admin', message: 'Sure! Payouts are processed every 7 days. Your next payout is scheduled for Dec 20.', time: '10:02 AM' },
  ]);

  categories = ['Orders', 'Payments', 'Refunds', 'Products', 'Technical issue', 'Account issue'];
  priorities = ['low', 'medium', 'high', 'urgent'];

  ticketForm!: FormGroup;

  constructor(private data: VendorDataService, private fb: FormBuilder) {}

  ngOnInit() {
    this.ticketForm = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', Validators.required],
      priority: ['medium', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
    });
    this.data.getTickets().subscribe(t => {
      this.tickets.set(t);
      this.data.getFaqs().subscribe(f => { this.faqs.set(f); this.loading.set(false); });
    });
  }

  submitTicket() {
    if (this.ticketForm.invalid) { this.ticketForm.markAllAsTouched(); return; }
    this.submitting.set(true);
    const v = this.ticketForm.value;
    const ticket: SupportTicket = {
      id: 'TKT-' + String(Date.now()).slice(-4),
      subject: v.subject!,
      category: v.category!,
      priority: v.priority as SupportTicket['priority'],
      status: 'open',
      description: v.description!,
      createdDate: new Date().toISOString().split('T')[0],
      messages: [],
    };
    this.data.createTicket(ticket).subscribe(t => {
      this.tickets.update(list => [t, ...list]);
      this.submitting.set(false);
      this.ticketForm.reset({ priority: 'medium' });
      this.activeTab.set('tickets');
    });
  }

  closeTicket(id: string) {
    this.data.updateTicketStatus(id, 'closed').subscribe(() => {
      this.tickets.update(list => list.map(t => t.id === id ? { ...t, status: 'closed' } : t));
    });
  }

  toggleFaq(idx: number) {
    this.faqs.update(list => list.map((f, i) => ({ ...f, open: i === idx ? !f.open : false })));
  }

  sendChat() {
    const msg = this.chatMessage().trim();
    if (!msg) return;
    this.chatMessages.update(list => [...list, { sender: 'vendor', message: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    this.chatMessage.set('');
    setTimeout(() => {
      this.chatMessages.update(list => [...list, { sender: 'admin', message: 'Thanks for reaching out! Our team will get back to you shortly.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1000);
  }

  get openCount() { return this.tickets().filter(t => t.status === 'open').length; }
  get inProgressCount() { return this.tickets().filter(t => t.status === 'in-progress').length; }
  get resolvedCount() { return this.tickets().filter(t => t.status === 'resolved').length; }
}
