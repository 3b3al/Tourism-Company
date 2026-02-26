import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { PaymentService } from '../../services/payment.service';
import { Booking } from '../../models/booking.model';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
    bookingId: string | null = null;
    booking: Booking | null = null;
    paymentMethods: any[] = [];
    isLoading = true;
    isProcessing = false;
    error = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private bookingService: BookingService,
        private paymentService: PaymentService
    ) { }

    ngOnInit(): void {
        this.bookingId = this.route.snapshot.paramMap.get('id');
        if (this.bookingId) {
            this.loadBooking();
            this.loadPaymentMethods();
        } else {
            this.router.navigate(['/tours']);
        }
    }

    loadBooking(): void {
        this.bookingService.getBooking(this.bookingId!).subscribe({
            next: (response) => {
                this.booking = response.booking;
                if (this.booking.paymentStatus === 'paid') {
                    this.router.navigate(['/payment/success', this.bookingId]);
                }
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Failed to load booking details.';
                this.isLoading = false;
            }
        });
    }

    loadPaymentMethods(): void {
        this.paymentService.getPaymentMethods().subscribe({
            next: (response) => {
                this.paymentMethods = response.methods.filter((m: any) => m.active);
            }
        });
    }

    selectPaymentMethod(methodId: string): void {
        if (methodId === 'stripe') {
            this.processStripePayment();
        } else if (methodId === 'bankTransfer') {
            this.processBankTransfer();
        }
    }

    processStripePayment(): void {
        this.isProcessing = true;
        this.paymentService.createStripeCheckoutSession(this.bookingId!).subscribe({
            next: (response) => {
                // Redirect to Stripe Checkout
                window.location.href = response.url;
            },
            error: (err) => {
                this.error = 'Stripe payment initialization failed.';
                this.isProcessing = false;
            }
        });
    }

    processBankTransfer(): void {
        // For bank transfer, we might just show instructions or update status to pending payment
        this.router.navigate(['/payment/bank-instructions', this.bookingId]);
    }
}
