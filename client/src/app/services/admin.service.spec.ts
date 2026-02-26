import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { environment } from '../../environments/environment';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/admin`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService]
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get dashboard stats', () => {
    const mockStats = { data: { totalTours: 5 } };
    service.getDashboardStats().subscribe(res => {
      expect(res).toEqual(mockStats);
    });

    const req = httpMock.expectOne(`${apiUrl}/dashboard-stats`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);
  });

  it('should get all users', () => {
    const mockUsers = { data: [{ name: 'User 1' }] };
    service.getAllUsers().subscribe(res => {
      expect(res).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${apiUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should update user role', () => {
    const userId = '123';
    const role = 'guide';
    service.updateUserRole(userId, role).subscribe(res => {
      expect(res.success).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/users/${userId}/role`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ role });
    req.flush({ success: true });
  });

  it('should delete user', () => {
    const userId = '123';
    service.deleteUser(userId).subscribe(res => {
      expect(res.success).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/users/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
});
