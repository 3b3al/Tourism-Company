import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    loginForm: FormGroup;
    errorMessage = '';
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.login(this.loginForm.value).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || 'Login failed. Please try again.';
            }
        });
    }
}
