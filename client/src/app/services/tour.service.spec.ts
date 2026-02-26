import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TourService } from './tour.service';
import { environment } from '../../environments/environment';

describe('TourService', () => {
    let service: TourService;
    let httpMock: HttpTestingController;
    const apiUrl = `${environment.apiUrl}/tours`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TourService]
        });
        service = TestBed.inject(TourService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get tours', () => {
        const mockResponse = { data: { success: true, count: 0, tours: [] } };
        service.getTours().subscribe(res => {
            expect(res).toEqual(mockResponse.data);
        });

        const req = httpMock.expectOne(apiUrl);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should create tour', () => {
        const mockTour = { title: 'New Tour' };
        service.createTour(mockTour).subscribe(res => {
            expect(res.success).toBeTrue();
        });

        const req = httpMock.expectOne(apiUrl);
        expect(req.request.method).toBe('POST');
        req.flush({ success: true, data: { success: true } });
    });

    it('should delete tour', () => {
        const id = '123';
        service.deleteTour(id).subscribe(res => {
            expect(res.success).toBeTrue();
        });

        const req = httpMock.expectOne(`${apiUrl}/${id}`);
        expect(req.request.method).toBe('DELETE');
        req.flush({ success: true, data: { success: true } });
    });
});
