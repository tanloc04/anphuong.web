import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';

const OrderManagement = () => {
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [keyword, setKeyword] = useState('');
    const [filters, setFilters] = useState<any>({});
    const [lazyParams, setLazyParams] = useState({ first: 0, rows: 10, page: 0 });

    const toast = useRef<Toast>(null);

    // Dữ liệu mẫu
    const orders = [
        { id: 1, paymentMethod: 'Credit Card', status: 'Pending', shippingDate: '2026-01-15', totalPrice: 1500000, customerId: 1, customerName: 'Nguyễn Văn A', customerPhone: '0909123456', createdAt: '2026-01-10', isDeleted: false },
        { id: 2, paymentMethod: 'Cash on Delivery', status: 'Shipped', shippingDate: '2026-01-20', totalPrice: 2500000, customerId: 2, customerName: 'Trần Thị B', customerPhone: '0987654321', createdAt: '2026-01-12', isDeleted: false },
        { id: 4, paymentMethod: 'Credit Card', status: 'Completed', shippingDate: '2026-01-22', totalPrice: 3500000, customerId: 1, customerName: 'Nguyễn Văn A', customerPhone: '0909123456', createdAt: '2026-01-14', isDeleted: false },
        { id: 5, paymentMethod: 'Bank Transfer', status: 'Pending', shippingDate: '2026-01-25', totalPrice: 500000, customerId: 2, customerName: 'Trần Thị B', customerPhone: '0987654321', createdAt: '2026-01-15', isDeleted: false },
    ];

    const statusOptions = ['Pending', 'Shipped', 'Completed', 'Canceled'];
    const paymentOptions = ['Credit Card', 'Cash on Delivery', 'Bank Transfer'];

    // Tính toán thống kê
    const totalOrders = orders.filter(o => !o.isDeleted).length;
    const pendingOrders = orders.filter(o => o.status === 'Pending' && !o.isDeleted).length;
    const completedOrders = orders.filter(o => o.status === 'Completed' && !o.isDeleted).length;
    const totalRevenue = orders.filter(o => !o.isDeleted).reduce((sum, o) => sum + o.totalPrice, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN');
    };

    const openDetail = (order: any) => {
        setSelectedOrder(order);
        setDetailVisible(true);
    };

    const handleDeleteOrRestore = (order: any) => {
        const isDelete = !order.isDeleted;
        confirmDialog({
            message: `Bạn có chắc muốn ${isDelete ? 'xóa' : 'khôi phục'} đơn hàng "${order.id}"?`,
            header: `Xác nhận ${isDelete ? 'xóa' : 'khôi phục'}`,
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: isDelete ? 'p-button-danger' : 'p-button-success',
            acceptLabel: isDelete ? 'Xóa' : 'Khôi phục',
            rejectLabel: 'Hủy',
            accept: () => {
                toast.current?.show({ severity: 'success', summary: 'Thành công', detail: `${isDelete ? 'Xóa' : 'Khôi phục'} đơn hàng thành công` });
            }
        });
    };

    const statusBodyTemplate = (rowData: any) => {
        let severity: any = 'info';
        switch (rowData.status) {
            case 'Pending': severity = 'warning'; break;
            case 'Shipped': severity = 'info'; break;
            case 'Completed': severity = 'success'; break;
            case 'Canceled': severity = 'danger'; break;
        }
        return <Tag value={rowData.status} severity={severity} rounded />;
    };

    const priceBodyTemplate = (rowData: any) => {
        return <span className="text-green-600 font-semibold">{formatCurrency(rowData.totalPrice)}</span>;
    };

    const dateBodyTemplate = (rowData: any, field: string) => {
        return (
            <div>
                <div className="text-sm text-gray-800">{formatDate(rowData[field])}</div>
                <div className="text-xs text-gray-500">{field === 'shippingDate' ? 'Dự kiến giao' : 'Ngày tạo'}</div>
            </div>
        );
    };

    const customerBodyTemplate = (rowData: any) => {
        return (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                        {rowData.customerName.charAt(0)}
                    </span>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-800">{rowData.customerName}</p>
                    <p className="text-xs text-gray-500">{rowData.customerPhone}</p>
                </div>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <div className="flex gap-2 justify-center">
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
                />
                <Button 
                    icon={rowData.isDeleted ? "pi pi-refresh" : "pi pi-trash"} 
                    rounded 
                    text 
                    severity={rowData.isDeleted ? "success" : "danger"} 
                    tooltip={rowData.isDeleted ? "Khôi phục" : "Xóa"} 
                    onClick={() => handleDeleteOrRestore(rowData)} 
                />
            </div>
        );
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

                {/* Statistics Cards */}
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

                {/* Filters and Actions */}
                <div className="flex flex-wrap gap-3 items-center">
                    <Button 
                        label="Thêm mới" 
                        icon="pi pi-plus" 
                        severity="success" 
                        raised 
                    />
                    
                    <Button 
                        label="Hiển thị xóa" 
                        icon="pi pi-eye" 
                        outlined 
                    />

                    <div className="flex-1 flex gap-3 justify-end items-center">
    <div className="relative">
        <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
        <InputText
            type="search"
            placeholder="Tìm kiếm..."
            value={keyword}
            onChange={(e) => {
                setKeyword(e.target.value);
                setLazyParams(prev => ({ ...prev, first: 0 }));
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
                    value={orders.filter(order => !order.isDeleted)}
                    lazy 
                    paginator 
                    header={renderHeader()}
                    first={lazyParams.first} 
                    rows={lazyParams.rows} 
                    totalRecords={orders.length}
                    onPage={(e) => setLazyParams({...lazyParams, first: e.first, rows: e.rows, page: e.page ?? 0})}
                    loading={false}
                    emptyMessage="Không tìm thấy đơn hàng nào."
                    rowsPerPageOptions={[10, 20, 50]}
                    stripedRows
                    size="small"
                >
                    <Column 
                        field="id" 
                        header="Mã đơn" 
                        style={{ width: '8%' }} 
                        className="text-center font-medium"
                    />
                    <Column 
                        field="customerId" 
                        header="Khách hàng" 
                        body={customerBodyTemplate} 
                        style={{ width: '20%' }} 
                    />
                    <Column 
                        field="paymentMethod" 
                        header="Thanh toán" 
                        style={{ width: '12%' }} 
                    />
                    <Column 
                        field="status" 
                        header="Trạng thái" 
                        body={statusBodyTemplate} 
                        style={{ width: '10%' }} 
                        className="text-center" 
                    />
                    <Column 
                        field="totalPrice" 
                        header="Tổng giá" 
                        body={priceBodyTemplate} 
                        sortable 
                        style={{ width: '12%' }} 
                        className="text-right" 
                    />
                    <Column 
                        field="shippingDate" 
                        header="Ngày giao" 
                        body={(row) => dateBodyTemplate(row, 'shippingDate')} 
                        sortable 
                        style={{ width: '13%' }} 
                    />
                    <Column 
                        field="createdAt" 
                        header="Ngày tạo" 
                        body={(row) => dateBodyTemplate(row, 'createdAt')} 
                        sortable 
                        style={{ width: '13%' }} 
                    />
                    <Column 
                        header="Thao tác" 
                        body={actionBodyTemplate} 
                        style={{ width: '12%' }} 
                        className="text-center"
                    />
                </DataTable>
            </div>

            <Dialog 
                visible={detailVisible} 
                onHide={() => setDetailVisible(false)} 
                header={`Chi tiết đơn hàng #${selectedOrder?.id}`} 
                modal 
                className="w-full md:w-8/12 lg:w-6/12"
                footer={
                    <Button 
                        label="Đóng" 
                        icon="pi pi-times" 
                        onClick={() => setDetailVisible(false)} 
                        text 
                    />
                }
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <div>
                            <h5 className="font-bold text-lg mb-3 text-gray-800">Thông tin đơn hàng</h5>
                            <div className="space-y-2">
                                <p className="text-sm"><span className="font-semibold">Mã đơn:</span> {selectedOrder.id}</p>
                                <p className="text-sm"><span className="font-semibold">Phương thức thanh toán:</span> {selectedOrder.paymentMethod}</p>
                                <p className="text-sm">
                                    <span className="font-semibold">Trạng thái:</span> 
                                    <Tag value={selectedOrder.status} severity={selectedOrder.status === 'Completed' ? 'success' : 'warning'} className="ml-2" />
                                </p>
                                <p className="text-sm"><span className="font-semibold">Tổng giá:</span> <span className="text-green-600 font-bold">{formatCurrency(selectedOrder.totalPrice)}</span></p>
                                <p className="text-sm"><span className="font-semibold">Ngày giao:</span> {formatDate(selectedOrder.shippingDate)}</p>
                                <p className="text-sm"><span className="font-semibold">Ngày tạo:</span> {formatDate(selectedOrder.createdAt)}</p>
                            </div>
                        </div>
                        
                        <div>
                            <h5 className="font-bold text-lg mb-3 text-gray-800">Thông tin khách hàng</h5>
                            <div className="space-y-2">
                                <p className="text-sm"><span className="font-semibold">Họ tên:</span> {selectedOrder.customerName}</p>
                                <p className="text-sm"><span className="font-semibold">SĐT:</span> {selectedOrder.customerPhone}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default OrderManagement;