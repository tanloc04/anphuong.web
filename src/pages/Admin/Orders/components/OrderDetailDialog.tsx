// src/components/order/OrderDetailDialog.tsx
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { Order } from '@/types/order.types';

interface OrderDetailDialogProps {
  visible: boolean;
  order: Order | null;
  onHide: () => void;
}

const OrderDetailDialog = ({ visible, order, onHide }: OrderDetailDialogProps) => {
  if (!order) return null;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const priceBodyTemplate = (rowData: any) => formatCurrency(rowData.price);
  const subtotalBodyTemplate = (rowData: any) => formatCurrency(rowData.subtotal);

  const renderFooter = () => (
    <Button label="Đóng" icon="pi pi-times" text onClick={onHide} />
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={`Chi tiết đơn hàng #${order.id}`}
      modal
      style={{ width: '90vw', maxWidth: '1200px' }}
      breakpoints={{
            '960px': '85vw',     // màn hình nhỏ hơn 960px → chiếm 85% viewport width
            '641px': '95vw',     // màn hình nhỏ hơn 641px (mobile) → gần full width
        }}
      footer={renderFooter()}
      className="p-fluid"
    >
      <div className="space-y-6 pt-2">
        {/* Thông tin đơn hàng */}
        <div>
          <h5 className="font-bold text-lg mb-3 text-gray-800">Thông tin đơn hàng</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Mã đơn:</span>
              <p className="mt-1 font-medium">{order.id}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Phương thức thanh toán:</span>
              <p className="mt-1">{order.paymentMethod}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Trạng thái:</span>
              <div className="mt-1">
                <Tag
                  value={order.status}
                  severity={
                    order.status === 'Completed' ? 'success' :
                    order.status === 'Shipped' ? 'info' :
                    order.status === 'Pending' ? 'warning' : 'danger'
                  }
                  rounded
                />
              </div>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Tổng giá:</span>
              <p className="mt-1 text-green-600 font-bold text-lg">{formatCurrency(order.totalPrice)}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Ngày giao dự kiến:</span>
              <p className="mt-1">{formatDate(order.shippingDate)}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Ngày tạo:</span>
              <p className="mt-1">{formatDate(order.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Thông tin khách hàng */}
        <div>
          <h5 className="font-bold text-lg mb-3 text-gray-800">Thông tin khách hàng</h5>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold text-gray-700">Họ tên:</span> {order.customerName}
            </p>
            <p>
              <span className="font-semibold text-gray-700">SĐT:</span> {order.customerPhone}
            </p>
            {/* Nếu sau này có thêm email, địa chỉ,... thì bổ sung ở đây */}
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div>
          <h5 className="font-bold text-lg mb-3 text-gray-800">Danh sách sản phẩm</h5>

          <DataTable
            value={order.orderItems || []}
            responsiveLayout="scroll"
            emptyMessage="Đơn hàng không có sản phẩm"
            className="text-sm"
            stripedRows
            size="small"
          >
            <Column
              field="productName"
              header="Tên sản phẩm"
              style={{ minWidth: '220px' }}
            />
            <Column
              field="quantity"
              header="Số lượng"
              className="text-center"
              style={{ width: '100px' }}
            />
            <Column
              field="price"
              header="Đơn giá"
              body={priceBodyTemplate}
              className="text-right"
              style={{ width: '140px' }}
            />
            <Column
              field="subtotal"
              header="Thành tiền"
              body={subtotalBodyTemplate}
              className="text-right font-medium text-green-700"
              style={{ width: '160px' }}
            />
          </DataTable>

          {order.orderItems?.length > 0 && (
            <div className="mt-3 text-right text-base font-semibold">
              Tổng cộng: <span className="text-green-600">{formatCurrency(order.totalPrice)}</span>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default OrderDetailDialog;