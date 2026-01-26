export interface IUserFormProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: any) => void;
    initialData?: any | null;
    loading?: boolean;
}

export interface ISearchUserCondition {
    keyword: string;
    status: string;
    isDeleted: boolean;
}

export interface ISearchUserRequest {
    searchCondition: ISearchUserCondition;
    pageInfo: {
        pageNum: number;
        pageSize: number;
    };
}

export interface IUpdateUserRequest {
    username?: string;
    email?: string;
    fullname?: string;
    phone?: string;
    status?: string;
}