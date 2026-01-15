import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import UserForm from './components/UserForm';
// import { useUsers, useUserMutations } from './hooks'; 

const UserManagement = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [keyword, setKeyword] = useState('');
    const [lazyParams, setLazyParams] = useState({ first: 0, rows: 10, page: 0 });

    const toast = useRef<Toast>(null);
    // const { data: apiResponse, isLoading, refetch } = useUsers({ ...params });
    // const { create, update, remove, isPending } = useUserMutations(toast);
    
    const users = [
        { id: 1, username: 'admin_vip', email: 'admin@gmail.com', fullname: 'Nguyễn Văn Admin', role: 'Admin', phone: '0909123456', status: 'Active' },
        { id: 2, username: 'khachhang_a', email: 'khachA@gmail.com', fullname: 'Trần Thị Khách', role: 'Customer', phone: '0987654321', status: 'Active' },
        { id: 3, username: 'khachhang_b', email: 'khachB@gmail.com', fullname: 'Lê Văn Bê', role: 'Customer', phone: '0912345678', status: 'Blocked' },
    ];
    const totalRecords = 3;
    const isLoading = false;
    const isPending = false;

    const openNew = () => {
        setSelectedUser(null);
        setModalVisible(true);
    };

    const openEdit = (user: any) => {
        setSelectedUser(user);
        setModalVisible(true);
    };

    const handleSave = (formData: any) => {
        console.log("Saving user data:", formData);
        setModalVisible(false);
        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Đã lưu thông tin người dùng' });
        // refetch();
    };

    const handleDelete = (user: any) => {
        confirmDialog({
            message: `Bạn có chắc muốn xóa người dùng "${user.username}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: () => {
                console.log("Deleted:", user.id);
                toast.current?.show({ severity: 'success', summary: 'Đã xóa', detail: 'Xóa người dùng thành công' });
                // refetch(); 
            }
        });
    };

    const userBodyTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center gap-2">
                <Avatar label={rowData.username.charAt(0).toUpperCase()} shape="circle" size="normal" className="bg-blue-100 text-blue-700" />
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{rowData.username}</span>
                    <span className="text-sm text-gray-500">{rowData.email}</span>
                </div>
            </div>
        );
    };

    const roleBodyTemplate = (rowData: any) => {
        return (
            <Tag 
                value={rowData.role} 
                severity={rowData.role === 'Admin' ? 'danger' : 'info'} 
                rounded 
            />
        );
    };

    const statusBodyTemplate = (rowData: any) => {
        return (
            <Tag 
                value={rowData.status || 'Active'} 
                severity={rowData.status === 'Blocked' ? 'warning' : 'success'} 
            />
        );
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <div className="flex gap-2 justify-center">
                <Button 
                    icon="pi pi-user-edit" 
                    rounded 
                    text 
                    severity="info" 
                    tooltip="Sửa thông tin" 
                    onClick={() => openEdit(rowData)} 
                />
                <Button 
                    icon="pi pi-trash" 
                    rounded 
                    text 
                    severity="danger" 
                    tooltip="Xóa người dùng" 
                    onClick={() => handleDelete(rowData)} 
                />
            </div>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <h4 className="m-0 text-xl font-bold text-gray-800">Quản lý Người dùng</h4>
                <div className="flex gap-3">
                    <span className="relative flex items-center">
                        <i className="pi pi-search absolute left-3 text-gray-500 z-10" />
                        <InputText 
                            type="search" 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)} 
                            placeholder="Tìm theo tên, email..." 
                            className="p-inputtext-sm !pl-10 w-64"
                        />
                    </span>
                    <Button label="Thêm mới" icon="pi pi-user-plus" severity="success" onClick={openNew} size="small" raised />
                </div>
            </div>
        );
    };

    return (
        <div className="card bg-white p-4 rounded-lg shadow-sm">
            <Toast ref={toast} />
            <ConfirmDialog />
            
            <DataTable 
                value={users} 
                lazy 
                paginator 
                header={renderHeader()}
                first={lazyParams.first} 
                rows={lazyParams.rows} 
                totalRecords={totalRecords}
                onPage={(e) => setLazyParams({ first: e.first, rows: e.rows, page: e.page ?? 0 })}
                loading={isLoading}
                tableStyle={{ minWidth: '60rem' }}
                emptyMessage="Không tìm thấy người dùng nào."
                rowsPerPageOptions={[5, 10, 20]}
                className="p-datatable-sm"
                stripedRows
                size="small"
            >
                <Column field="id" header="ID" style={{ width: '50px' }} className="text-center text-gray-500 text-xs" />
                <Column header="Tài khoản" body={userBodyTemplate} style={{ width: '25%' }} />
                <Column field="fullname" header="Họ và tên" style={{ width: '20%' }} />
                <Column field="phone" header="SĐT" style={{ width: '15%' }} />
                <Column field="role" header="Vai trò" body={roleBodyTemplate} style={{ width: '10%' }} className="text-center" />
                <Column field="status" header="Trạng thái" body={statusBodyTemplate} style={{ width: '10%' }} className="text-center" />
                <Column header="Thao tác" body={actionBodyTemplate} style={{ width: '120px' }} className="text-center"/>
            </DataTable>

            <UserForm 
                visible={modalVisible} 
                onHide={() => setModalVisible(false)} 
                onSave={handleSave}
                initialData={selectedUser}
                loading={isPending}
            />
        </div>
    );
};

export default UserManagement;