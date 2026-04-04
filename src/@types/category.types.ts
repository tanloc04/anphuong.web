import type { PageInfo } from "./common.types";

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface SearchCategoryCondition {
  keyword: string;
  status: string;
  isDeleted: boolean;
}

export interface SearchCategoryRequest {
  searchCondition: SearchCategoryCondition;
  pageInfo: PageInfo;
}

export interface CategoryRequest {
  name: string;
  description: string;
  imageUrl?: string;
}

export interface CategoryFormProps {
  visible: boolean;
  onHide: () => void;
  onSave: (data: CategoryRequest) => void;
  initialData?: Category | null;
  loading?: boolean;
}

export interface CategoryFormInput {
  name: string;
  description: string;
  imageUrl: string;
}
