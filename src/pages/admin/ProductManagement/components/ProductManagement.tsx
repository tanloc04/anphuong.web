import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Image } from 'primereact/image';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';

import ProductForm from './ProductForm';
import VariationManager from './VariationManager'; 
import { useProducts } from '@/pages/admin/ProductManagement/hooks/useProducts';
import { useProductMutations } from '../hooks/useProductMutations';

const ProductManagement = () => {

    const [lazyParams, setLazyParams] = useState({ first: 0, rows: 10, page: 1 });
    const [keyword, setKeyword] = useState("");

    const {
        data: apiResponse,
        isLoading,
        isFetching,
        refetch
    } = useProducts(
        { keyword: keyword, status: "", isDeleted: false },
        { pageNum: (lazyParams.first / lazyParams.rows) + 1, pageSize: lazyParams.rows }
    );

    const products = apiResponse?.data?.pageData || [];
    const totalRecords = apiResponse?.data?.pageInfo?.totalItems || 0;

    const { createMutation, updateMutation, deleteMutation } = useProductMutations();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    const [variationModalVisible, setVariationModalVisible] = useState(false);
    const [selectedProductForVariant, setSelectedProductForVariant] = useState<any>(null);

    const toast = useRef<Toast>(null);

    const getErrorMessage = (error: any) => {
      if (error.response && error.response.data) {
          if (error.response.data.message) return error.response.data.message;
          if (error.response.data.title) return "Dữ liệu không hợp lệ! (Kiểm tra các trường bắt buộc)";
          if (error.response.data.errors) {
              const firstErrorKey = Object.keys(error.response.data.errors)[0];
              return `${firstErrorKey}: ${error.response.data.errors[firstErrorKey]}`;
          }
      }
      return error.message || "Có lỗi xảy ra!";
    };

    const openNew = () => {
        setSelectedProduct(null);
        setModalVisible(true);
    };

    const openEdit = (product: any) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const openVariationManager = (product: any) => {
        setSelectedProductForVariant(product);
        setVariationModalVisible(true);
    };

    const handleDelete = (product: any) => {
        confirmDialog({
            message: `Bạn có chắc muốn xóa "${product.name}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: () => {
                deleteMutation.mutate(product.id, {
                    onSuccess: (res) => {
                        if (res.success) {
                            toast.current?.show({ severity: "success", summary: "Đã xóa", detail: "Xóa sản phẩm thành công!" });
                        } else {
                            toast.current?.show({ severity: "error", summary: "Lỗi", detail: res.message });
                        }
                    }
                })
            }
        });
    };

    const handleFormSubmit = async (formData: any) => {
        if (selectedProduct) {
            updateMutation.mutate({ id: selectedProduct.id, data: formData }, {
                onSuccess: (res) => {
                    if (res.success) {
                        toast.current?.show({ severity: "success", summary: "Thành công", detail: "Cập nhật thành công!" });
                        setModalVisible(false);
                    } else {
                        toast.current?.show({ severity: "error", summary: "Lỗi", detail: res.message });
                    }
                },
                onError: (error) => {
                    const msg = getErrorMessage(error);
                    toast.current?.show({ severity: "error", summary: "Thất bại!", detail: msg, life: 5000 });
                }
            })
        } else {
            createMutation.mutate(formData, {
                onSuccess: (res) => {
                    if (res.success) {
                        toast.current?.show({ severity: "success", summary: "Thành công", detail: "Tạo mới sản phẩm thành công!" });
                        setModalVisible(false);
                    } else {
                        toast.current?.show({ severity: "error", summary: "Lỗi", detail: res.message });
                    }
                },
                onError: (error) => {
                    const msg = getErrorMessage(error);
                    toast.current?.show({ severity: "error", summary: "Không thể tạo!", detail: msg, life: 5000 });
                }
            })
        }
    };

    const imageBodyTemplate = (rowData: any) => {
        return (
            <div className="flex justify-center relative group">
                {rowData.thumbnail ? (
                     <Image 
                        src={rowData.thumbnail} 
                        alt={rowData.name} 
                        width="50" 
                        preview 
                        className="shadow-sm rounded border border-gray-200 overflow-hidden"
                    />
                ) : (
                    <div className="w-[50px] h-[50px] bg-gray-100 rounded flex items-center justify-center text-gray-400">
                        <i className="pi pi-image"></i>
                    </div>
                )}
            </div>
        );
    };

    const priceBodyTemplate = (rowData: any) => {
        return <span className="font-semibold text-gray-700">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rowData.price)}
        </span>;
    };

    const categoryBodyTemplate = (rowData: any) => {
        const cateName = rowData.category?.name;
        return cateName ? 
            <Tag value={cateName} severity="info" className="text-sm px-2" /> : 
            <span className="text-gray-400 italic text-xs">N/A</span>;
    };

    const stockBodyTemplate = (rowData: any) => {
        const stock = rowData.stock ?? 0; 
        return (
            <Tag 
                value={stock > 0 ? stock : 'Hết'} 
                severity={stock > 10 ? 'success' : stock > 0 ? 'warning' : 'danger'} 
                className="w-full max-w-[60px]"
            />
        );
    };

    const sizeBodyTemplate = (value: number) => {
        return value ? <span className="text-gray-600">{value}m</span> : <span className="text-gray-300">-</span>;
    };

    const actionBodyTemplate = (rowData: any) => {
        // const isVariationEnabled = rowData.variationId !== null && rowData.variationId !== 0;
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" rounded text severity="info" tooltip="Sửa" onClick={() => openEdit(rowData)} aria-label="Edit" />
                <Button icon="pi pi-sitemap" rounded text severity="help" tooltip={ "Quản lý màu sắc/biến thể" } onClick={() => openVariationManager(rowData)} aria-label="Variants" disabled={rowData.isDeleted} tooltipOptions={{ position: "top" }}/>
                <Button icon="pi pi-trash" rounded text severity="danger" tooltip="Xóa" onClick={() => handleDelete(rowData)} aria-label="Delete" />
            </div>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <h4 className="m-0 text-xl font-bold text-gray-800">Quản lý Sản Phẩm</h4>
                <div className="flex gap-3">
                    <span className="relative flex items-center">
                        <i className="pi pi-search absolute left-3 text-gray-500 z-10" style={{ top: "50%", transform: "translateY(-50%)" }} />
                        <InputText 
                            type="search" 
                            onKeyDown={(e) => { if (e.key === 'Enter') refetch() }}
                            onBlur={() => refetch()}
                            onChange={(e) => setKeyword(e.target.value)} 
                            placeholder="Tìm kiếm..." 
                            className="p-inputtext-sm !pl-10 w-64"
                        />
                    </span>
                    <Button label="Thêm mới" icon="pi pi-plus" severity="success" onClick={openNew} size="small" raised />
                </div>
            </div>
        );
    };

    return (
        <div className="card bg-white p-4 rounded-lg shadow-sm">
            <Toast ref={toast} />
            <ConfirmDialog />

            <DataTable 
                value={products} 
                lazy 
                paginator 
                header={renderHeader()}
                first={lazyParams.first} 
                rows={lazyParams.rows} 
                totalRecords={totalRecords}
                onPage={(e) => setLazyParams({ first: e.first, rows: e.rows, page: e.page ?? 0 })}
                loading={isLoading || isFetching}
                tableStyle={{ minWidth: '70rem' }}
                emptyMessage="Không tìm thấy sản phẩm nào."
                rowsPerPageOptions={[5, 10, 20]}
                className="p-datatable-sm"
                stripedRows
                size="small"
            >

                <Column field="id" header="ID" style={{ width: '50px' }} className="text-center text-gray-500 font-mono text-xs" />
                
                <Column header="Ảnh" body={imageBodyTemplate} style={{ width: '80px' }} />
                
                <Column field="name" header="Tên sản phẩm" sortable style={{ width: '20%' }} className="font-medium text-gray-800" />
                
                <Column field="categoryName" header="Danh mục" body={categoryBodyTemplate} style={{ width: '10%' }} />
                
                <Column field="price" header="Giá bán" body={priceBodyTemplate} sortable style={{ width: '12%' }} />
                
                <Column field="stock" header="Kho" body={stockBodyTemplate} sortable style={{ width: '80px' }} className="text-center" />

                <Column field="longSize" header="Dài" body={(r) => sizeBodyTemplate(r.longSize)} style={{ width: '70px' }} className="text-center text-sm" />
                <Column field="widthSize" header="Rộng" body={(r) => sizeBodyTemplate(r.widthSize)} style={{ width: '70px' }} className="text-center text-sm" />
                <Column field="heightSize" header="Cao" body={(r) => sizeBodyTemplate(r.heightSize)} style={{ width: '70px' }} className="text-center text-sm" />

                <Column field="material" header="Chất liệu" style={{ width: '10%' }} className="text-gray-600 text-sm" />
                
                <Column header="Thao tác" body={actionBodyTemplate} style={{ width: '140px' }} className="text-center"/>
            </DataTable>

            <Dialog 
                visible={modalVisible} 
                style={{ width: '90vw', maxWidth: '1200px' }}
                breakpoints={{ '960px': '95vw', '641px': '100vw' }}
                header={selectedProduct ? 'Cập nhật sản phẩm' : 'Thêm mới sản phẩm'}
                modal 
                className="p-fluid"
                onHide={() => setModalVisible(false)}
                contentClassName="!pb-0"
                maximizable
            >
                <ProductForm 
                    key={selectedProduct ? selectedProduct.id : 'new'} 
                    initialData={selectedProduct} 
                    onSubmitForm={handleFormSubmit}
                    onClose={() => setModalVisible(false)}
                />
            </Dialog>

            <VariationManager 
                visible={variationModalVisible}
                product={selectedProductForVariant}
                onClose={() => setVariationModalVisible(false)}
            />
        </div>
    );
};

export default ProductManagement;