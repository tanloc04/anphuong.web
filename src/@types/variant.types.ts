import type { PageInfo } from "./common.types";
import type { Color } from "./color.types";

export interface Variant {
    colorId: number,
    productId: number,
    color: Color
}

export interface SearchVariantCondition {
    productId: number,
    status: string,
    isDeleted: boolean
}

export interface SearchVariantRequest {
    searchCondition: SearchVariantCondition,
    pageInfo: PageInfo
}

export interface VariantRequest {
    colorId: number,
    productId: number,
    variantImage: string
}

export interface VariationManagerProps {
    visible: boolean;
    product: any;
    onClose: () => void;
}