import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { formatCurrency, formatDate } from '@/utils/format';
import { getStatusSeverity, getStatusLabel } from '@/utils/orderHelper';
import type { OrderDetailProps } from '@/@types/order.types';

const OrderDetailDialog = ({ visible, onHide, order }: OrderDetailProps) => {
    if (!order) return null;

    const productTemplate = (rowData: any) => (
        <div className="flex align-items-center gap-3">
            <Image src={rowData.thumbnail} alt={rowData.productName} width="50" preview className="rounded-md overflow-hidden shadow-sm" />
            <div className='flex flex-col'>
                <span className="font-medium text-sm">{rowData.productName}</span>
                {rowData.isCustomize && <Tag value="Hàng đặt riêng" className="text-[10px] w-fit mt-1" severity="warning" />}
            </div>
        </div>
    );

    const priceTemplate = (rowData: any) => formatCurrency(rowData.subTotalPrice);

    const renderFooter = () => (
        <div className="flex justify-end gap-2 pt-4">
            <Button label="Đóng" icon="pi pi-times" text onClick={onHide} className="!text-gray-500" />
            <Button label="In hóa đơn" icon="pi pi-print" severity="secondary" outlined />
        </div>
    );

    return (
        <Dialog 
            header={`Chi tiết đơn hàng #${order.id}`} 
            visible={visible} 
            style={{ width: '95%', maxWidth: '900px' }} 
            modal 
            onHide={onHide}
            footer={renderFooter()}
            className="p-fluid"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col gap-4 bg-gray-50 p-4 rounded-lg h-fit">
                    <div>
                        <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">Thông tin khách hàng</h4>
                        <p className="text-sm mb-2"><i className="pi pi-user mr-2 text-purple-600"></i><span className="font-medium">{order.customer?.fullName}</span></p>
                        <p className="text-sm mb-2"><i className="pi pi-phone mr-2 text-purple-600"></i>{order.customer?.phone}</p>
                        <p className="text-sm mb-2"><i className="pi pi-envelope mr-2 text-purple-600"></i>{order.customer?.email}</p>
                        <p className="text-sm"><i className="pi pi-map-marker mr-2 text-purple-600"></i>{order.customer?.customerAddress || order.customer?.address}</p>
                    </div>
                    
                    <Divider className="my-2"/>

                    <div>
                        <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">Thông tin đơn hàng</h4>
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-gray-500">Trạng thái hiện tại:</span>
                            <Tag 
                                value={getStatusLabel(order.status)} 
                                severity={getStatusSeverity(order.status)} 
                                className="text-base py-2 w-fit"
                            />
                            <p className="text-xs text-gray-500 mt-2 italic">Ngày đặt: {formatDate(order.createdAt)}</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <h4 className="font-bold text-gray-800 mb-3">Danh sách sản phẩm ({order.orderDetail?.length || 0})</h4>
                    <DataTable value={order.orderDetail} scrollable scrollHeight="400px" size="small" stripedRows showGridlines>
                        <Column header="Sản phẩm" body={productTemplate} style={{ minWidth: '200px' }}></Column>
                        <Column field="quantity" header="SL" align="center" style={{ width: '60px' }}></Column>
                        <Column header="Đơn giá" body={(row) => formatCurrency(row.subTotalPrice / row.quantity)} align="right" style={{ width: '100px' }}></Column>
                        <Column header="Thành tiền" body={priceTemplate} align="right" style={{ width: '120px' }} className="font-bold text-purple-700"></Column>
                    </DataTable>
                    
                    <div className="flex justify-end mt-4 text-right">
                        <div className="bg-purple-50 p-4 rounded-lg min-w-[250px]">
                            <div className="flex justify-between mb-2 text-sm">
                                <span>Tạm tính:</span>
                                <span>{formatCurrency(order.totalPrice)}</span>
                            </div>
                            <div className="flex justify-between mb-2 text-sm">
                                <span>Phí vận chuyển:</span>
                                <span>0 ₫</span>
                            </div>
                            <Divider className="my-2"/>
                            <div className="flex justify-between font-bold text-lg text-purple-800">
                                <span>Tổng cộng:</span>
                                <span>{formatCurrency(order.totalPrice)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default OrderDetailDialog;