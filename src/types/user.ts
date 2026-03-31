export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  image: string;
  images: string[];
  video?: string;
  featured: boolean;
  inStock: boolean;
  tags: string[];
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: 'cm' | 'inches';
  };
  weight?: {
    value: number;
    unit: 'kg' | 'lbs';
  };
  colorOptions?: {
    option1?: { enabled: boolean; label: string; availableColors?: string[] };
    option2?: { enabled: boolean; label: string; availableColors?: string[] };
    option3?: { enabled: boolean; label: string; availableColors?: string[] };
  };
  createdAt: Date;
  updatedAt: Date;
}

export const AVAILABLE_COLORS = [
  'White',
  'Black',
  'Red',
  'Pink',
  'Purple',
  'Blue',
  'Light Blue',
  'Green',
  'Yellow',
  'Orange',
  'Brown',
  'Gray',
] as const;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured: boolean;
}

export interface Order {
  id: string;
  orderNumber?: string;
  stripeSessionId?: string;
  userId: string;
  userEmail?: string;
  email?: string;
  customerName: string;
  phone?: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode?: string;
    zipCode?: string;
    country: string;
  };
  products: {
    productId?: string;
    id?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    selectedColors?: {
      option1?: string;
      option2?: string;
      option3?: string;
    };
    colors?: {
      option1?: string;
      option2?: string;
      option3?: string;
    };
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  shippingCarrier?: string;
  shippingcarrier?: string;
  shippingService?: string;
  shippingCost?: number;
  shippingRateId?: string;
  insuranceEnabled?: boolean;
  insuranceCost?: number;
  insuranceCoverage?: number;
  notes?: string;
  total: number;
  paymentIntent: string;
  paymentStatus: 'pending' | 'succeeded' | 'failed' | 'refunded';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  trackingUrl?: string;
  trackingUrlProvider?: string;
  shippingLabelUrl?: string;
  carrier?: string;
  shippingStatus?: 'pending' | 'label_created' | 'in_transit' | 'delivered';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColors?: {
    option1?: string;
    option2?: string;
    option3?: string;
  };
}
