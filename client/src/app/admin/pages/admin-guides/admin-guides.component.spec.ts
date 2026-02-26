import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminGuidesComponent } from './admin-guides.component';
import { AdminService } from '../../../services/admin.service';

describe('AdminGuidesComponent', () => {
  let component: AdminGuidesComponent;
  let fixture: ComponentFixture<AdminGuidesComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AdminService', ['getAllUsers', 'updateUserRole', 'deleteUser']);

    await TestBed.configureTestingModule({
      imports: [AdminGuidesComponent],
      providers: [
        { provide: AdminService, useValue: spy }
      ]
    })
      .compileComponents();

    adminServiceSpy = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    fixture = TestBed.createComponent(AdminGuidesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    adminServiceSpy.getAllUsers.and.returnValue(of({ data: [] }));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    const mockUsers = [
      { _id: '1', name: 'User 1', role: 'tourist' },
      { _id: '2', name: 'User 2', role: 'guide' }
    ];
    adminServiceSpy.getAllUsers.and.returnValue(of({ success: true, data: mockUsers }));

    fixture.detectChanges();

    expect(component.users.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should toggle user role', () => {
    const user = { _id: '1', name: 'User 1', role: 'tourist' };
    component.users = [user];
    spyOn(window, 'confirm').and.returnValue(true);
    adminServiceSpy.updateUserRole.and.returnValue(of({ success: true }));

    component.toggleRole(user);

    expect(adminServiceSpy.updateUserRole).toHaveBeenCalledWith('1', 'guide');
    expect(user.role).toBe('guide');
  });

  it('should delete user', () => {
    const user = { _id: '1', name: 'User 1', role: 'tourist' };
    component.users = [user];
    spyOn(window, 'confirm').and.returnValue(true);
    adminServiceSpy.deleteUser.and.returnValue(of({ success: true }));

    component.deleteUser('1');

    expect(adminServiceSpy.deleteUser).toHaveBeenCalledWith('1');
    expect(component.users.length).toBe(0);
  });
});
