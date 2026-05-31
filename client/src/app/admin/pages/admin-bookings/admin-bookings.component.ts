import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { AdminService } from '../../../services/admin.service';
import { Booking } from '../../../models/booking.model';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-bookings.component.html',
  styleUrl: './admin-bookings.component.css'
})
export class AdminBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  guides: any[] = [];
  loading = true;
  error = '';

  // Search & filter
  searchTerm = '';
  filterStatus = '';

  // Edit modal state
  showEditModal = false;
  editingBooking: Booking | null = null;
  editDate = '';
  editGuideId = '';
  editSaving = false;
  editError = '';

  // Detail modal state
  showDetailModal = false;
  detailBooking: Booking | null = null;

  constructor(
    private bookingService: BookingService,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.loadBookings();
    this.loadGuides();
  }

  loadBookings(): void {
    this.loading = true;
    this.error = '';
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

  loadGuides(): void {
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.guides = res.data.filter((u: any) => u.role === 'guide');
      },
      error: (err) => console.error('Failed to load guides', err)
    });
  }

  get filteredBookings(): Booking[] {
    return this.bookings.filter(b => {
      const term = this.searchTerm.toLowerCase();
      const matchesTerm = !term ||
        b.tourist?.name?.toLowerCase().includes(term) ||
        b.tourist?.email?.toLowerCase().includes(term) ||
        b.tour?.title?.toLowerCase().includes(term) ||
        b.guide?.name?.toLowerCase().includes(term);
      const matchesStatus = !this.filterStatus || b.status === this.filterStatus;
      return matchesTerm && matchesStatus;
    });
  }

  // ── Detail Modal ────────────────────────────────────────────────────────────

  openDetail(booking: Booking): void {
    this.detailBooking = booking;
    this.showDetailModal = true;
  }

  closeDetail(): void {
    this.showDetailModal = false;
    this.detailBooking = null;
  }

  // ── Edit Modal ──────────────────────────────────────────────────────────────

  openEdit(booking: Booking): void {
    this.editingBooking = booking;
    this.editDate = booking.selectedDate
      ? new Date(booking.selectedDate).toISOString().split('T')[0]
      : '';
    this.editGuideId = booking.guide?._id || booking.guide || '';
    this.editError = '';
    this.showEditModal = true;
  }

  closeEdit(): void {
    this.showEditModal = false;
    this.editingBooking = null;
    this.editError = '';
  }

  saveEdit(): void {
    if (!this.editingBooking?._id) return;
    this.editSaving = true;
    this.editError = '';

    const payload: any = {};
    if (this.editDate) payload.selectedDate = this.editDate;
    if (this.editGuideId) payload.guide = this.editGuideId;

    this.bookingService.adminUpdateBooking(this.editingBooking._id, payload).subscribe({
      next: () => {
        this.editSaving = false;
        this.closeEdit();
        this.loadBookings();
      },
      error: (err) => {
        this.editSaving = false;
        this.editError = err?.error?.message || 'Failed to update booking';
        console.error(err);
      }
    });
  }

  // ── Status Actions ──────────────────────────────────────────────────────────

  confirmBooking(id: string): void {
    this.bookingService.updateBookingStatus(id, 'confirmed').subscribe({
      next: () => this.loadBookings(),
      error: (err) => { alert('Failed to confirm booking'); console.error(err); }
    });
  }

  cancelBooking(booking: Booking): void {
    if (!confirm(`Cancel booking for ${booking.tourist?.name || 'this tourist'}?`)) return;
    this.bookingService.cancelBooking(booking._id!).subscribe({
      next: () => this.loadBookings(),
      error: (err) => { alert('Failed to cancel booking'); console.error(err); }
    });
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  getGuideName(guideId: string): string {
    const guide = this.guides.find(g => g._id === guideId);
    return guide ? guide.name : guideId;
  }

  countByStatus(status: string): number {
    return this.bookings.filter(b => b.status === status).length;
  }

  trackByBookingId(_: number, b: Booking): string {
    return b._id || '';
  }
}
