export interface CreateMaterialRequest {
  name: string;
  description?: string;
}

export interface MaterialRequest {
    searchCondition: {
        keyword: string,
        isDeleted: boolean
    },
    pageInfo: {
        pageNum: number,
        pageSize: number
    }  
}