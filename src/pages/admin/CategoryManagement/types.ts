export interface ICategory {
  id: number,
  name: string,
  description: string,
  createdAt: string,
  updatedAt: string
}

export interface ISearchCategoryRequest {
  pageIndex?: number,
  pageSize?: number,
  searchCondition?: string
}

export interface IPageInfo {
  totalItems: number,
  totalPages: number,
  pageNum: number,
  pageSize: number
}

export interface ISearchCategoryResponse {
  pageInfo: IPageInfo,
  pageData: ICategory[]
}