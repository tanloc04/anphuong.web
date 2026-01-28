export interface IPageInfo {
    totalItems: number,
    totalPages: number,
    pageNum: number,
    pageSize: number
}

export interface IOrderRequest {
    searchCondition: {
        keyword: string,
        status: string,
        fromDate: string,
        toDate: string,
        isTotalPrice: boolean,
        isDeleted: boolean
    },
    pageInfo: {
        pageNum: number,
        pageSize: number
    }
}

export interface IOrderCustomer {
    id: number,
    fullName: string,
    phone: string,
    customerAddress: string,
    email: string
}

export interface IOrderDetailItem {
    id: number,
    productId: number,
    productName: string,
    thumbnail: string,
    isCustomize: boolean,
    customizeHeight: number,
    customizeWidth: number,
    customizeLong: number,
    customizeMaterial: number,
    quantity: number,
    subTotalPrice: number
}

export interface IOrder {
    id: number
    createdAt: string,
    updatedAt: string,
    isDeleted: boolean,
    paymentMethod: number,
    status: number,
    shippingDate: string,
    totalPrice: number,
    customerId: number,
    customer: IOrderCustomer,
    orderDetail: IOrderDetailItem[]
}

export interface IOrderResponse {
    success: boolean,
    error: [{
            field: string,
            message: string []
        }
    ]
    message: string
    data: {
        pageInfo: IPageInfo,
        pageData: IOrder[]
    }
}

export interface OrderDetailProps {
    visible: boolean;
    onHide: () => void;
    order: any;
}

export interface ICreateOrderRequest {
    paymentMethod: number,
    status: number,
    shippingDate: string,
    customerId: number,
    orderDetails: IOrderDetailItem []
}