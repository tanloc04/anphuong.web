import type { IPageInfo } from "./common.types";

export interface IProduct {
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
    material: string;
    longSize: number;
    widthSize: number;
    heightSize: number;
    categoryId: number | null;
    variationId: number | null;
    stock: number;
    thumbnail: string | File | null;
    image1: string | File | null;
    image2: string | File | null;
    image3: string | File | null;
    image4: string | null | File;
}

export interface PreviewUrls {
    thumbnail: string | null;
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

export interface IProductSearchCondition {
    keyword: string,
    status: string,
    isDeleted: boolean
}

export interface IProductSearchRequest {
    searchCondition: IProductSearchCondition,
    pageInfo: IPageInfo
}

export interface IProductRequest {
    name: string;
    description: string;
    price: number;
    discount: number;
    material: string;
    longSize: number;
    widthSize: number;
    heightSize: number;
    categoryId: number | null;
    variationId: number | null;
    stock: number;
    thumbnail: string | File | null;
    image1: string | File | null;
    image2: string | File | null;
    image3: string | File | null;
    image4: string | null | File;
}

export interface IClientProductSearchCondition {
    keyword: string;
    status: string;
    isDeleted: boolean;
    categoryIds?: number[];
    minPrice?: number;
    maxPrice?: number; 
    sortBy?: string; // 'price_asc', 'price_desc', 'newest'
}

export interface IClientProductSearchRequest {
    searchCondition: IClientProductSearchCondition;
    pageInfo: {
        pageNum: number;
        pageSize: number;
    };
}