export interface IUserFormProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: any) => void;
    initialData?: any | null;
    loading?: boolean;
}

export interface IUpdateUserRequest {
    status: string
}

export interface ISearchCondition {
    keyword: string,
    status: string,
    isDeleted: boolean
}

export interface ISearchUserRequest {
    searchCondition: ISearchCondition,
    pageInfo: {
        pageNum: number,
        pageSize: number
    }
}