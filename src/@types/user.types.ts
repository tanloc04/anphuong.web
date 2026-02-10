export interface UserFormProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: any) => void;
    initialData?: any | null;
    loading?: boolean;
}

export interface SearchUserCondition {
    keyword: string;
    status: string;
    isDeleted: boolean;
}

export interface SearchUserRequest {
    searchCondition: SearchUserCondition;
    pageInfo: {
        pageNum: number;
        pageSize: number;
    };
}

export interface UpdateUserRequest {
    username?: string;
    email?: string;
    fullname?: string;
    phone?: string;
    status?: string;
}