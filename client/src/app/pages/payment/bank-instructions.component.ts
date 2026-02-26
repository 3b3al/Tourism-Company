import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
    selector: 'app-bank-instructions',
    template: `
        <div class="instructions-container">
            <div class="instructions-card" *ngIf="booking">
                <h2>Bank Transfer Instructions</h2>
                <div class="alert alert-info">
                    Your booking is <strong>Pending Payment</strong>. Please transfer the total amount to the account below.
                </div>
                
                <div class="summary">
                    <p><strong>Tour:</strong> {{ booking.tour.title }}</p>
                    <p><strong>Total Amount:</strong> {{ booking.totalPrice | currency }}</p>
                    <p><strong>Reference Number:</strong> {{ booking._id?.substring(0,8).toUpperCase() }}</p>
                </div>

                <div class="bank-details">
                    <div class="detail-row">
                        <span class="label">Bank Name:</span>
                        <span class="value">Antigravity International Bank</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Account Name:</span>
                        <span class="value">Antigravity Tourism LLC</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">IBAN:</span>
                        <span class="value">US89 3704 0044 2101 2345 6789</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">SWIFT:</span>
                        <span class="value">ANTIGRAVUS33</span>
                    </div>
                </div>

                <div class="actions">
                    <button class="btn btn-primary" routerLink="/bookings">Done, View My Bookings</button>
                    <p class="foot-note">Your booking will be confirmed once we verify the transfer.</p>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .instructions-container { min-height: 80vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 20px; }
        .instructions-card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); max-width: 500px; width: 100%; border: 1px solid #e2e8f0; }
        h2 { color: #1e293b; margin-bottom: 24px; font-weight: 800; text-align: center; }
        .alert-info { background: #eff6ff; color: #1e40af; padding: 16px; border-radius: 12px; margin-bottom: 24px; font-size: 0.95rem; line-height: 1.5; border-left: 4px solid #3b82f6; }
        .summary { margin-bottom: 32px; padding: 16px; background: #f1f5f9; border-radius: 12px; }
        .summary p { margin: 8px 0; color: #475569; }
        .bank-details { margin-bottom: 32px; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
        .label { color: #64748b; font-size: 0.9rem; }
        .value { color: #1e293b; font-weight: 700; font-family: monospace; font-size: 1rem; }
        .actions { text-align: center; }
        .btn-primary { background: #3b82f6; color: white; border: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; cursor: pointer; width: 100%; margin-bottom: 16px; transition: background 0.2s; }
        .btn-primary:hover { background: #2563eb; }
        .foot-note { font-size: 0.8rem; color: #94a3b8; }
    `]
})
export class BankInstructionsComponent implements OnInit {
    bookingId: string | null = null;
    booking: Booking | null = null;

    constructor(
        private route: ActivatedRoute,
        private bookingService: BookingService
    ) { }

    ngOnInit(): void {
        this.bookingId = this.route.snapshot.paramMap.get('id');
        if (this.bookingId) {
            this.bookingService.getBooking(this.bookingId).subscribe(res => this.booking = res.booking);
        }
    }
}
