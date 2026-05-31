import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Booking, CreateBookingRequest } from '../models/booking.model';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private apiUrl = 'http://localhost:5000/api/bookings';

    constructor(private http: HttpClient) { }

    createBooking(data: any): Observable<{ success: boolean; booking: Booking }> {
        return this.http.post<any>(this.apiUrl, data).pipe(
            map(response => ({
                success: response.success,
                booking: response.data
            }))
        );
    }

    getAllBookings(): Observable<{ success: boolean; count: number; bookings: Booking[] }> {
        return this.http.get<any>(this.apiUrl).pipe(
            map(response => ({
                success: response.success,
                count: Array.isArray(response.data) ? response.data.length : response.data?.count ?? 0,
                bookings: Array.isArray(response.data) ? response.data : response.data?.bookings || []
            }))
        );
    }

    getMyBookings(): Observable<{ success: boolean; count: number; bookings: Booking[] }> {
        return this.http.get<any>(`${this.apiUrl}/my`).pipe(
            map(response => ({
                success: response.success,
                count: Array.isArray(response.data) ? response.data.length : response.data?.count ?? 0,
                bookings: Array.isArray(response.data) ? response.data : response.data?.bookings || []
            }))
        );
    }

    getBooking(id: string): Observable<{ success: boolean; booking: Booking }> {
        return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
            map(response => ({
                success: response.success,
                booking: response.data
            }))
        );
    }

    updateBookingStatus(id: string, status: string, paymentStatus?: string): Observable<{ success: boolean; booking: Booking }> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, { status, paymentStatus }).pipe(
            map(response => ({
                success: response.success,
                booking: response.data?.booking
            }))
        );
    }

    cancelBooking(id: string): Observable<{ success: boolean; message: string; booking: Booking }> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
            map(response => ({
                success: response.success,
                message: response.message,
                booking: response.data?.booking
            }))
        );
    }

    adminUpdateBooking(id: string, data: { selectedDate?: string; guide?: string; status?: string }): Observable<{ success: boolean; booking: Booking }> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, data).pipe(
            map(response => ({
                success: response.success,
                booking: response.data?.booking
            }))
        );
    }
}
