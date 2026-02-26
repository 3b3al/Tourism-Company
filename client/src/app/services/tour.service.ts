import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Tour, TourFilters } from '../models/tour.model';

@Injectable({
    providedIn: 'root'
})
export class TourService {
    private apiUrl = `${environment.apiUrl}/tours`;

    constructor(private http: HttpClient) { }

    getTours(filters?: TourFilters): Observable<{ success: boolean; count: number; tours: Tour[] }> {
        let params = new HttpParams();

        if (filters) {
            if (filters.category) params = params.set('category', filters.category);
            if (filters.difficulty) params = params.set('difficulty', filters.difficulty);
            if (filters.search) params = params.set('search', filters.search);
            if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
            if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
        }

        return this.http.get<any>(this.apiUrl, { params }).pipe(
            map(response => response.data)
        );
    }

    getTour(id: string): Observable<{ success: boolean; tour: Tour }> {
        return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
            map(response => response.data)
        );
    }

    getToursByGuide(guideId: string): Observable<{ success: boolean; count: number; tours: Tour[] }> {
        return this.http.get<any>(`${this.apiUrl}/guide/${guideId}`).pipe(
            map(response => response.data)
        );
    }

    createTour(tour: any): Observable<{ success: boolean; tour: Tour }> {
        return this.http.post<any>(this.apiUrl, tour).pipe(
            map(response => response.data)
        );
    }

    updateTour(id: string, tour: Partial<Tour>): Observable<{ success: boolean; tour: Tour }> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, tour).pipe(
            map(response => response.data)
        );
    }

    deleteTour(id: string): Observable<{ success: boolean; message: string }> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
            map(response => response.data || { success: true, message: response.message })
        );
    }
}
