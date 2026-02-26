import { Component, OnInit } from '@angular/core';
import { TourService } from '../../services/tour.service';
import { Tour } from '../../models/tour.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    featuredTours: Tour[] = [];
    searchQuery = '';
    isLoading = true;

    categories = [
        { name: 'Cultural', icon: '🏛️', value: 'cultural' },
        { name: 'Adventure', icon: '🏔️', value: 'adventure' },
        { name: 'Nature', icon: '🌿', value: 'nature' },
        { name: 'Food', icon: '🍜', value: 'food' },
        { name: 'Historical', icon: '📜', value: 'historical' }
    ];

    constructor(private tourService: TourService) { }

    ngOnInit(): void {
        this.loadFeaturedTours();
    }

    loadFeaturedTours(): void {
        this.tourService.getTours().subscribe({
            next: (response) => {
                this.featuredTours = response.tours.slice(0, 6);
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading tours:', error);
                this.isLoading = false;
            }
        });
    }

    onSearch(): void {
        if (this.searchQuery.trim()) {
            // Navigate to tours page with search query
            window.location.href = `/tours?search=${encodeURIComponent(this.searchQuery)}`;
        }
    }

    onCategoryClick(category: string): void {
        window.location.href = `/tours?category=${category}`;
    }
}
