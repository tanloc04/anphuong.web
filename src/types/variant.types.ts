import type { IPageInfo } from "./common.types";
import type { IColor } from "./color.types";

export interface IVariant {
    colorId: number,
    productId: number,
    color: IColor
}

export interface ISearchVariantCondition {
    productId: number,
    status: string,
    isDeleted: boolean
}

export interface ISearchVariantRequest {
    searchCondition: ISearchVariantCondition,
    pageInfo: IPageInfo
}

export interface IVariantRequest {
    colorId: number,
    productId: number
}

export interface VariationManagerProps {
    visible: boolean;
    product: any;
    onClose: () => void;
}