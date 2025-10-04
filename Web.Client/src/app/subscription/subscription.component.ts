import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="subscription-section">
      <h2 class="subscription-title">Choose Your Subscription</h2>
      <p class="subscription-subtitle">Subscribe to be notified about critical AQI spikes, wildfire smoke events, and tailored health guidance.</p>
      <div class="subscription-cards">
        <div class="subscription-card individual">
          <h3>🏠 Individuals & Families</h3>
          <p>Monitor your local air quality and receive personalized health recommendations.</p>
          <button (click)="openForm('Individuals & Families')">Subscribe</button>
        </div>
        <div class="subscription-card schools">
          <h3>🏫 Schools & Organizations</h3>
          <p>Protect students and staff with real-time outdoor activity guidance.</p>
          <button (click)="openForm('Schools & Organizations')">Subscribe</button>
        </div>
        <div class="subscription-card emergency">
          <h3>🚨 Emergency Services</h3>
          <p>Access critical air quality data for emergency response planning.</p>
          <button (click)="openForm('Emergency Services')">Subscribe</button>
        </div>
        <div class="subscription-card policy">
          <h3>🏛️ Government & Policy</h3>
          <p>Make informed policy decisions with comprehensive air quality analytics.</p>
          <button (click)="openForm('Government & Policy')">Subscribe</button>
        </div>
      </div>
      <div class="modal" *ngIf="showForm">
        <div class="modal-content">
          <h3>Subscribe to {{ selectedType }}</h3>
          <form (ngSubmit)="submitForm()" #subForm="ngForm">
            <label>Name:</label>
            <input type="text" [(ngModel)]="formData.name" name="name" required>
            <label>Email:</label>
            <input type="email" [(ngModel)]="formData.email" name="email" required>
            <label>Location (City):</label>
            <select [(ngModel)]="formData.location" name="location" required class="city-select">
              <option value="">Select a city</option>
              <option *ngFor="let city of cities" [value]="city.value">{{ city.label }}</option>
            </select>
            <div class="modal-actions">
              <button type="submit" [disabled]="!subForm.form.valid">Submit</button>
              <button type="button" (click)="closeForm()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .subscription-section {
      padding: 2.5rem 0 3rem 0;
      background: linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%);
      min-height: 100vh;
    }
    .subscription-title {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #4F46E5;
      letter-spacing: 0.5px;
    }
    .subscription-subtitle {
      text-align:center;
      max-width:760px;
      margin:0 auto 2.2rem auto;
      font-size:1.05rem;
      line-height:1.55;
      color:#475569;
      font-weight:500;
    }
    .subscription-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2.5rem;
      max-width: 1200px;
      margin: 0 auto 2.5rem auto;
    }
    .subscription-card {
      background: rgba(255,255,255,0.95);
      border-radius: 22px;
      box-shadow: 0 8px 32px rgba(79, 70, 229, 0.10), 0 2px 8px rgba(79, 70, 229, 0.08);
      padding: 3.5rem 1.5rem 3.5rem 1.5rem;
      min-height: 420px;
      text-align: center;
      transition: transform 0.3s cubic-bezier(.4,0,.2,1);
      border-top: 7px solid;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .subscription-card::after {
      content: '';
      position: absolute;
      left: 0; right: 0; bottom: 0;
      height: 8px;
      border-radius: 0 0 22px 22px;
      opacity: 0.15;
      background: linear-gradient(90deg, #22c55e, #f59e0b, #ef4444, #4F46E5);
    }
    .subscription-card.individual { border-color: #22c55e; }
    .subscription-card.schools { border-color: #f59e0b; }
    .subscription-card.emergency { border-color: #ef4444; }
    .subscription-card.policy { border-color: #4F46E5; }
    .subscription-card h3 {
      font-size: 1.35rem;
      margin-bottom: 1rem;
      color: #1e293b;
      font-weight: 700;
      letter-spacing: 0.2px;
    }
    .subscription-card p {
      color: #64748b;
      margin-bottom: 2.2rem;
      font-size: 1.05rem;
      line-height: 1.6;
    }
    .subscription-card button {
      background: linear-gradient(135deg, #4F46E5, #7C3AED);
      color: white;
      border: none;
      border-radius: 30px;
      padding: 0.85rem 2.2rem;
      font-size: 1.08rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(79, 70, 229, 0.12);
      transition: background 0.2s, transform 0.2s;
      margin-top: 1rem;
    }
    .subscription-card button:hover {
      background: linear-gradient(135deg, #7C3AED, #4F46E5);
      transform: translateY(-2px) scale(1.04);
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.18);
    }
    .modal {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(30, 41, 59, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }
    .modal-content {
      background: white;
      border-radius: 16px;
      padding: 2rem 2.5rem;
      box-shadow: 0 8px 32px rgba(79, 70, 229, 0.15);
      min-width: 320px;
      max-width: 90vw;
      text-align: left;
    }
    .modal-content h3 {
      margin-top: 0;
      color: #4F46E5;
      font-size: 1.3rem;
      margin-bottom: 1.5rem;
    }
    .modal-content label {
      display: block;
      margin-bottom: 0.5rem;
      color: #1e293b;
      font-weight: 500;
    }
    .modal-content input {
      width: 100%;
      padding: 0.6rem;
      margin-bottom: 1.2rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      font-size: 1rem;
    }
    .city-select {
      width: 100%;
      padding: 0.65rem 0.6rem;
      margin-bottom: 1.2rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      font-size: 1rem;
      background: #ffffff;
      cursor: pointer;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .city-select:focus {
      outline: none;
      border-color: #4F46E5;
      box-shadow: 0 0 0 3px rgba(79,70,229,0.25);
    }
    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
    .modal-actions button {
      padding: 0.6rem 1.5rem;
      border-radius: 20px;
      border: none;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
    }
    .modal-actions button[type="submit"] {
      background: linear-gradient(135deg, #4F46E5, #7C3AED);
      color: white;
    }
    .modal-actions button[type="button"] {
      background: #e2e8f0;
      color: #1e293b;
    }
    @media (max-width: 900px) {
      .subscription-cards {
        grid-template-columns: 1fr 1fr;
        gap: 1.2rem;
      }
    }
    @media (max-width: 600px) {
      .modal-content {
        padding: 1rem;
      }
      .subscription-cards {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .subscription-title {
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }
    }
  `]
})
export class SubscriptionComponent {
  showForm = false;
  selectedType = '';
  formData = { name: '', email: '', location: '' };
  cities = [
    { value: 'new-york', label: 'New York, NY' },
    { value: 'los-angeles', label: 'Los Angeles, CA' },
    { value: 'chicago', label: 'Chicago, IL' },
    { value: 'houston', label: 'Houston, TX' },
    { value: 'phoenix', label: 'Phoenix, AZ' },
    { value: 'philadelphia', label: 'Philadelphia, PA' },
    { value: 'san-antonio', label: 'San Antonio, TX' },
    { value: 'san-diego', label: 'San Diego, CA' }
  ];

  openForm(type: string) {
    this.selectedType = type;
    this.showForm = true;
    this.formData = { name: '', email: '', location: '' };
  }

  closeForm() {
    this.showForm = false;
  }

  submitForm() {
    
    alert(`Thank you for subscribing to ${this.selectedType}!`);
    this.closeForm();
  }
}
