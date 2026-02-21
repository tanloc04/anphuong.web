export interface ApiErrorDetail {
  field: string,
  message: string[]
}

export interface ApiResponse<T> {
  success: boolean,
  message?: string,
  data?: T,
  errors?: any[]
}

export interface PageInfo {
  pageNum: number,
  pageSize: number
}

export interface FormInput {
    name: string;
    description: string;
}

export interface Customer {
    id: number;
    fullName: string;
    phone: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
}

export interface Variant {
    id: number;
    variantImage: string;
    color: {
        id: number;
        name: string;
        hexCode: string;
    };
}

export interface CartItem {
    variantId: number;
    productName: string;
    colorName?: string;
    image?: string;
    price: number;
    quantity: number;
    total: number;
}