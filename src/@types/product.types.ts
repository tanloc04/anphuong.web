import type { PageInfo } from "./common.types";

export interface Product {
    id: number,
    name: string,
    description: string,
    price: number,
    discount: number,
    material: string,
    longSize: number,
    widthSize: number,
    heightSize: number,
    categoryId: number,
    variationId: null | null,
    thumbnail: string,
    image1: string,
    image2: string,
    image3: string,
    image4: string,
    stock: number
}

export interface ProductFormData {
    id?: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    longSize: number;
    widthSize: number;
    heightSize: number;
    isCustomize: boolean;
    categoryId: number | null;
    image1: string | File | null;
    image2: string | File | null;
    image3: string | File | null;
    image4: string | null | File;
}

export interface PreviewUrls {
    image1: string | null;
    image2: string | null;
    image3: string | null;
    image4: string | null;
}

export interface ProductFormProps {
  productId?: number | null,
  onSubmitForm: (formData: ProductFormData) => void;
  onClose: () => void;
}

export interface ProductSearchCondition {
    keyword: string,
    status: string,
    isDeleted: boolean,
    categoryId: number | null,
    startDate: string | null,
    endDate: string | null
}

export interface ProductSearchRequest {
    searchCondition: ProductSearchCondition,
    pageInfo: PageInfo
}

export interface ProductRequest {
    name: string;
    description: string;
    price: number;
    discount: number;
    longSize: number;
    widthSize: number;
    heightSize: number;
    isCustomize: boolean;
    categoryId: number | null;
    image1: string | File | null;
    image2: string | File | null;
    image3: string | File | null;
    image4: string | null | File;
}