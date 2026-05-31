import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:5000/api/auth';
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        // Check if user is already logged in
        const token = this.getToken();
        if (token) {
            this.loadCurrentUser();
        }
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<any>(`${this.apiUrl}/register`, data).pipe(
            map(response => ({
                success: response.success,
                token: response.data.token,
                user: response.data.user
            })),
            tap(response => {
                if (response.success) {
                    this.setToken(response.token);
                    this.currentUserSubject.next(response.user);
                }
            })
        );
    }

    login(data: LoginRequest): Observable<AuthResponse> {
        return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
            map(response => ({
                success: response.success,
                token: response.data.token,
                user: response.data.user
            })),
            tap(response => {
                if (response.success) {
                    this.setToken(response.token);
                    this.currentUserSubject.next(response.user);
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }

    loadCurrentUser(): void {
        this.http.get<any>(`${this.apiUrl}/me`).pipe(
            map(response => ({
                success: response.success,
                user: response.data
            }))
        ).subscribe({
            next: (response) => {
                if (response.success) {
                    this.currentUserSubject.next(response.user);
                }
            },
            error: () => {
                this.logout();
            }
        });
    }

    updateProfile(data: Partial<User>): Observable<{ success: boolean; user: User }> {
        return this.http.put<any>(`${this.apiUrl}/updateprofile`, data).pipe(
            map(response => ({
                success: response.success,
                user: response.data
            })),
            tap(response => {
                if (response.success) {
                    this.currentUserSubject.next(response.user);
                }
            })
        );
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    isGuide(): boolean {
        const user = this.getCurrentUser();
        return user?.role === 'guide';
    }

    isAdmin(): boolean {
        const user = this.getCurrentUser();
        return user?.role === 'admin';
    }
}
