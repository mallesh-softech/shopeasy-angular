import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-vendor-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-page">
      <div class="register-banner">
        <div class="banner-inner">
          <div class="brand-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <h2>Start Selling Today</h2>
          <p>Join 50,000+ sellers on SellerHub</p>
          <div class="steps-preview">
            @for (s of stepLabels; track s; let i = $index) {
              <div class="step-preview" [class.done]="currentStep() > i" [class.active]="currentStep() === i">
                <div class="step-dot">{{ currentStep() > i ? '✓' : i + 1 }}</div>
                <span>{{ s }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="register-form-side">
        @if (!submitted()) {
          <div class="form-container">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="((currentStep() + 1) / 5) * 100"></div>
            </div>
            <div class="step-header">
              <span class="step-badge">Step {{ currentStep() + 1 }} of 5</span>
              <h2>{{ stepLabels[currentStep()] }}</h2>
            </div>

            @if (currentStep() === 0) {
              <form [formGroup]="step1" class="step-form">
                <div class="form-grid">
                  <div class="form-group">
                    <label>Business Name *</label>
                    <input type="text" formControlName="businessName" class="form-input" placeholder="Your Business Name" [class.invalid]="isInvalid(step1, 'businessName')" />
                    @if (isInvalid(step1, 'businessName')) { <span class="error">Required</span> }
                  </div>
                  <div class="form-group">
                    <label>Owner Name *</label>
                    <input type="text" formControlName="ownerName" class="form-input" placeholder="Full Name" [class.invalid]="isInvalid(step1, 'ownerName')" />
                    @if (isInvalid(step1, 'ownerName')) { <span class="error">Required</span> }
                  </div>
                  <div class="form-group">
                    <label>GST Number *</label>
                    <input type="text" formControlName="gstNumber" class="form-input" placeholder="27AAPFU0939F1ZV" [class.invalid]="isInvalid(step1, 'gstNumber')" />
                    @if (isInvalid(step1, 'gstNumber')) { <span class="error">Required</span> }
                  </div>
                  <div class="form-group">
                    <label>Business Type *</label>
                    <select formControlName="businessType" class="form-input" [class.invalid]="isInvalid(step1, 'businessType')">
                      <option value="">Select type</option>
                      <option>Retailer</option><option>Wholesaler</option><option>Manufacturer</option><option>Distributor</option>
                    </select>
                    @if (isInvalid(step1, 'businessType')) { <span class="error">Required</span> }
                  </div>
                  <div class="form-group">
                    <label>Email *</label>
                    <input type="email" formControlName="email" class="form-input" placeholder="business@example.com" [class.invalid]="isInvalid(step1, 'email')" />
                    @if (isInvalid(step1, 'email')) { <span class="error">Valid email required</span> }
                  </div>
                  <div class="form-group">
                    <label>Phone Number *</label>
                    <input type="tel" formControlName="phone" class="form-input" placeholder="+91 98765 43210" [class.invalid]="isInvalid(step1, 'phone')" />
                    @if (isInvalid(step1, 'phone')) { <span class="error">Required</span> }
                  </div>
                </div>
              </form>
            }

            @if (currentStep() === 1) {
              <form [formGroup]="step2" class="step-form">
                <div class="form-group">
                  <label>Address *</label>
                  <textarea formControlName="address" class="form-input" rows="3" placeholder="Street address, building, area" [class.invalid]="isInvalid(step2, 'address')"></textarea>
                  @if (isInvalid(step2, 'address')) { <span class="error">Required</span> }
                </div>
                <div class="form-grid">
                  <div class="form-group">
                    <label>City *</label>
                    <input type="text" formControlName="city" class="form-input" placeholder="City" [class.invalid]="isInvalid(step2, 'city')" />
                    @if (isInvalid(step2, 'city')) { <span class="error">Required</span> }
                  </div>
                  <div class="form-group">
                    <label>State *</label>
                    <select formControlName="state" class="form-input" [class.invalid]="isInvalid(step2, 'state')">
                      <option value="">Select state</option>
                      @for (s of states; track s) { <option>{{ s }}</option> }
                    </select>
                    @if (isInvalid(step2, 'state')) { <span class="error">Required</span> }
                  </div>
                  <div class="form-group">
                    <label>Pincode *</label>
                    <input type="text" formControlName="pincode" class="form-input" placeholder="560034" [class.invalid]="isInvalid(step2, 'pincode')" />
                    @if (isInvalid(step2, 'pincode')) { <span class="error">Required</span> }
                  </div>
                </div>
              </form>
            }

            @if (currentStep() === 2) {
              <div class="step-form">
                <p class="step-desc">Upload your business documents for verification</p>
                @for (doc of documents; track doc.key) {
                  <div class="upload-zone" [class.uploaded]="uploadedDocs()[doc.key]" (click)="simulateUpload(doc.key)" (dragover)="$event.preventDefault()" (drop)="simulateUpload(doc.key)">
                    @if (uploadedDocs()[doc.key]) {
                      <div class="upload-success">
                        <span class="check-icon">✓</span>
                        <span>{{ doc.label }} uploaded</span>
                      </div>
                    } @else {
                      <div class="upload-placeholder">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <strong>{{ doc.label }}</strong>
                        <small>Click or drag to upload PDF/JPG</small>
                      </div>
                    }
                  </div>
                }
              </div>
            }

            @if (currentStep() === 3) {
              <form [formGroup]="step4" class="step-form">
                <div class="form-group">
                  <label>Account Holder Name *</label>
                  <input type="text" formControlName="accountHolder" class="form-input" placeholder="As per bank records" [class.invalid]="isInvalid(step4, 'accountHolder')" />
                  @if (isInvalid(step4, 'accountHolder')) { <span class="error">Required</span> }
                </div>
                <div class="form-group">
                  <label>Account Number *</label>
                  <input type="text" formControlName="accountNumber" class="form-input" placeholder="Account number" [class.invalid]="isInvalid(step4, 'accountNumber')" />
                  @if (isInvalid(step4, 'accountNumber')) { <span class="error">Required</span> }
                </div>
                <div class="form-grid">
                  <div class="form-group">
                    <label>IFSC Code *</label>
                    <input type="text" formControlName="ifscCode" class="form-input" placeholder="SBIN0001234" [class.invalid]="isInvalid(step4, 'ifscCode')" />
                    @if (isInvalid(step4, 'ifscCode')) { <span class="error">Required</span> }
                  </div>
                  <div class="form-group">
                    <label>Bank Name *</label>
                    <input type="text" formControlName="bankName" class="form-input" placeholder="Bank name" [class.invalid]="isInvalid(step4, 'bankName')" />
                    @if (isInvalid(step4, 'bankName')) { <span class="error">Required</span> }
                  </div>
                </div>
              </form>
            }

            @if (currentStep() === 4) {
              <div class="review-step">
                <div class="review-section">
                  <h4>Business Information</h4>
                  <div class="review-grid">
                    <div><span>Business Name</span><strong>{{ step1.value.businessName }}</strong></div>
                    <div><span>Owner</span><strong>{{ step1.value.ownerName }}</strong></div>
                    <div><span>GST</span><strong>{{ step1.value.gstNumber }}</strong></div>
                    <div><span>Type</span><strong>{{ step1.value.businessType }}</strong></div>
                    <div><span>Email</span><strong>{{ step1.value.email }}</strong></div>
                    <div><span>Phone</span><strong>{{ step1.value.phone }}</strong></div>
                  </div>
                </div>
                <div class="review-section">
                  <h4>Address</h4>
                  <div class="review-grid">
                    <div><span>City</span><strong>{{ step2.value.city }}</strong></div>
                    <div><span>State</span><strong>{{ step2.value.state }}</strong></div>
                    <div><span>Pincode</span><strong>{{ step2.value.pincode }}</strong></div>
                  </div>
                </div>
                <div class="review-section">
                  <h4>Bank Details</h4>
                  <div class="review-grid">
                    <div><span>Account Holder</span><strong>{{ step4.value.accountHolder }}</strong></div>
                    <div><span>Bank</span><strong>{{ step4.value.bankName }}</strong></div>
                    <div><span>IFSC</span><strong>{{ step4.value.ifscCode }}</strong></div>
                  </div>
                </div>
              </div>
            }

            <div class="step-actions">
              @if (currentStep() > 0) {
                <button class="btn-back" (click)="prevStep()">← Back</button>
              }
              @if (currentStep() < 4) {
                <button class="btn-next" (click)="nextStep()">Continue →</button>
              } @else {
                <button class="btn-submit" (click)="submit()" [disabled]="submitting()">
                  @if (submitting()) { <span class="spinner"></span> } Submit Application
                </button>
              }
            </div>
          </div>
        } @else {
          <div class="success-screen">
            <div class="success-icon">🎉</div>
            <h2>Application Submitted!</h2>
            <p>Your vendor application is under review. We'll notify you within 2-3 business days.</p>
            <div class="status-card">
              <div class="status-dot pending"></div>
              <div>
                <strong>Pending Admin Approval</strong>
                <small>Application ID: VND-{{ appId() }}</small>
              </div>
            </div>
            <a routerLink="/vendor/auth/login" class="btn-login">Go to Login</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .register-page { display: flex; min-height: 100vh; }
    .register-banner {
      width: 320px; background: linear-gradient(180deg, #1e1b4b 0%, #4c1d95 100%);
      display: flex; align-items: center; padding: 2rem;
    }
    .brand-logo {
      width: 48px; height: 48px; background: rgba(255,255,255,0.15); border-radius: 12px;
      display: flex; align-items: center; justify-content: center; color: #fff; margin-bottom: 1.5rem;
    }
    .banner-inner { color: #fff; }
    .banner-inner h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
    .banner-inner p { color: #c4b5fd; font-size: 0.875rem; margin-bottom: 2rem; }
    .steps-preview { display: flex; flex-direction: column; gap: 1rem; }
    .step-preview { display: flex; align-items: center; gap: 0.75rem; opacity: 0.5; transition: opacity 0.2s;
      &.active, &.done { opacity: 1; }
    }
    .step-dot {
      width: 28px; height: 28px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3);
      display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
      .step-preview.active & { background: #7c3aed; border-color: #7c3aed; }
      .step-preview.done & { background: #10b981; border-color: #10b981; }
    }
    .step-preview span { font-size: 0.875rem; }

    .register-form-side { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem; background: #fff; overflow-y: auto; }
    .form-container { width: 100%; max-width: 560px; }
    .progress-bar { height: 4px; background: #e2e8f0; border-radius: 2px; margin-bottom: 1.5rem; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #7c3aed, #a78bfa); border-radius: 2px; transition: width 0.4s ease; }
    .step-header { margin-bottom: 1.5rem; }
    .step-badge { font-size: 0.75rem; font-weight: 600; color: #7c3aed; background: rgba(124,58,237,0.1); padding: 0.25rem 0.75rem; border-radius: 999px; }
    .step-header h2 { font-size: 1.5rem; font-weight: 700; color: #1e1b4b; margin-top: 0.5rem; }
    .step-form { margin-bottom: 1.5rem; }
    .step-desc { color: #64748b; font-size: 0.875rem; margin-bottom: 1.25rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; font-size: 0.8125rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem; }
    .form-input {
      width: 100%; padding: 0.7rem 0.875rem; border: 1.5px solid #e2e8f0; border-radius: 8px;
      font-size: 0.875rem; background: #f8fafc; transition: all 0.2s;
      &:focus { outline: none; border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
      &.invalid { border-color: #ef4444; }
    }
    .error { font-size: 0.75rem; color: #ef4444; margin-top: 0.25rem; display: block; }
    .upload-zone {
      border: 2px dashed #e2e8f0; border-radius: 10px; padding: 1.25rem; margin-bottom: 0.75rem;
      cursor: pointer; transition: all 0.2s; text-align: center;
      &:hover { border-color: #7c3aed; background: rgba(124,58,237,0.03); }
      &.uploaded { border-color: #10b981; background: rgba(16,185,129,0.05); border-style: solid; }
    }
    .upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 0.375rem; color: #94a3b8;
      svg { color: #cbd5e1; }
      strong { color: #374151; font-size: 0.875rem; }
      small { font-size: 0.75rem; }
    }
    .upload-success { display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #059669; font-weight: 600; font-size: 0.875rem; }
    .check-icon { width: 24px; height: 24px; background: #10b981; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; }
    .review-step { margin-bottom: 1.5rem; }
    .review-section { background: #f8fafc; border-radius: 10px; padding: 1rem; margin-bottom: 0.75rem; }
    .review-section h4 { font-size: 0.875rem; font-weight: 700; color: #7c3aed; margin-bottom: 0.75rem; }
    .review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;
      div { display: flex; flex-direction: column; }
      span { font-size: 0.75rem; color: #64748b; }
      strong { font-size: 0.875rem; color: #1e293b; }
    }
    .step-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
    .btn-back { padding: 0.75rem 1.5rem; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.875rem; font-weight: 600; color: #64748b; cursor: pointer; background: #fff; transition: all 0.2s; &:hover { border-color: #7c3aed; color: #7c3aed; } }
    .btn-next { padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #fff; border: none; border-radius: 8px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; &:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(124,58,237,0.4); } }
    .btn-submit { padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #10b981, #059669); color: #fff; border: none; border-radius: 8px; font-size: 0.875rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s; &:disabled { opacity: 0.7; cursor: not-allowed; } }
    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .success-screen { text-align: center; padding: 2rem; }
    .success-icon { font-size: 4rem; margin-bottom: 1rem; }
    .success-screen h2 { font-size: 1.75rem; font-weight: 700; color: #1e1b4b; margin-bottom: 0.5rem; }
    .success-screen p { color: #64748b; margin-bottom: 1.5rem; }
    .status-card { display: flex; align-items: center; gap: 1rem; background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; text-align: left;
      strong { display: block; font-size: 0.9rem; color: #92400e; }
      small { font-size: 0.8rem; color: #b45309; }
    }
    .status-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; &.pending { background: #f59e0b; box-shadow: 0 0 0 4px rgba(245,158,11,0.2); animation: pulse 2s infinite; } }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
    .btn-login { display: inline-block; padding: 0.875rem 2rem; background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #fff; border-radius: 10px; font-weight: 600; text-decoration: none; transition: all 0.2s; &:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.4); } }
    @media (max-width: 768px) {
      .register-banner { display: none; }
      .form-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class VendorRegisterComponent {
  currentStep = signal(0);
  submitted = signal(false);
  submitting = signal(false);
  appId = signal(Math.floor(100000 + Math.random() * 900000).toString());
  uploadedDocs = signal<Record<string, boolean>>({});

  stepLabels = ['Business Info', 'Address', 'Documents', 'Bank Details', 'Review & Submit'];
  states = ['Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'];
  documents = [
    { key: 'gst', label: 'GST Certificate' },
    { key: 'pan', label: 'PAN Card' },
    { key: 'license', label: 'Business License' },
    { key: 'bank', label: 'Bank Proof (Cancelled Cheque)' },
  ];

  step1!: ReturnType<FormBuilder['group']>;
  step2!: ReturnType<FormBuilder['group']>;
  step4!: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder, private router: Router) {
    this.step1 = this.fb.group({
      businessName: ['', Validators.required],
      ownerName: ['', Validators.required],
      gstNumber: ['', Validators.required],
      businessType: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
    this.step2 = this.fb.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required],
    });
    this.step4 = this.fb.group({
      accountHolder: ['', Validators.required],
      accountNumber: ['', Validators.required],
      ifscCode: ['', Validators.required],
      bankName: ['', Validators.required],
    });
  }

  isInvalid(form: any, field: string) {
    const c = form.get(field);
    return c?.invalid && c?.touched;
  }

  nextStep() {
    const forms: any[] = [this.step1, this.step2, null, this.step4, null];
    const form = forms[this.currentStep()];
    if (form) { form.markAllAsTouched(); if (form.invalid) return; }
    this.currentStep.update(s => s + 1);
  }

  prevStep() { this.currentStep.update(s => s - 1); }

  simulateUpload(key: string) {
    this.uploadedDocs.update(d => ({ ...d, [key]: true }));
  }

  submit() {
    this.submitting.set(true);
    setTimeout(() => { this.submitting.set(false); this.submitted.set(true); }, 1500);
  }
}
