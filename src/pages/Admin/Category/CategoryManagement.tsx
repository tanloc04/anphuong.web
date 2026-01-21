import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { EditButton, DeleteButton } from '@/components/common/buttons';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useCategories, useCategoryMutations } from './hooks'; 
import CateForm from './components/CategoryForm';
import type { ICategory } from '@/types/category.types';
import ManagementLayout from '@/components/common/layout/ManagementLayout';

const CategoryManagement = () => {
    const toast = useRef<Toast>(null);
    const [keyword, setKeyword] = useState<string>('');
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCate, setSelectedCate] = useState<ICategory | null>(null);

    const { data: queryData, isLoading, refetch } = useCategories({
        searchCondition: { keyword, isDeleted: false, status: "" },
        pageInfo: { 
            pageNum: (lazyParams.first / lazyParams.rows) + 1, 
            pageSize: lazyParams.rows 
        }
    });

    const { create, update, remove, isPending } = useCategoryMutations(toast);

    const categories = queryData?.pageData || [];
    const totalRecords = queryData?.pageInfo?.totalItems || 0;
    const onPage = (event: any) => {
        setLazyParams(event);
    };

    const openNew = () => {
        setSelectedCate(null);
        setModalVisible(true);
    };

    const openEdit = (category: ICategory) => {
        setSelectedCate(category);
        setModalVisible(true);
    };

    const handleSave = (formData: any) => {
        const options = {
            onSuccess: () => {
                setModalVisible(false);
                refetch(); 
            }
        };

        if (selectedCate) {
            update({ id: selectedCate.id, data: formData }, options);
        } else {
            create(formData, options);
        }
    };

    const handleDelete = (category: ICategory) => {
        confirmDialog({
            message: `Bạn có chắc muốn xóa danh mục "${category.name}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Có, xóa nó',
            rejectLabel: 'Không',
            acceptClassName: 'p-button-danger',
            accept: () => remove(category.id)
        });
    };

    const actionBodyTemplate = (rowData: ICategory) => {
        return (
            <div className="flex gap-2 justify-center">
                <EditButton icon="pi pi-pencil" onClick={() => openEdit(rowData)}/>
                <DeleteButton onClick={() => handleDelete(rowData)}/>
            </div>
        );
    };

    const indexBodyTemplate = (_: any, options: any) => options.rowIndex + 1;

    return (
        <ManagementLayout
            title="Quản lý Danh mục"
            searchTerm={keyword}
            onSearchChange={(val: any) => {
                setKeyword(val);
                setLazyParams(prev => ({ ...prev, first: 0 }));
            }}
            onCreate={openNew}
            createButtonLabel="Thêm mới"
        >
            <Toast ref={toast} />
            <ConfirmDialog />

            <DataTable 
                value={categories} 
                lazy
                paginator 
                first={lazyParams.first} 
                rows={lazyParams.rows} 
                totalRecords={totalRecords} 
                onPage={onPage}
                loading={isLoading}
                rowHover 
                showGridlines={false}
                tableStyle={{ minWidth: '50rem' }}
                emptyMessage="Không tìm thấy danh mục nào."
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Hiển thị {first} đến {last} trong tổng số {totalRecords} danh mục"
                rowsPerPageOptions={[5, 10, 25]}
                className="p-datatable-sm"
                stripedRows
            >
                <Column header="STT" body={indexBodyTemplate} alignHeader={'center'} align="center" style={{ width: '5%' }} />
                <Column field="name" header="Tên danh mục" sortable style={{ width: '30%' }} />
                <Column field="description" header="Mô tả" style={{ width: '50%' }} />
                <Column body={actionBodyTemplate} header="Thao tác" alignHeader={'center'} align="center" style={{ width: '15%', minWidth: '8rem' }} />
            </DataTable>

            <CateForm 
                visible={modalVisible} 
                onHide={() => setModalVisible(false)} 
                onSave={handleSave}
                initialData={selectedCate}
                loading={isPending}
            />
        </ManagementLayout>
    );
};

export default CategoryManagement;