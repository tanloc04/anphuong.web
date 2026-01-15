    // src/pages/OrderManagement.tsx
    import { useState, useRef } from 'react';
    import { DataTable } from 'primereact/datatable';
    import { Column } from 'primereact/column';
    import { Button } from 'primereact/button';
    import { Toast } from 'primereact/toast';
    import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
    import { InputText } from 'primereact/inputtext';
    import { Tag } from 'primereact/tag';
    import { Dropdown } from 'primereact/dropdown';
    import { MultiSelect } from 'primereact/multiselect';
    import OrderForm from './components/OrderForm';
    import type { Order, OrderFormSubmitData } from '@/types/order.types';
    import OrderDetailDialog from './components/OrderDetailDialog';

    // Dữ liệu mẫu customers và products (thay bằng API trong thực tế)
    const customers = [
    { id: 1, fullname: 'Nguyễn Văn A', email: 'a@gmail.com', phone: '0909123456' },
    { id: 2, fullname: 'Trần Thị B', email: 'b@gmail.com', phone: '0987654321' },
    { id: 3, fullname: 'Lê Văn C', email: 'c@gmail.com', phone: '0912345678' },
    ];

    const products = [
    { id: 1, name: 'Sản phẩm A', price: 100000 },
    { id: 2, name: 'Sản phẩm B', price: 200000 },
    { id: 3, name: 'Sản phẩm C', price: 300000 },
    { id: 4, name: 'Sản phẩm D', price: 400000 },
    ];

    const OrderManagement = () => {
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // State cho form thêm/sửa
    const [formVisible, setFormVisible] = useState(false);
    const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
    const [editingOrder, setEditingOrder] = useState<Partial<Order> | null>(null);

    const [keyword, setKeyword] = useState('');
    const [filters, setFilters] = useState<any>({});
    const [lazyParams, setLazyParams] = useState({ first: 0, rows: 10, page: 0 });

    const toast = useRef<Toast>(null);

    // Danh sách orders (dùng state thay vì mock tĩnh)
    const [orders, setOrders] = useState<Order[]>([
        {
        id: 1,
        paymentMethod: 'Credit Card',
        status: 'Pending',
        shippingDate: '2026-01-15',
        totalPrice: 1500000,
        customerId: 1,
        customerName: 'Nguyễn Văn A',
        customerPhone: '0909123456',
        createdAt: '2026-01-10',
        isDeleted: false,
        orderItems: [
            { id: 1, productId: 1, productName: 'Sản phẩm A', quantity: 5, price: 100000, subtotal: 500000 },
            { id: 2, productId: 2, productName: 'Sản phẩm B', quantity: 5, price: 200000, subtotal: 1000000 },
        ],
        },
        {
        id: 2,
        paymentMethod: 'Cash on Delivery',
        status: 'Shipped',
        shippingDate: '2026-01-20',
        totalPrice: 2500000,
        customerId: 2,
        customerName: 'Trần Thị B',
        customerPhone: '0987654321',
        createdAt: '2026-01-12',
        isDeleted: false,
        orderItems: [
            { id: 3, productId: 3, productName: 'Sản phẩm C', quantity: 5, price: 300000, subtotal: 1500000 },
            { id: 4, productId: 4, productName: 'Sản phẩm D', quantity: 2, price: 400000, subtotal: 800000 },
        ],
        },
        {
        id: 4,
        paymentMethod: 'Credit Card',
        status: 'Completed',
        shippingDate: '2026-01-22',
        totalPrice: 3500000,
        customerId: 1,
        customerName: 'Nguyễn Văn A',
        customerPhone: '0909123456',
        createdAt: '2026-01-14',
        isDeleted: false,
        orderItems: [
            { id: 5, productId: 1, productName: 'Sản phẩm A', quantity: 10, price: 100000, subtotal: 1000000 },
            { id: 6, productId: 3, productName: 'Sản phẩm C', quantity: 5, price: 300000, subtotal: 1500000 },
            { id: 7, productId: 4, productName: 'Sản phẩm D', quantity: 3, price: 400000, subtotal: 1200000 },
        ],
        },
        {
        id: 5,
        paymentMethod: 'Bank Transfer',
        status: 'Pending',
        shippingDate: '2026-01-25',
        totalPrice: 500000,
        customerId: 2,
        customerName: 'Trần Thị B',
        customerPhone: '0987654321',
        createdAt: '2026-01-15',
        isDeleted: false,
        orderItems: [
            { id: 8, productId: 2, productName: 'Sản phẩm B', quantity: 2, price: 200000, subtotal: 400000 },
            { id: 9, productId: 1, productName: 'Sản phẩm A', quantity: 1, price: 100000, subtotal: 100000 },
        ],
        },
    ]);

    const statusOptions = ['Pending', 'Shipped', 'Completed', 'Canceled'];
    const paymentOptions = ['Credit Card', 'Cash on Delivery', 'Bank Transfer'];

    // Thống kê
    const visibleOrders = orders.filter((o) => !o.isDeleted);
    const totalOrders = visibleOrders.length;
    const pendingOrders = visibleOrders.filter((o) => o.status === 'Pending').length;
    const completedOrders = visibleOrders.filter((o) => o.status === 'Completed').length;
    const totalRevenue = visibleOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN');
    };

    const openDetail = (order: Order) => {
        setSelectedOrder(order);
        setDetailVisible(true);
    };

    const handleDeleteOrRestore = (order: Order) => {
        const isDelete = !order.isDeleted;
        confirmDialog({
        message: `Bạn có chắc muốn ${isDelete ? 'xóa' : 'khôi phục'} đơn hàng "${order.id}"?`,
        header: `Xác nhận ${isDelete ? 'xóa' : 'khôi phục'}`,
        icon: 'pi pi-exclamation-triangle',
        acceptClassName: isDelete ? 'p-button-danger' : 'p-button-success',
        acceptLabel: isDelete ? 'Xóa' : 'Khôi phục',
        rejectLabel: 'Hủy',
        accept: () => {
            setOrders((prev) =>
            prev.map((o) => (o.id === order.id ? { ...o, isDeleted: isDelete } : o))
            );
            toast.current?.show({
            severity: 'success',
            summary: 'Thành công',
            detail: `${isDelete ? 'Xóa' : 'Khôi phục'} đơn hàng thành công`,
            });
        },
        });
    };

    const statusBodyTemplate = (rowData: Order) => {
        let severity: 'success' | 'info' | 'warning' | 'danger' = 'info';
        switch (rowData.status) {
        case 'Pending':
            severity = 'warning';
            break;
        case 'Shipped':
            severity = 'info';
            break;
        case 'Completed':
            severity = 'success';
            break;
        case 'Canceled':
            severity = 'danger';
            break;
        }
        return <Tag value={rowData.status} severity={severity} rounded />;
    };

    const priceBodyTemplate = (rowData: Order) => {
        return <span className="text-green-600 font-semibold">{formatCurrency(rowData.totalPrice)}</span>;
    };

    const dateBodyTemplate = (rowData: Order, field: 'shippingDate' | 'createdAt') => {
        return (
        <div>
            <div className="text-sm text-gray-800">{formatDate(rowData[field])}</div>
            <div className="text-xs text-gray-500">{field === 'shippingDate' ? 'Dự kiến giao' : 'Ngày tạo'}</div>
        </div>
        );
    };

    const customerBodyTemplate = (rowData: Order) => {
        return (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">{rowData.customerName.charAt(0)}</span>
            </div>
            <div>
            <p className="text-sm font-medium text-gray-800">{rowData.customerName}</p>
            <p className="text-xs text-gray-500">{rowData.customerPhone}</p>
            </div>
        </div>
        );
    };

    const actionBodyTemplate = (rowData: Order) => {
        return (
        <div className="flex gap-1">
            <Button
            icon="pi pi-eye"
            rounded
            text
            severity="secondary"
            tooltip="Xem chi tiết"
            onClick={() => openDetail(rowData)}
            />
            <Button
            icon="pi pi-pencil"
            rounded
            text
            severity="info"
            tooltip="Chỉnh sửa"
            onClick={() => {
                setFormMode('edit');
                setEditingOrder(rowData);
                setFormVisible(true);
            }}
            />
            <Button
            icon={rowData.isDeleted ? 'pi pi-refresh' : 'pi pi-trash'}
            rounded
            text
            severity={rowData.isDeleted ? 'success' : 'danger'}
            tooltip={rowData.isDeleted ? 'Khôi phục' : 'Xóa'}
            onClick={() => handleDeleteOrRestore(rowData)}
            />
        </div>
        );
    };

    const handleSaveOrder = (data: OrderFormSubmitData) => {
        const selectedCustomer = customers.find((c) => c.id === data.customerId);
        const customerName = selectedCustomer?.fullname ?? 'Khách hàng mới';
        const customerPhone = selectedCustomer?.phone ?? 'Chưa có';

        const orderItemsWithDetails = data.orderItems.map((item, index) => {
        const product = products.find((p) => p.id === item.productId);
        return {
            id: index + 1, // Temporary ID – thực tế nên dùng uuid hoặc backend sinh
            productId: item.productId,
            productName: product?.name ?? 'Unknown',
            quantity: item.quantity,
            price: item.price,
            subtotal: item.quantity * item.price,
        };
        });

        if (formMode === 'add') {
        const newId = Math.max(...orders.map((o) => o.id), 0) + 1;
        const newOrder: Order = {
            id: newId,
            customerId: data.customerId,
            customerName,
            customerPhone,
            paymentMethod: data.paymentMethod,
            status: data.status as any,
            shippingDate: data.shippingDate,
            totalPrice: data.totalPrice,
            createdAt: new Date().toISOString().split('T')[0],
            isDeleted: false,
            orderItems: orderItemsWithDetails,
        };

        setOrders((prev) => [...prev, newOrder]);
        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Tạo đơn hàng mới thành công' });
        } else if (formMode === 'edit' && editingOrder?.id) {
        setOrders((prev) =>
            prev.map((o) =>
            o.id === editingOrder.id
                ? {
                    ...o,
                    customerId: data.customerId,
                    customerName,
                    customerPhone,
                    paymentMethod: data.paymentMethod,
                    status: data.status as any,
                    shippingDate: data.shippingDate,
                    totalPrice: data.totalPrice,
                    orderItems: orderItemsWithDetails,
                }
                : o
            )
        );
        toast.current?.show({
            severity: 'success',
            summary: 'Thành công',
            detail: `Cập nhật đơn #${editingOrder.id} thành công`,
        });
        }

        setFormVisible(false);
        setEditingOrder(null);
    };

    const renderHeader = () => {
        return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
            <div>
                <h4 className="text-2xl font-bold text-blue-800">Quản lý Đơn hàng</h4>
            </div>
            <div className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-semibold">
                {totalOrders} đơn hàng
            </div>
            </div>

            {/* Thống kê cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm mb-1">Tổng đơn hàng</p>
                    <p className="text-3xl font-bold text-gray-800">{totalOrders}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                    <i className="pi pi-shopping-cart text-blue-500 text-2xl"></i>
                </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm mb-1">Đang chờ</p>
                    <p className="text-3xl font-bold text-gray-800">{pendingOrders}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                    <i className="pi pi-clock text-yellow-500 text-2xl"></i>
                </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm mb-1">Đã hoàn thành</p>
                    <p className="text-3xl font-bold text-gray-800">{completedOrders}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                    <i className="pi pi-check-circle text-green-500 text-2xl"></i>
                </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm mb-1">Doanh thu</p>
                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                    <i className="pi pi-dollar text-purple-500 text-2xl"></i>
                </div>
                </div>
            </div>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-wrap gap-3 items-center">
            <Button
                label="Thêm mới"
                icon="pi pi-plus"
                severity="success"
                raised
                onClick={() => {
                setFormMode('add');
                setEditingOrder(null);
                setFormVisible(true);
                }}
            />

            {/* Nút này có thể toggle hiển thị đơn đã xóa sau */}
            <Button label="Hiển thị xóa" icon="pi pi-eye" outlined />

            <div className="flex-1 flex gap-3 justify-end items-center">
                <div className="relative">
                <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
                <InputText
                    type="search"
                    placeholder="Tìm kiếm..."
                    value={keyword}
                    onChange={(e) => {
                    setKeyword(e.target.value);
                    setLazyParams((prev) => ({ ...prev, first: 0 }));
                    }}
                    className="p-inputtext-sm !pl-10 w-64"
                />
                </div>

                <MultiSelect
                value={filters.status}
                options={statusOptions}
                onChange={(e) => setFilters({ ...filters, status: e.value })}
                placeholder="Trạng thái"
                className="w-48 p-inputtext-sm"
                />

                <Dropdown
                value={filters.paymentMethod}
                options={paymentOptions}
                onChange={(e) => setFilters({ ...filters, paymentMethod: e.value })}
                placeholder="Thanh toán"
                className="w-48 p-inputtext-sm"
                />
            </div>
            </div>
        </div>
        );
    };

    return (
        <div className="bg-gray-50 p-6 min-h-screen">
        <Toast ref={toast} />
        <ConfirmDialog />

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <DataTable
            value={visibleOrders.filter(
                (order) =>
                !keyword ||
                order.id.toString().includes(keyword) ||
                order.customerName.toLowerCase().includes(keyword.toLowerCase()) ||
                order.customerPhone.includes(keyword)
            )}
            lazy
            paginator
            header={renderHeader()}
            first={lazyParams.first}
            rows={lazyParams.rows}
            totalRecords={visibleOrders.length}
            onPage={(e) =>
                setLazyParams({ ...lazyParams, first: e.first, rows: e.rows, page: e.page ?? 0 })
            }
            loading={false}
            emptyMessage="Không tìm thấy đơn hàng nào."
            rowsPerPageOptions={[10, 20, 50]}
            stripedRows
            size="small"
            >
            <Column field="id" header="Mã đơn" style={{ width: '10%' }} className="text-center font-medium" />
            <Column field="customerId" header="Khách hàng" body={customerBodyTemplate} style={{ width: '15%' }} />
            <Column field="paymentMethod" header="Thanh toán" style={{ width: '12%' }} />
            <Column field="status" header="Trạng thái" body={statusBodyTemplate} style={{ width: '10%' }} className="text-center" />
            <Column field="totalPrice" header="Tổng giá" body={priceBodyTemplate} style={{ width: '12%' }} className="text-right" />
            <Column field="shippingDate" header="Ngày giao" body={(row) => dateBodyTemplate(row, 'shippingDate')} style={{ width: '12%' }} />
            <Column field="createdAt" header="Ngày tạo" body={(row) => dateBodyTemplate(row, 'createdAt')} style={{ width: '10%' }} />
            <Column header="Thao tác" body={actionBodyTemplate} style={{ width: '12%' }} className="text-center" />
            </DataTable>
        </div>

        {/* Dialog chi tiết */}
        <OrderDetailDialog
            visible={detailVisible}
            order={selectedOrder}
            onHide={() => setDetailVisible(false)}
            />


        {/* Form thêm/sửa */}
        <OrderForm
            visible={formVisible}
            onHide={() => {
            setFormVisible(false);
            setEditingOrder(null);
            }}
            onSave={handleSaveOrder}
            initialData={editingOrder}
        />
        </div>
    );
    };

    export default OrderManagement;