import { type ReactNode } from 'react';

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
    detailImageId: number,
    categoryId: number,
    variationId: number,
    createdAt: string,
    updatedAt: string 
}

export interface ProductFormData {
    name: string,
    description: string,
    price: number,
    discount: number,
    material: string,
    longSize: number,
    widthSize: number,
    heightSize: number,
    categoryId: number,
    variationId: number,
    thumbnail: File | null,
    image1: File | null,
    image2: File | null,
    image3: File | null,
    image4: File | null
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