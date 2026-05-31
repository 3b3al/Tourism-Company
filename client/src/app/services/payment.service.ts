import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = `${environment.apiUrl}/payments`;

    constructor(private http: HttpClient) { }

    getPaymentMethods(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/methods`).pipe(
            map(response => response.data)
        );
    }

    createStripeCheckoutSession(bookingId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/create-checkout-session`, { bookingId }).pipe(
            map(response => response.data)
        );
    }
}
