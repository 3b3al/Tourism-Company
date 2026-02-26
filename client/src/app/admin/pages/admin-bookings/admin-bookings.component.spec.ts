import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminBookingsComponent } from './admin-bookings.component';
import { BookingService } from '../../../services/booking.service';

describe('AdminBookingsComponent', () => {
  let component: AdminBookingsComponent;
  let fixture: ComponentFixture<AdminBookingsComponent>;
  let bookingServiceSpy: jasmine.SpyObj<BookingService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('BookingService', ['getAllBookings', 'updateBookingStatus']);

    await TestBed.configureTestingModule({
      imports: [AdminBookingsComponent],
      providers: [
        { provide: BookingService, useValue: spy }
      ]
    })
      .compileComponents();

    bookingServiceSpy = TestBed.inject(BookingService) as jasmine.SpyObj<BookingService>;
    fixture = TestBed.createComponent(AdminBookingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    bookingServiceSpy.getAllBookings.and.returnValue(of({ success: true, count: 0, bookings: [] }));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load bookings on init', () => {
    const mockBookings = [
      { _id: '1', status: 'pending', totalPrice: 100 },
      { _id: '2', status: 'confirmed', totalPrice: 200 }
    ];
    bookingServiceSpy.getAllBookings.and.returnValue(of({ success: true, count: 2, bookings: mockBookings as any }));

    fixture.detectChanges();

    expect(component.bookings.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should update booking status', () => {
    const booking = { _id: '1', status: 'pending' };
    component.bookings = [booking as any];
    spyOn(window, 'confirm').and.returnValue(true);
    bookingServiceSpy.updateBookingStatus.and.returnValue(of({ success: true, booking: { ...booking, status: 'confirmed' } as any }));

    component.updateStatus('1', 'confirmed');

    expect(bookingServiceSpy.updateBookingStatus).toHaveBeenCalledWith('1', 'confirmed');
    expect(component.bookings[0].status).toBe('confirmed');
  });
});
