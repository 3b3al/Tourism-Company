export interface User {
    id?: string;
    name: string;
    email: string;
    role: 'tourist' | 'guide' | 'admin';
    phone?: string;
    avatar?: string;
    bio?: string;
    languages?: string[];
    rating?: number;
    reviewCount?: number;
    isVerified?: boolean;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role?: 'tourist' | 'guide';
    phone?: string;
    bio?: string;
    languages?: string[];
}
