import type { IPageInfo } from "./common.types"

export interface ICategory {
    id: number,
    name: string,
    description: string
}

export interface ISearchCategoryCondition {
    keyword: string,
    status: string,
    isDeleted: boolean
}

export interface ISearchCategoryRequest {
    searchCondition: ISearchCategoryCondition,
    pageInfo: IPageInfo
}

export interface ICategoryRequest {
    name: string,
    description: string
}

export interface CategoryFormProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: any) => void;
    initialData?: ICategory | null;
    loading?: boolean;
}