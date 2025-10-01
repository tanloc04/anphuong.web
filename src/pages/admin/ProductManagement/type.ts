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