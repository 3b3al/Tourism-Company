export interface Booking {
    _id?: string;
    tour: any;
    tourist: any;
    guide: any;
    selectedDate: Date;
    selectedTime: string;
    numberOfPeople: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    specialRequests?: string;
    contactPhone: string;
    contactEmail: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateBookingRequest {
    tourId: string;
    selectedDate: Date;
    selectedTime: string;
    numberOfPeople: number;
    specialRequests?: string;
    contactPhone: string;
    contactEmail: string;
}
