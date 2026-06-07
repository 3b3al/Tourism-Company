import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-guides',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-guides.component.html',
  styleUrl: './admin-guides.component.css'
})
export class AdminGuidesComponent implements OnInit {
  environment = environment;
  users: any[] = [];
  loading = true;
  error = '';
  showAddForm = false;
  formLoading = false;
  formError = '';
  formSuccess = '';

  guideForm = {
    name: '',
    email: '',
    password: '',
    phone: '',
    bio: '',
    languages: '',
    avatar: null as File | null
  };
  avatarPreview: string | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error(err);
      }
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.guideForm = {
      name: '',
      email: '',
      password: '',
      phone: '',
      bio: '',
      languages: '',
      avatar: null
    };
    this.avatarPreview = null;
    this.formError = '';
    this.formSuccess = '';
  }

  onAvatarSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.formError = 'Image size must be less than 5MB';
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.formError = 'Please select a valid image file';
        return;
      }
      this.guideForm.avatar = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.formError = '';
    }
  }

  addGuide(): void {
    this.formError = '';
    this.formSuccess = '';

    // Basic validation
    if (!this.guideForm.name || !this.guideForm.email || !this.guideForm.password) {
      this.formError = 'Name, email, and password are required';
      return;
    }

    if (this.guideForm.password.length < 6) {
      this.formError = 'Password must be at least 6 characters';
      return;
    }

    const guideData = {
      name: this.guideForm.name,
      email: this.guideForm.email,
      password: this.guideForm.password,
      phone: this.guideForm.phone,
      role: 'guide',
      bio: this.guideForm.bio,
      languages: this.guideForm.languages
        ? this.guideForm.languages.split(',').map(l => l.trim())
        : []
    };

    this.formLoading = true;
    this.adminService.createGuide(guideData).subscribe({
      next: (res) => {
        this.formSuccess = 'Guide created successfully!';
        this.formLoading = false;
        this.resetForm();
        setTimeout(() => {
          this.showAddForm = false;
          this.loadUsers();
          this.formSuccess = '';
        }, 2000);
      },
      error: (err) => {
        this.formError = err.error?.message || 'Failed to create guide';
        this.formLoading = false;
        console.error(err);
      }
    });
  }

  toggleRole(user: any): void {
    const newRole = user.role === 'guide' ? 'tourist' : 'guide';
    const action = newRole === 'guide' ? 'promote to guide' : 'revoke guide status';

    if (confirm(`Are you sure you want to ${action} for ${user.name}?`)) {
      this.adminService.updateUserRole(user._id, newRole).subscribe({
        next: (res) => {
          user.role = newRole; // Optimistic update
        },
        error: (err) => {
          alert('Failed to update role');
          console.error(err);
        }
      });
    }
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u._id !== id);
        },
        error: (err) => {
          alert('Failed to delete user');
          console.error(err);
        }
      });
    }
  }
}
