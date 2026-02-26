export interface Tour {
    _id?: string;
    title: string;
    description: string;
    guide: any;
    locations: Location[];
    duration: number;
    maxGroupSize: number;
    price: number;
    currency?: string;
    difficulty: 'easy' | 'moderate' | 'difficult';
    category: 'cultural' | 'adventure' | 'nature' | 'food' | 'historical' | 'other';
    images: string[];
    availableDates: AvailableDate[];
    included?: string[];
    excluded?: string[];
    requirements?: string[];
    rating?: number;
    reviewCount?: number;
    isActive?: boolean;
    createdAt?: Date;
}

export interface Location {
    name: string;
    description?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    order?: number;
}

export interface AvailableDate {
    date: Date;
    startTime: string;
    endTime?: string;
    availableSpots: number;
}

export interface TourFilters {
    category?: string;
    difficulty?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
}
