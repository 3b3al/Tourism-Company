import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
    bookingId: string | null = null;
    booking: Booking | null = null;
    isLoading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private bookingService: BookingService
    ) { }

    ngOnInit(): void {
        this.bookingId = this.route.snapshot.paramMap.get('id');
        if (this.bookingId) {
            this.loadBooking();
        } else {
            this.router.navigate(['/tours']);
        }
    }

    loadBooking(): void {
        this.bookingService.getBooking(this.bookingId!).subscribe({
            next: (response) => {
                this.booking = response.booking;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading booking for invoice:', err);
                this.isLoading = false;
            }
        });
    }

    printInvoice(): void {
        window.print();
    }
}
