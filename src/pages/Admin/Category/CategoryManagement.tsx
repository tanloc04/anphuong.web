import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CreateButton, EditButton, DeleteButton } from '@/components/common/buttons';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useRef } from 'react';
import { useCategories, useCategoryMutations } from './hooks'; 
import CateForm from './components/CategoryForm';
import type { ICategory } from '@/types/category.types';

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

    const { data: queryData, isLoading } = useCategories({
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
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-gray-800 m-0 mr-2">
                    Quản lý Danh mục
                </h2>

                <div className="relative">
                    <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
                    <InputText
                        type='search'
                        placeholder="Tìm kiếm..." 
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setLazyParams(prev => ({ ...prev, first: 0 }));
                        }} 
                        className="p-inputtext-sm !pl-10 w-64"
                        style={{ paddingLeft: '2.5rem' }}
                    />
                </div>

                <CreateButton 
                    label='Thêm mới'
                    severity='success'
                    onClick={openNew}
                    size='small'
                    raised
                />
            </div>

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
        </div>
    );
};

export default CategoryManagement;