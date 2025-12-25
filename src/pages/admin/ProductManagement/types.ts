import { type ReactNode } from 'react';


export interface IDetailImage {
  thumbnail: string | null,
  image1: string | null,
  image2: string | null,
  image3: string | null,
  image4: string | null
}

export interface ProductProps {
    id: number,
    name: string,
    price: number,
    discount: null | 10 | 30 | 50,
    description?: string,
    longSize: number,
    widthSize: number,
    heightSize: number,
    material: string,
    stock: number,
    detailImageId: number,
    detailImage?: IDetailImage,
    categoryId: number,
    variationId: number,
    createdAt: string,
    updatedAt: string 
}

export interface ProductFormData {
    name: string,
    description: string,
    price: number,
    discount: number | null, //Giá trị nhỏ nhất cho phép là 0.
    material: string,
    longSize: number,
    widthSize: number,
    heightSize: number,
    categoryId: number,
    variationId: number, //Có thể null, ko đc là giá trị 0.
    stock: number,
    thumbnail: File | string | null,
    image1: File | string | null,
    image2: File | string | null,
    image3: File | string | null,
    image4: File | string | null
}

export interface PreviewUrls {
    thumbnail: string,
    image1: string,
    image2: string,
    image3: string,
    image4: string
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export interface ProductListType extends ProductProps {
  stock: number;
  status: 'Stock' | 'Out of Stock';
}

export interface Tab {
  id: string;
  label: string;
  path: string;
}

export interface IProductSearchRequest {
  searchCondition: {
    keyword: string,
    status: string,
    isDeleted: boolean
  },

  pageInfo: {
    pageNum: number,
    pageSize: number
  }
}

export interface IProductSearchResponse {
  success: boolean,
  errors: any[],
  message: string,
  data: {
    pageInfo: {
      totalItems: number,
      totalPages: number,
      pageNum: number,
      pageSize: number
    },
    pageData: ProductListType[] 
  }
}

export interface Variant {
  id: number,
  productId: number,
  colorId: number,
  colorName: string
}

export interface VariationManagerProps {
  visible: boolean,
  product: any,
  onClose: () => void
}

export interface IColor {
  id: number,
  name: string,
  hexCode: string
}