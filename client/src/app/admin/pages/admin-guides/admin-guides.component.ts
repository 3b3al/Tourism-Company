import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-guides',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-guides.component.html',
  styleUrl: './admin-guides.component.css'
})
export class AdminGuidesComponent implements OnInit {
  users: any[] = [];
  loading = true;
  error = '';

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        // Filter out admins if you want, or just show everyone.
        // Showing everyone allows promoting tourists to guides.
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
