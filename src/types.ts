export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'vendor' | 'admin';
  profileImage?: string;
  createdAt: string;
}

export interface VendorProfile extends User {
  role: 'vendor';
  businessName: string;
  businessLicense?: string;
  serviceType: ServiceType[];
  description: string;
  priceRange: {
    min: number;
    max: number;
  };
  location: string;
  images: string[];
  rating: number;
  reviewCount: number;
  subscriptionTier: 'free' | 'pro' | 'premium';
  isVerified: boolean;
  features?: string[];
}

export type ServiceType =
  | 'catering'
  | 'decoration'
  | 'photography'
  | 'videography'
  | 'music'
  | 'venue'
  | 'planning';

export type EventType =
  | 'wedding'
  | 'birthday'
  | 'corporate'
  | 'conference'
  | 'graduation'
  | 'anniversary'
  | 'other';

export interface Booking {
  id: string;
  customerId: string;
  vendorId: string;
  eventType: EventType;
  eventDate: string;
  eventTime: string;
  location: string;
  guestCount: number;
  budget: number;
  specialRequirements?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: 'telebirr' | 'chapa';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  vendorId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  services: {
    serviceType: ServiceType;
    vendorId: string;
  }[];
  price: number;
  discount?: number;
  isActive: boolean;
}

export interface SearchFilters {
  serviceType?: ServiceType[];
  eventType?: EventType;
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  isVerified?: boolean;
}
