export interface ProductProps {
    id: number,
    name: string,
    price: number,
    discount: null | 10 | 30 | 50,
    description?: string,
    longSize: number,
    widthSize: number,
    heghtSize: number,
    material: string,
    detailImageId: number,
    categoryId: number,
    variantionId: number,
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