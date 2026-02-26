import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../models/booking.model';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-bookings.component.html',
  styleUrl: './admin-bookings.component.css'
})
export class AdminBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  error = '';

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (res) => {
        this.bookings = res.bookings;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load bookings';
        this.loading = false;
        console.error(err);
      }
    });
  }

  updateStatus(id: string, status: string): void {
    if (confirm(`Change status to ${status}?`)) {
      this.bookingService.updateBookingStatus(id, status).subscribe({
        next: (res) => {
          // Update local state
          const index = this.bookings.findIndex(b => b._id === id);
          if (index !== -1) {
            this.bookings[index] = res.booking;
          }
        },
        error: (err) => {
          alert('Failed to update booking');
          console.error(err);
        }
      });
    }
  }
}
