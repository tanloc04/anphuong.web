import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import ManagementLayout from "@/components/common/layout/ManagementLayout";
import { useOrders, useOrderMutations } from "./hooks";
import OrderDetailDialog from "./components/OrderDetailDialog";
import OrderForm from "./components/OrderForm";
import { formatCurrency, formatDate } from "@/utils/format";
import { getStatusLabel, getStatusSeverity } from "@/utils/orderHelper";
import { Toast } from "primereact/toast";
import { useTableState } from "@/hooks/useTableState";

const OrderManagement = () => {
  const [keyword, setKeyword] = useState("");
  // 👇 Lấy nguyên bộ bí kíp từ Hook dùng chung
  const { lazyParams, onPage, onSort, resetPage } = useTableState(10);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const toast = useRef<Toast>(null);

  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<Date[] | null>(null);

  const orderStatuses = [
    { label: "Chờ xác nhận (Mới)", value: 1 },
    { label: "Đang giao hàng", value: 2 },
    { label: "Đã hoàn thành", value: 3 },
    { label: "Đã huỷ", value: 4 },
  ];

  const { createOrder, isPending: isCreating } = useOrderMutations(toast);

  const handleCreateOrder = (
    data: any,
    onSuccessCb: () => void,
    onErrorCb: (err: any) => void,
  ) => {
    createOrder(data, {
      onSuccess: () => {
        onSuccessCb();
        setCreateVisible(false);
        refetch();
      },
      onError: (error: any) => {
        onErrorCb(error);
      },
    });
  };

  const {
    data: queryData,
    isLoading,
    isFetching,
    refetch,
  } = useOrders({
    searchCondition: {
      keyword: keyword || null,
      status: selectedStatus !== null ? selectedStatus.toString() : null,
      fromDate: dateRange && dateRange[0] ? dateRange[0].toISOString() : null,
      toDate: dateRange && dateRange[1] ? dateRange[1].toISOString() : null,
      isTotalPrice: false,
      isDeleted: false,
    },
    pageInfo: {
      pageNum: lazyParams.page + 1,
      pageSize: lazyParams.rows,
      sortBy: lazyParams.sortField ?? undefined,
      sortDesc: lazyParams.sortOrder === -1,
    },
  });

  const orders = queryData?.pageData || [];
  const totalRecords = queryData?.pageInfo?.totalItems || 0;

  const onSearch = (val: string) => {
    setKeyword(val);
    resetPage(); // Dùng hook cho gọn
  };

  const openDetail = (order: any) => {
    setSelectedOrder(order);
    setDialogVisible(true);
  };

  const statusBodyTemplate = (rowData: any) => {
    return (
      <Tag
        value={getStatusLabel(rowData.status)}
        severity={getStatusSeverity(rowData.status)}
        rounded
      />
    );
  };

  const amountBodyTemplate = (rowData: any) => {
    return (
      <span className="font-bold text-gray-700">
        {formatCurrency(rowData.totalPrice)}
      </span>
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2 justify-center">
        <Button
          icon="pi pi-eye"
          rounded
          text
          severity="info"
          tooltip="Xem chi tiết"
          onClick={() => openDetail(rowData)}
        />
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between bg-gray-50/50 p-3 rounded-lg border border-gray-200 mb-2">
        <div className="flex flex-row items-center gap-4 overflow-x-auto">
          <span className="font-semibold text-gray-600 whitespace-nowrap">
            <i className="pi pi-filter mr-2"></i>Bộ lọc:
          </span>

          {/* 1. Lọc Trạng Thái */}
          <div className="p-inputgroup h-10 w-[250px]">
            <span className="p-inputgroup-addon bg-white">
              <i className="pi pi-info-circle text-gray-400"></i>
            </span>
            <Dropdown
              value={selectedStatus}
              options={orderStatuses}
              onChange={(e) => {
                setSelectedStatus(e.value);
                resetPage(); // Dùng hook
              }}
              placeholder="Tất cả trạng thái"
              showClear
              className="w-full flex items-center"
            />
          </div>

          {/* 2. Lọc Ngày tháng */}
          <div className="p-inputgroup h-10 w-[350px]">
            <span className="p-inputgroup-addon bg-white">
              <i className="pi pi-calendar text-gray-400"></i>
            </span>
            <Calendar
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.value as Date[]);
                resetPage(); // Dùng hook
              }}
              selectionMode="range"
              readOnlyInput
              hideOnRangeSelection
              placeholder="Từ ngày - Đến ngày"
              dateFormat="dd/mm/yy"
              showButtonBar
              className="w-full"
            />
          </div>

          {/* 3. Nút Xóa Lọc */}
          {(selectedStatus !== null || dateRange) && (
            <Button
              icon="pi pi-filter-slash"
              label="Bỏ lọc"
              severity="secondary"
              text
              className="h-10 text-gray-500 hover:text-gray-800 whitespace-nowrap"
              onClick={() => {
                setSelectedStatus(null);
                setDateRange(null);
                resetPage(); // Dùng hook
              }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <ManagementLayout
      title="Quản lý Đơn hàng"
      searchTerm={keyword}
      onSearchChange={onSearch}
      createButtonLabel="Tạo đơn hàng"
      onCreate={() => setCreateVisible(true)}
    >
      <Toast ref={toast} />

      <OrderForm
        visible={createVisible}
        onHide={() => setCreateVisible(false)}
        onSave={handleCreateOrder}
        loading={isCreating}
      />

      <DataTable
        value={orders}
        lazy
        paginator
        first={lazyParams.first}
        rows={lazyParams.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        // 👇 Gắn sự kiện Sort vào DataTable
        onSort={onSort}
        sortField={lazyParams.sortField ?? undefined}
        sortOrder={lazyParams.sortOrder ?? undefined}
        loading={isLoading || isFetching}
        tableStyle={{ minWidth: "60rem" }}
        emptyMessage="Chưa có đơn hàng nào."
        className="p-datatable-sm"
        stripedRows
        size="small"
        rowHover
        header={renderHeader()}
      >
        <Column
          field="id"
          header="Mã đơn"
          sortable // Bật tính năng Sort
          style={{ width: "80px" }}
          className="text-center font-bold text-gray-500"
        />

        <Column
          header="Khách hàng"
          body={(row) => (
            <div className="flex flex-col">
              <span className="font-bold">
                {row.customer?.fullname || "Khách vãng lai"}
              </span>
              <span className="text-xs text-gray-500">
                {row.customer?.phone}
              </span>
            </div>
          )}
          style={{ width: "20%" }}
        />

        <Column
          field="createdAt"
          header="Ngày đặt"
          sortable // Bật tính năng Sort
          body={(row) => formatDate(row.createdAt)}
          style={{ width: "15%" }}
        />

        <Column
          field="totalPrice"
          header="Tổng tiền"
          sortable // Bật tính năng Sort
          body={amountBodyTemplate}
          style={{ width: "15%" }}
          align="right"
        />

        <Column
          header="TT Thanh toán"
          body={(row) => (
            <span className="text-sm">
              {row.paymentMethod === 0 ? "Tiền mặt (COD)" : "Chuyển khoản"}
            </span>
          )}
          style={{ width: "15%" }}
          align="center"
        />

        <Column
          field="status"
          header="Trạng thái"
          sortable // Bật tính năng Sort
          body={statusBodyTemplate}
          style={{ width: "15%" }}
          align="center"
        />

        <Column
          header="Thao tác"
          body={actionBodyTemplate}
          style={{ width: "100px" }}
          align="center"
          alignHeader="center"
        />
      </DataTable>

      <OrderDetailDialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        order={selectedOrder}
      />
    </ManagementLayout>
  );
};

export default OrderManagement;
