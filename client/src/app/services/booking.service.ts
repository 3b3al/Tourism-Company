import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, CreateBookingRequest } from '../models/booking.model';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private apiUrl = 'http://localhost:5000/api/bookings';

    constructor(private http: HttpClient) { }

    createBooking(data: any): Observable<{ success: boolean; booking: Booking }> {
        return this.http.post<{ success: boolean; booking: Booking }>(this.apiUrl, data);
    }

    getAllBookings(): Observable<{ success: boolean; count: number; bookings: Booking[] }> {
        return this.http.get<{ success: boolean; count: number; bookings: Booking[] }>(this.apiUrl);
    }

    getMyBookings(): Observable<{ success: boolean; count: number; bookings: Booking[] }> {
        return this.http.get<{ success: boolean; count: number; bookings: Booking[] }>(`${this.apiUrl}/my`);
    }

    getBooking(id: string): Observable<{ success: boolean; booking: Booking }> {
        return this.http.get<{ success: boolean; booking: Booking }>(`${this.apiUrl}/${id}`);
    }

    updateBookingStatus(id: string, status: string, paymentStatus?: string): Observable<{ success: boolean; booking: Booking }> {
        return this.http.put<{ success: boolean; booking: Booking }>(`${this.apiUrl}/${id}`, { status, paymentStatus });
    }

    cancelBooking(id: string): Observable<{ success: boolean; message: string; booking: Booking }> {
        return this.http.delete<{ success: boolean; message: string; booking: Booking }>(`${this.apiUrl}/${id}`);
    }
}
