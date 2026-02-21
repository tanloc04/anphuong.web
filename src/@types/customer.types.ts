export interface CustomerFormProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: any) => void;
    initialData?: any | null;
    loading?: boolean;
}

export interface SearchCustomerCondition {
    keyword: string;
    status: string;
    isDeleted: boolean;
}

export interface SearchCustomerRequest {
    searchCondition: SearchCustomerCondition;
    pageInfo: {
        pageNum: number;
        pageSize: number;
    };
}

export interface UpdateCustomerRequest {
    username?: string;
    email?: string;
    fullname?: string;
    phone?: string;
    status?: string;
}