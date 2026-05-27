import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  submitted = signal(false);
  form = { name: '', email: '', subject: '', message: '' };

  subjects = ['Order Issue', 'Payment Problem', 'Return & Refund', 'Product Query', 'Account Help', 'Other'];

  submit() {
    if (this.form.name && this.form.email && this.form.message) {
      this.submitted.set(true);
    }
  }
}
