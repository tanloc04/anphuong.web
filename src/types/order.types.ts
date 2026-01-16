// src/types/order.types.ts

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  status: 'Pending' | 'Shipped' | 'Completed' | 'Canceled';
  shippingDate: string;     // 'YYYY-MM-DD'
  totalPrice: number;
  createdAt: string;        // 'YYYY-MM-DD'
  isDeleted: boolean;
  orderItems: OrderItem[];
}

export interface IOrderFormProps {
  visible: boolean;
  onHide: () => void;
  onSave: (data: OrderFormSubmitData) => void;
  initialData?: Partial<Order> | null;
  loading?: boolean;
}

export interface OrderFormSubmitData {
  customerId: number;
  paymentMethod: string;
  status: string;
  shippingDate: string;     // 'YYYY-MM-DD'
  totalPrice: number;
  orderItems: { productId: number; quantity: number; price: number }[];
}

export type OrderFilters = {
    keyword: string;
    status: string[];
    paymentMethod: string | null;
    createdDateRange: Date[] | null;   // ⬅ ngày tạo
    shippingDateRange: Date[] | null;  // ⬅ ngày giao
};

