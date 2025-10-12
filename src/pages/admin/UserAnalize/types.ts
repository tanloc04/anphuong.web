export interface SearchCondition {
  keyword: string;
  status: string;
  isDelete: string;
}

export interface CustomersPageInfo {
  pageNum: number;
  pageSize: number;
}

export interface ProductsPageInfo {
  pageNum: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}