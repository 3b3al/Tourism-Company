import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../models/booking.model';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.component.html',
    styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
    bookings: Booking[] = [];
    isLoading = true;
    cancellingId: string | null = null;

    constructor(
        private bookingService: BookingService,
        public authService: AuthService
    ) { }

    ngOnInit(): void {
        this.loadBookings();
    }

    loadBookings(): void {
        this.isLoading = true;
        this.bookingService.getMyBookings().subscribe({
            next: (response) => {
                this.bookings = response.bookings;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading bookings:', error);
                this.isLoading = false;
            }
        });
    }

    cancelBooking(id: string): void {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        this.cancellingId = id;
        this.bookingService.cancelBooking(id).subscribe({
            next: () => {
                this.cancellingId = null;
                this.loadBookings();
            },
            error: (error) => {
                console.error('Error cancelling booking:', error);
                this.cancellingId = null;
                alert('Failed to cancel booking. Please try again.');
            }
        });
    }

    getStatusClass(status: string): string {
        const classes: { [key: string]: string } = {
            'pending': 'status-pending',
            'confirmed': 'status-confirmed',
            'cancelled': 'status-cancelled',
            'completed': 'status-completed'
        };
        return classes[status] || '';
    }

    canCancel(booking: Booking): boolean {
        return booking.status === 'pending' || booking.status === 'confirmed';
    }
}
