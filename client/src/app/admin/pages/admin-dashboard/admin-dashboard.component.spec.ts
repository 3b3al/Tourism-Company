import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminService } from '../../../services/admin.service';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AdminService', ['getDashboardStats']);

    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        { provide: AdminService, useValue: spy }
      ]
    })
      .compileComponents();

    adminServiceSpy = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    adminServiceSpy.getDashboardStats.and.returnValue(of({ data: {} }));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load stats on init', () => {
    const mockStats = {
      totalTours: 10,
      totalBookings: 5,
      totalUsers: 50,
      totalRevenue: 1000
    };
    adminServiceSpy.getDashboardStats.and.returnValue(of({ success: true, data: mockStats }));

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.loading).toBeFalse();
    expect(component.stats).toEqual(mockStats);
    expect(adminServiceSpy.getDashboardStats).toHaveBeenCalled();
  });

  it('should handle error when loading stats', () => {
    adminServiceSpy.getDashboardStats.and.returnValue(throwError(() => new Error('API Error')));

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to load statistics');
  });
});
