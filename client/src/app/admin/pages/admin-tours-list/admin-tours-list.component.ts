import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TourService } from '../../../services/tour.service';
import { Tour } from '../../../models/tour.model';

@Component({
  selector: 'app-admin-tours-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-tours-list.component.html',
  styleUrl: './admin-tours-list.component.css'
})
export class AdminToursListComponent implements OnInit {
  tours: Tour[] = [];
  loading = true;
  error = '';

  constructor(private tourService: TourService) { }

  ngOnInit(): void {
    this.loadTours();
  }

  loadTours(): void {
    this.loading = true;
    this.tourService.getTours().subscribe({
      next: (res) => {
        this.tours = res.tours;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load tours';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteTour(id: string): void {
    if (confirm('Are you sure you want to delete this tour?')) {
      this.tourService.deleteTour(id).subscribe({
        next: () => {
          this.tours = this.tours.filter(t => t._id !== id);
        },
        error: (err) => {
          alert('Failed to delete tour');
          console.error(err);
        }
      });
    }
  }
}
