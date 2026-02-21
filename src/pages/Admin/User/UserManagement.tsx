import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { EditButton } from "@/components/common/buttons";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import ManagementLayout from "@/components/common/layout/ManagementLayout";
import UserForm from "./components/UserForm";
import { useCustomers, useCustomerMutations } from "./hooks";

const UserManagement = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [keyword, setKeyword] = useState("");
  const [lazyParams, setLazyParams] = useState({ first: 0, rows: 10, page: 0 });
  const toast = useRef<Toast>(null);
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    refetch,
  } = useCustomers({
    searchCondition: {
      keyword: keyword,
      status: "",
      isDeleted: false,
    },
    pageInfo: {
      pageNum: lazyParams.page + 1,
      pageSize: lazyParams.rows,
    },
  });

  console.log("Check Data:", apiResponse);

  const users = apiResponse?.data?.data?.pageData || [];
  const totalRecords = apiResponse?.data?.data?.pageInfo?.totalItems || 0;

  const { update, toggleStatus, isPending } = useCustomerMutations(toast);

  const openNew = () => {
    setSelectedUser(null);
    setModalVisible(true);
  };
  const openEdit = (user: any) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleSave = (formData: any) => {
    const options = {
      onSuccess: () => {
        setModalVisible(false);
        refetch();
      },
    };
    if (selectedUser) update({ id: selectedUser.id, data: formData }, options);
  };

  const onPage = (event: any) => {
    setLazyParams({ first: event.first, rows: event.rows, page: event.page });
  };

  const userBodyTemplate = (rowData: any) => (
    <div className="flex align-items-center gap-2">
      <Avatar
        label={rowData.username?.charAt(0).toUpperCase()}
        shape="circle"
        className="bg-blue-100 text-blue-700"
      />
      <div className="flex flex-col">
        <span className="font-bold text-gray-800">{rowData.username}</span>
        <span className="text-sm text-gray-500">{rowData.email}</span>
      </div>
    </div>
  );

  const roleBodyTemplate = () => (
    <Tag value="Customer" severity="info" rounded />
  );

  const statusBodyTemplate = (rowData: any) => {
    const isActive = rowData.status === "ACTIVE";
    return (
      <Tag
        value={isActive ? "Hoạt động" : "Đã khóa"}
        severity={isActive ? "success" : "danger"}
        className="cursor-pointer hover:opacity-80"
        onClick={() => {
          confirmDialog({
            message: `Xác nhận ${isActive ? "khóa" : "mở khóa"} ${rowData.username}?`,
            header: "Xác nhận",
            accept: () => toggleStatus(rowData),
          });
        }}
      />
    );
  };

  const actionBodyTemplate = (rowData: any) => (
    <div className="flex gap-2 justify-center">
      <EditButton icon="pi pi-user-edit" onClick={() => openEdit(rowData)} />
    </div>
  );

  return (
    <ManagementLayout
      title="Quản lý Người dùng"
      searchTerm={keyword}
      onSearchChange={(val: any) => {
        setKeyword(val);
        setLazyParams((prev) => ({ ...prev, first: 0, page: 0 }));
      }}
      onCreate={openNew}
      createButtonLabel="Thêm người dùng"
    >
      <Toast ref={toast} />
      <ConfirmDialog />

      <DataTable
        value={users}
        lazy
        paginator
        first={lazyParams.first}
        rows={lazyParams.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={isLoading || isFetching}
        tableStyle={{ minWidth: "60rem" }}
        emptyMessage="Không tìm thấy người dùng nào."
        className="p-datatable-sm"
        stripedRows
        size="small"
      >
        <Column
          field="id"
          header="ID"
          style={{ width: "50px" }}
          className="text-center text-xs text-gray-500"
        />
        <Column
          header="Tài khoản"
          body={userBodyTemplate}
          style={{ width: "25%" }}
        />
        <Column field="fullname" header="Họ và tên" style={{ width: "20%" }} />
        <Column field="phone" header="SĐT" style={{ width: "15%" }} />
        <Column
          header="Vai trò"
          body={roleBodyTemplate}
          style={{ width: "10%" }}
          className="text-center"
        />
        <Column
          field="status"
          header="Trạng thái"
          body={statusBodyTemplate}
          style={{ width: "15%" }}
          className="text-center"
        />
        <Column
          header="Thao tác"
          body={actionBodyTemplate}
          style={{ width: "100px" }}
          className="text-center"
          alignHeader="center"
          align="center"
        />
      </DataTable>

      <UserForm
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        onSave={handleSave}
        initialData={selectedUser}
        loading={isPending}
      />
    </ManagementLayout>
  );
};

export default UserManagement;
