import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminToursListComponent } from './admin-tours-list.component';
import { TourService } from '../../../services/tour.service';
import { RouterModule } from '@angular/router';

describe('AdminToursListComponent', () => {
  let component: AdminToursListComponent;
  let fixture: ComponentFixture<AdminToursListComponent>;
  let tourServiceSpy: jasmine.SpyObj<TourService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TourService', ['getTours', 'deleteTour']);

    await TestBed.configureTestingModule({
      imports: [AdminToursListComponent, RouterModule.forRoot([])],
      providers: [
        { provide: TourService, useValue: spy }
      ]
    })
      .compileComponents();

    tourServiceSpy = TestBed.inject(TourService) as jasmine.SpyObj<TourService>;
    fixture = TestBed.createComponent(AdminToursListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    tourServiceSpy.getTours.and.returnValue(of({ success: true, count: 0, tours: [] }));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load tours on init', () => {
    const mockTours = [
      { _id: '1', title: 'Tour 1', price: 100, duration: 5, images: [] },
      { _id: '2', title: 'Tour 2', price: 200, duration: 10, images: [] }
    ];
    tourServiceSpy.getTours.and.returnValue(of({ success: true, count: 2, tours: mockTours as any }));

    fixture.detectChanges();

    expect(component.tours.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should delete a tour', () => {
    const tour = { _id: '1', title: 'Tour 1' };
    component.tours = [tour as any];
    spyOn(window, 'confirm').and.returnValue(true);
    tourServiceSpy.deleteTour.and.returnValue(of({ success: true, message: 'Deleted' }));

    component.deleteTour('1');

    expect(tourServiceSpy.deleteTour).toHaveBeenCalledWith('1');
    expect(component.tours.length).toBe(0);
  });
});
