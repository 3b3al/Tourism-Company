import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { Tour, TourFilters } from '../../models/tour.model';

@Component({
    selector: 'app-tours',
    templateUrl: './tours.component.html',
    styleUrls: ['./tours.component.css']
})
export class ToursComponent implements OnInit {
    tours: Tour[] = [];
    isLoading = true;
    filters: TourFilters = {};

    categories = ['cultural', 'adventure', 'nature', 'food', 'historical', 'other'];
    difficulties = ['easy', 'moderate', 'difficult'];

    constructor(
        private tourService: TourService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // Get query params from URL
        this.route.queryParams.subscribe(params => {
            this.filters = {
                category: params['category'] || '',
                difficulty: params['difficulty'] || '',
                search: params['search'] || '',
                minPrice: params['minPrice'] ? Number(params['minPrice']) : undefined,
                maxPrice: params['maxPrice'] ? Number(params['maxPrice']) : undefined
            };
            this.loadTours();
        });
    }

    loadTours(): void {
        this.isLoading = true;
        const cleanFilters: TourFilters = {};

        if (this.filters.category) cleanFilters.category = this.filters.category;
        if (this.filters.difficulty) cleanFilters.difficulty = this.filters.difficulty;
        if (this.filters.search) cleanFilters.search = this.filters.search;
        if (this.filters.minPrice) cleanFilters.minPrice = this.filters.minPrice;
        if (this.filters.maxPrice) cleanFilters.maxPrice = this.filters.maxPrice;

        this.tourService.getTours(cleanFilters).subscribe({
            next: (response) => {
                this.tours = response.tours;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading tours:', error);
                this.isLoading = false;
            }
        });
    }

    onFilterChange(): void {
        this.loadTours();
    }

    clearFilters(): void {
        this.filters = {};
        this.loadTours();
    }
}
