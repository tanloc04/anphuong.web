import type { PageInfo } from "./common.types"

export interface Category {
    id: number,
    name: string,
    description: string
}

export interface SearchCategoryCondition {
    keyword: string,
    status: string,
    isDeleted: boolean
}

export interface SearchCategoryRequest {
    searchCondition: SearchCategoryCondition,
    pageInfo: PageInfo
}

export interface CategoryRequest {
    name: string,
    description: string
}

export interface CategoryFormProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: any) => void;
    initialData?: Category | null;
    loading?: boolean;
}