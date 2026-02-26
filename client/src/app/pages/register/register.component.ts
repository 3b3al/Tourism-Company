import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm: FormGroup;
    errorMessage = '';
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            role: ['tourist', Validators.required],
            phone: [''],
            bio: [''],
            languages: ['']
        });
    }

    onSubmit(): void {
        if (this.registerForm.invalid) {
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const formData = { ...this.registerForm.value };

        // Convert languages string to array
        if (formData.languages) {
            formData.languages = formData.languages.split(',').map((lang: string) => lang.trim());
        }

        this.authService.register(formData).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
            }
        });
    }

    get isGuide(): boolean {
        return this.registerForm.get('role')?.value === 'guide';
    }
}
