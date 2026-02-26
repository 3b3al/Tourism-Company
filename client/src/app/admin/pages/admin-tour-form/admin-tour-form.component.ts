import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TourService } from '../../../services/tour.service';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-tour-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-tour-form.component.html',
  styleUrl: './admin-tour-form.component.css'
})
export class AdminTourFormComponent implements OnInit {
  tourForm: FormGroup;
  isEditMode = false;
  tourId: string | null = null;
  guides: any[] = [];
  loading = false;
  submitted = false;
  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private tourService: TourService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.tourForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      price: [0, [Validators.required, Validators.min(0)]],
      duration: [0, [Validators.required, Validators.min(0)]],
      maxGroupSize: [1, [Validators.required, Validators.min(1)]],
      difficulty: ['moderate', Validators.required],
      category: ['other', Validators.required],
      guide: ['', Validators.required],
      included: [''],
      excluded: [''],
      requirements: [''],
    });
  }

  ngOnInit(): void {
    this.loadGuides();
    this.tourId = this.route.snapshot.paramMap.get('id');
    if (this.tourId) {
      this.isEditMode = true;
      this.loadTour(this.tourId);
    }
  }

  loadGuides(): void {
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.guides = res.data.filter((u: any) => u.role === 'guide');
      }
    });
  }

  loadTour(id: string): void {
    this.loading = true;
    this.tourService.getTour(id).subscribe({
      next: (res) => {
        const tour = res.tour;
        this.tourForm.patchValue({
          title: tour.title,
          description: tour.description,
          price: tour.price,
          duration: tour.duration,
          maxGroupSize: tour.maxGroupSize,
          difficulty: tour.difficulty,
          category: tour.category,
          guide: tour.guide?._id || tour.guide, // Handle populated guide object
          included: tour.included?.join(', ') || '',
          excluded: tour.excluded?.join(', ') || '',
          requirements: tour.requirements?.join(', ') || ''
        });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.selectedFiles.push(event.target.files[i]);
      }
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.tourForm.invalid) return;
    this.loading = true;

    const tourData = { ...this.tourForm.value };
    // Convert comma separated strings to arrays
    ['included', 'excluded', 'requirements'].forEach(key => {
      if (tourData[key]) {
        tourData[key] = tourData[key].split(',').map((item: string) => item.trim());
      } else {
        tourData[key] = [];
      }
    });

    if (this.isEditMode && this.tourId) {
      this.tourService.updateTour(this.tourId, tourData).subscribe({
        next: () => {
          this.router.navigate(['/admin/tours']);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      // Logic for FormData
      const formData = new FormData();
      Object.keys(tourData).forEach(key => {
        if (Array.isArray(tourData[key])) {
          tourData[key].forEach((item: any) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, tourData[key]);
        }
      });

      this.selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      this.tourService.createTour(formData as any).subscribe({
        next: () => {
          this.router.navigate(['/admin/tours']);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    }
  }
}
