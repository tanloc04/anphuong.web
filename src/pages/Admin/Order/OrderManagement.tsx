import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import ManagementLayout from "@/components/common/layout/ManagementLayout";
import { useOrders, useOrderMutations } from "./hooks";
import OrderDetailDialog from "./components/OrderDetailDialog";
import OrderForm from "./components/OrderForm";
import { formatCurrency, formatDate } from "@/utils/format";
import { getStatusLabel, getStatusSeverity } from "@/utils/orderHelper";
import { Toast } from "primereact/toast";

const OrderManagement = () => {
  const [keyword, setKeyword] = useState("");
  const [lazyParams, setLazyParams] = useState({ first: 0, rows: 10, page: 0 });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const toast = useRef<Toast>(null);

  const { createOrder, isPending: isCreating } = useOrderMutations(toast);

  const handleCreateOrder = (data: any) => {
    createOrder(data, {
      onSuccess: () => {
        toast.current?.show({
          severity: "success",
          summary: "Thành công",
          detail: "Đã tạo đơn hàng mới thành công!",
        });
        setCreateVisible(false);
        refetch();
      },
      onError: (error: any) => {
        toast.current?.show({
          severity: "error",
          summary: "Tạo đơn thất bại",
          detail:
            error.response?.data?.message ||
            "Có lỗi xảy ra. Sản phẩm có thể đã hết hàng!",
        });
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
      status: null,
      fromDate: null,
      toDate: null,
      isTotalPrice: false,
      isDeleted: false,
    },
    pageInfo: {
      pageNum: lazyParams.page + 1,
      pageSize: lazyParams.rows,
    },
  });

  // Thêm 1 dòng console.log để sếp tự "bắt quả tang" nó đang cấu trúc thế nào
  console.log("Dữ liệu gốc từ API:", queryData);

  // Bao trọn gói: Chọc 2 lớp data (Axios + C#), nếu không có thì chọc 1 lớp, không có nữa thì chọc trực tiếp
  const orders = queryData?.pageData || [];
  const totalRecords = queryData?.pageInfo?.totalItems || 0;

  const onPage = (event: any) => {
    setLazyParams({ first: event.first, rows: event.rows, page: event.page });
  };

  const onSearch = (val: string) => {
    setKeyword(val);
    setLazyParams((prev) => ({ ...prev, first: 0, page: 0 }));
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
        loading={isLoading || isFetching}
        tableStyle={{ minWidth: "60rem" }}
        emptyMessage="Chưa có đơn hàng nào."
        className="p-datatable-sm"
        stripedRows
        size="small"
        rowHover
      >
        <Column
          field="id"
          header="Mã đơn"
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
          body={(row) => formatDate(row.createdAt)}
          style={{ width: "15%" }}
        />

        <Column
          header="Tổng tiền"
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
          header="Trạng thái"
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
