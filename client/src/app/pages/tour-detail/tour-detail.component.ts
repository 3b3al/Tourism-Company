import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TourService } from '../../services/tour.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Tour } from '../../models/tour.model';

@Component({
    selector: 'app-tour-detail',
    templateUrl: './tour-detail.component.html',
    styleUrls: ['./tour-detail.component.css']
})
export class TourDetailComponent implements OnInit {
    tour: Tour | null = null;
    isLoading = true;
    bookingForm: FormGroup;
    showBookingForm = false;
    bookingSuccess = false;
    bookingError = '';
    isSubmitting = false;
    minDate: string = new Date().toISOString().split('T')[0];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private tourService: TourService,
        private bookingService: BookingService,
        public authService: AuthService,
        private fb: FormBuilder
    ) {
        this.bookingForm = this.fb.group({
            selectedDate: ['', Validators.required],
            selectedTime: ['', Validators.required],
            numberOfPeople: [1, [Validators.required, Validators.min(1)]],
            contactPhone: ['', Validators.required],
            contactEmail: ['', [Validators.required, Validators.email]],
            specialRequests: ['']
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadTour(id);
        }
    }

    loadTour(id: string): void {
        this.tourService.getTour(id).subscribe({
            next: (response) => {
                this.tour = response.tour;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading tour:', error);
                this.isLoading = false;
            }
        });
    }

    toggleBookingForm(): void {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }
        this.showBookingForm = !this.showBookingForm;
    }

    onSubmitBooking(): void {
        console.log('Submit clicked');
        console.log('Form Valid:', this.bookingForm.valid);
        console.log('Form Values:', this.bookingForm.value);
        console.log('Form Errors:', this.bookingForm.errors);

        if (this.bookingForm.invalid || !this.tour) {
            console.log('Form invalid or no tour');
            this.bookingForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;
        this.bookingError = '';

        const bookingData = {
            tourId: this.tour._id!,
            ...this.bookingForm.value
        };

        this.bookingService.createBooking(bookingData).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                this.bookingSuccess = true;
                this.bookingForm.reset();
                setTimeout(() => {
                    this.router.navigate(['/payment', response.booking._id]);
                }, 2000);
            },
            error: (error) => {
                this.isSubmitting = false;
                this.bookingError = error.error?.message || 'Booking failed. Please try again.';
            }
        });
    }

    getAvailableDates(): any[] {
        if (!this.tour) return [];
        return this.tour.availableDates.filter(date => {
            return new Date(date.date) >= new Date() && date.availableSpots > 0;
        });
    }

    getTimesForDate(): string[] {
        const selectedDate = this.bookingForm.get('selectedDate')?.value;
        if (!selectedDate || !this.tour) return [];

        // Find all slots for this date
        const dateSlots = this.tour.availableDates.filter(d =>
            new Date(d.date).toISOString().split('T')[0] === selectedDate
        );

        return dateSlots.map(slot => slot.startTime);
    }

    isDateInvalid(): boolean {
        const selectedDate = this.bookingForm.get('selectedDate')?.value;
        if (!selectedDate) return false;

        // Check if there are any times for this date
        const times = this.getTimesForDate();
        return times.length === 0;
    }

    calculateTotal(): number {
        if (!this.tour) return 0;
        const people = this.bookingForm.get('numberOfPeople')?.value || 1;
        return this.tour.price * people;
    }
}
