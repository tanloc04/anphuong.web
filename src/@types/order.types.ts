export interface PageInfo {
    totalItems: number,
    totalPages: number,
    pageNum: number,
    pageSize: number
}

export interface OrderRequest {
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

export interface OrderCustomer {
    id: number,
    fullName: string,
    phone: string,
    customerAddress: string,
    email: string
}

export interface OrderDetailItem {
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

export interface Order {
    id: number
    createdAt: string,
    updatedAt: string,
    isDeleted: boolean,
    paymentMethod: number,
    status: number,
    shippingDate: string,
    totalPrice: number,
    customerId: number,
    customer: OrderCustomer,
    orderDetail: OrderDetailItem[]
}

export interface OrderResponse {
    success: boolean,
    error: [{
            field: string,
            message: string []
        }
    ]
    message: string
    data: {
        pageInfo: PageInfo,
        pageData: Order[]
    }
}

export interface OrderDetailProps {
    visible: boolean;
    onHide: () => void;
    order: any;
}

export interface CreateOrderRequest {
    paymentMethod: number,
    status: number,
    shippingDate: string,
    customerId: number,
    orderDetails: OrderDetailItem []
}

export interface OrderFormProps {
  visible: boolean;
  onHide: () => void;
  onSave: (data: any) => void;
  loading?: boolean;
}