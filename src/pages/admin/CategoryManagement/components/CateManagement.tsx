import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { searchCate, createCate, updateCate, deleteCate } from '../request';
import CateForm from './CateForm';
import type { ICategory } from '../types';

const CateManagement = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [keyword, setKeyword] = useState<string>('');
    
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCate, setSelectedCate] = useState<ICategory | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const toast = useRef<Toast>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [keyword]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const pageIndex = (lazyParams.first / lazyParams.rows) + 1;
            
            const result = await searchCate({ 
                pageIndex: pageIndex, 
                pageSize: lazyParams.rows,
                searchCondition: keyword 
            });

            if (result.success && result.data) {
                setCategories(result.data.pageData);
                setTotalRecords(result.data.pageInfo.totalItems);
            } else {
                toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu', life: 3000 });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [lazyParams]);

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

    const handleSave = async (formData: { name: string; description: string }) => {
        setFormLoading(true);
        let result;

        if (selectedCate) {
            result = await updateCate(selectedCate.id, formData);
        } else {
            result = await createCate(formData);
        }

        if (result.success) {
            toast.current?.show({ 
                severity: 'success', 
                summary: 'Thành công', 
                detail: selectedCate ? 'Cập nhật thành công' : 'Thêm mới thành công', 
                life: 3000 
            });
            setModalVisible(false);
            fetchData();
        } else {
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: result.message, life: 3000 });
        }
        setFormLoading(false);
    };

    const confirmDelete = (category: ICategory) => {
        confirmDialog({
            message: `Bạn có chắc muốn xóa danh mục "${category.name}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Có, xóa nó',
            rejectLabel: 'Không',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                const res = await deleteCate(category.id);
                if (res.success) {
                    toast.current?.show({ severity: 'success', summary: 'Đã xóa', detail: 'Xóa danh mục thành công', life: 3000 });
                    fetchData();
                } else {
                    toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: res.message, life: 3000 });
                }
            }
        });
    };

    const actionBodyTemplate = (rowData: ICategory) => {
        return (
            <div className="flex gap-2 justify-center">
                <Button 
                    icon="pi pi-pencil" 
                    rounded 
                    text 
                    severity="info" 
                    aria-label="Edit"
                    onClick={() => openEdit(rowData)} 
                />
                <Button 
                    icon="pi pi-trash" 
                    rounded 
                    text 
                    severity="danger" 
                    aria-label="Delete"
                    onClick={() => confirmDelete(rowData)} 
                />
            </div>
        );
    };

    const indexBodyTemplate = (rowData: any, options: any) => {
        return options.rowIndex + 1;
    }

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
                        onChange={(e) => setKeyword(e.target.value)} 
                        className="p-inputtext-sm !pl-10 w-64"
                        style={{ paddingLeft: '2.5rem' }}
                    />
                </div>

                <Button label="Thêm mới" icon="pi pi-plus" severity="success" onClick={openNew} size="small" raised />
            </div>
 
            <DataTable 
                value={categories} 
                lazy
                paginator 
                first={lazyParams.first} 
                rows={lazyParams.rows} 
                totalRecords={totalRecords} 
                onPage={onPage}
                loading={loading}
                rowHover 
                showGridlines={false}
                tableStyle={{ minWidth: '50rem' }}
                emptyMessage="Không tìm thấy danh mục nào."
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Hiển thị {first} đến {last} trong tổng số {totalRecords} danh mục"
                rowsPerPageOptions={[5, 10, 25]}
            >
                <Column 
                    field="#" 
                    header="STT" 
                    body={indexBodyTemplate} 
                    alignHeader={'center'}
                    align="center"         
                    style={{ width: '5%' }} 
                />
                
                <Column field="name" header="Tên danh mục" sortable style={{ width: '30%' }} />
                <Column field="description" header="Mô tả" style={{ width: '50%' }} />

                <Column 
                    body={actionBodyTemplate} 
                    header="Thao tác" 
                    alignHeader={'center'}
                    align="center"         
                    style={{ width: '15%', minWidth: '8rem' }}
                />
                
            </DataTable>

            <CateForm 
                visible={modalVisible} 
                onHide={() => setModalVisible(false)} 
                onSave={handleSave}
                initialData={selectedCate}
                loading={formLoading}
            />
        </div>
    );
};

export default CateManagement;