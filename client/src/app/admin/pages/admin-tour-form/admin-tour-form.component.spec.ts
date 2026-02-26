import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AdminTourFormComponent } from './admin-tour-form.component';
import { TourService } from '../../../services/tour.service';
import { AdminService } from '../../../services/admin.service';

describe('AdminTourFormComponent', () => {
  let component: AdminTourFormComponent;
  let fixture: ComponentFixture<AdminTourFormComponent>;
  let tourServiceSpy: jasmine.SpyObj<TourService>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const tourSpy = jasmine.createSpyObj('TourService', ['getTour', 'createTour', 'updateTour']);
    const adminSpy = jasmine.createSpyObj('AdminService', ['getAllUsers']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AdminTourFormComponent, ReactiveFormsModule],
      providers: [
        { provide: TourService, useValue: tourSpy },
        { provide: AdminService, useValue: adminSpy },
        { provide: Router, useValue: rSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } }
          }
        }
      ]
    })
      .compileComponents();

    tourServiceSpy = TestBed.inject(TourService) as jasmine.SpyObj<TourService>;
    adminServiceSpy = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    adminServiceSpy.getAllUsers.and.returnValue(of({ data: [] }));
    fixture = TestBed.createComponent(AdminTourFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values in create mode', () => {
    expect(component.isEditMode).toBeFalse();
    expect(component.tourForm.get('title')?.value).toBe('');
  });

  it('should call createTour on submit when form is valid', () => {
    component.tourForm.patchValue({
      title: 'Test Tour',
      description: 'Test Desc',
      price: 100,
      duration: 5,
      maxGroupSize: 10,
      category: 'other',
      difficulty: 'moderate',
      guide: 'guide123'
    });

    tourServiceSpy.createTour.and.returnValue(of({ success: true, tour: {} as any }));

    component.onSubmit();

    expect(tourServiceSpy.createTour).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/tours']);
  });
});
