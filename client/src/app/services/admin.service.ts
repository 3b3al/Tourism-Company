import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;
  private authUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard-stats`);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/role`, { role });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  createGuide(guideData: any, avatar?: File): Observable<any> {
    if (avatar) {
      const formData = new FormData();
      Object.keys(guideData).forEach(key => {
        if (Array.isArray(guideData[key])) {
          guideData[key].forEach((item: any) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, guideData[key]);
        }
      });
      formData.append('avatar', avatar);
      return this.http.post(`${this.authUrl}/register`, formData as any);
    }
    return this.http.post(`${this.authUrl}/register`, guideData);
  }
}
