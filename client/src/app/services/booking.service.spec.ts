import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookingService } from './booking.service';

describe('BookingService', () => {
    let service: BookingService;
    let httpMock: HttpTestingController;
    const apiUrl = 'http://localhost:5000/api/bookings';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BookingService]
        });
        service = TestBed.inject(BookingService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get all bookings', () => {
        const mockResponse = { success: true, count: 1, bookings: [] };
        service.getAllBookings().subscribe(res => {
            expect(res).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(apiUrl);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should update booking status', () => {
        const bookingId = '123';
        const status = 'confirmed';
        service.updateBookingStatus(bookingId, status).subscribe(res => {
            expect(res.success).toBeTrue();
        });

        const req = httpMock.expectOne(`${apiUrl}/${bookingId}`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual({ status, paymentStatus: undefined });
        req.flush({ success: true });
    });
});
