import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { EditButton, DeleteButton } from "@/components/common/buttons";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Image } from "primereact/image";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useProducts, useProductMutations } from "./hooks";
import { useCategories } from "../Category/hooks";
import ProductForm from "./components/ProductForm";
import VariationManager from "./components/VariationManager";
import ManagementLayout from "@/components/common/layout/ManagementLayout";

const ProductManagement = () => {
  const [lazyParams, setLazyParams] = useState({ first: 0, rows: 10, page: 0 });
  const [keyword, setKeyword] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<Date[] | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [variationModalVisible, setVariationModalVisible] = useState(false);
  const [selectedProductForVariant, setSelectedProductForVariant] =
    useState<any>(null);

  const toast = useRef<Toast>(null);

  const { data: categoryData } = useCategories({
    pageInfo: { pageNum: 1, pageSize: 100 },
    searchCondition: { keyword: "", isDeleted: false, status: "" },
  });
  const categories = categoryData?.pageData || [];

  const {
    data: apiResponse,
    isLoading,
    isFetching,
    refetch,
  } = useProducts({
    searchCondition: {
      keyword: keyword,
      status: "",
      isDeleted: false,
      categoryId: selectedCategory,
      startDate: dateRange && dateRange[0] ? dateRange[0].toISOString() : null,
      endDate: dateRange && dateRange[1] ? dateRange[1].toISOString() : null,
    },
    pageInfo: {
      pageNum: lazyParams.page + 1,
      pageSize: lazyParams.rows,
    },
  });

  const products = apiResponse?.pageData || [];
  const totalRecords = apiResponse?.pageInfo?.totalItems || 0;

  const {
    create,
    update,
    remove,
    isPending: isMutating,
  } = useProductMutations(toast);

  const openNew = () => {
    setSelectedProductId(null);
    setModalVisible(true);
  };

  const openEdit = (product: any) => {
    setSelectedProductId(product.id);
    setModalVisible(true);
  };

  const openVariationManager = (product: any) => {
    setSelectedProductForVariant(product);
    setVariationModalVisible(true);
  };

  const handleDelete = (product: any) => {
    confirmDialog({
      message: `Bạn có chắc muốn xóa "${product.name}"?`,
      header: "Xác nhận xóa",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Xóa",
      rejectLabel: "Hủy",
      accept: () => remove(product.id),
    });
  };

  const handleFormSubmit = (formData: any) => {
    const options = {
      onSuccess: () => {
        setModalVisible(false);
        refetch();
      },
    };
    if (selectedProductId) {
      update({ id: selectedProductId, data: formData }, options);
    } else {
      create(formData, options);
    }
  };

  // ================= TẠO GIAO DIỆN THANH FILTER =================
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between bg-gray-50/50 p-3 rounded-lg border border-gray-200 mb-2">
        {/* Đổi flex-wrap thành flex-row để ép nằm ngang */}
        <div className="flex flex-row items-center gap-4 overflow-x-auto">
          <span className="font-semibold text-gray-600 whitespace-nowrap">
            <i className="pi pi-filter mr-2"></i>Bộ lọc:
          </span>

          {/* Lọc Danh mục - Chốt cứng w-[250px] */}
          <div className="p-inputgroup h-10 w-[250px]">
            <span className="p-inputgroup-addon bg-white">
              <i className="pi pi-th-large text-gray-400"></i>
            </span>
            <Dropdown
              value={selectedCategory}
              options={categories}
              onChange={(e) => {
                setSelectedCategory(e.value);
                setLazyParams((prev) => ({ ...prev, first: 0, page: 0 }));
              }}
              optionLabel="name"
              optionValue="id"
              placeholder="Tất cả danh mục"
              showClear
              filter
              className="flex align-items-center"
            />
          </div>

          {/* Lọc Ngày tháng */}
          <div className="p-inputgroup h-10 w-[500px]">
            <span className="p-inputgroup-addon bg-white">
              <i className="pi pi-calendar text-gray-400"></i>
            </span>
            <Calendar
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.value as Date[]);
                setLazyParams((prev) => ({ ...prev, first: 0, page: 0 }));
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

          {/* Nút Xóa Lọc */}
          {(selectedCategory || dateRange) && (
            <Button
              icon="pi pi-filter-slash"
              label="Bỏ lọc"
              severity="secondary"
              text
              className="h-10 text-gray-500 hover:text-gray-800 whitespace-nowrap"
              onClick={() => {
                setSelectedCategory(null);
                setDateRange(null);
                setLazyParams((prev) => ({ ...prev, first: 0, page: 0 }));
              }}
            />
          )}
        </div>
      </div>
    );
  };
  // ==============================================================

  const imageBodyTemplate = (rowData: any) => {
    return (
      <div className="flex justify-center relative group">
        {rowData.image1 ? (
          <Image
            src={rowData.image1}
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
    return (
      <span className="font-semibold text-gray-700">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(rowData.price)}
      </span>
    );
  };

  const categoryBodyTemplate = (rowData: any) => {
    const cateName = rowData.categoryName || rowData.category?.name;
    return cateName ? (
      <Tag value={cateName} severity="info" className="text-sm px-2" />
    ) : (
      <span className="text-gray-400 italic text-xs">N/A</span>
    );
  };

  const stockBodyTemplate = (rowData: any) => {
    const stock = rowData.totalStock ?? rowData.stock ?? 0;
    return (
      <Tag
        value={stock > 0 ? stock : "Hết"}
        severity={stock > 10 ? "success" : stock > 0 ? "warning" : "danger"}
        className="w-full max-w-[60px]"
      />
    );
  };

  const sizeBodyTemplate = (value: number) => {
    return value ? (
      <span className="text-gray-600">{value}m</span>
    ) : (
      <span className="text-gray-300">-</span>
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2 justify-center">
        <EditButton
          tooltip="Sửa"
          onClick={() => openEdit(rowData)}
          aria-label="Edit"
          rounded
        />
        <EditButton
          icon="pi pi-sitemap"
          rounded
          severity={rowData.isMissingVariants ? "warning" : "help"} // Đổi màu cảnh báo nếu chưa có biến thể
          tooltip="Quản lý biến thể"
          onClick={() => openVariationManager(rowData)}
          aria-label="Variants"
          disabled={rowData.isDeleted}
        />
        <DeleteButton
          icon="pi pi-trash"
          rounded
          severity="danger"
          tooltip="Xóa"
          onClick={() => handleDelete(rowData)}
          aria-label="Delete"
        />
      </div>
    );
  };

  return (
    <ManagementLayout
      title="Quản lý Sản Phẩm"
      searchTerm={keyword}
      onSearchChange={(val: any) => {
        setKeyword(val);
        setLazyParams((prev) => ({ ...prev, first: 0, page: 0 }));
      }}
      onCreate={openNew}
      createButtonLabel="Thêm sản phẩm"
    >
      <Toast ref={toast} />
      <ConfirmDialog />
      <DataTable
        value={products}
        lazy
        paginator
        first={lazyParams.first}
        rows={lazyParams.rows}
        totalRecords={totalRecords}
        onPage={(e) =>
          setLazyParams({ first: e.first, rows: e.rows, page: e.page ?? 0 })
        }
        loading={isLoading || isFetching}
        tableStyle={{ minWidth: "70rem" }}
        emptyMessage="Không tìm thấy sản phẩm nào."
        rowsPerPageOptions={[5, 10, 20]}
        className="p-datatable-sm"
        stripedRows
        size="small"
        header={renderHeader()}
      >
        <Column
          field="id"
          header="STT"
          style={{ width: "50px" }}
          className="text-center text-gray-500 font-mono text-xs"
        />
        <Column
          header="Ảnh"
          body={imageBodyTemplate}
          style={{ width: "80px" }}
        />
        <Column
          field="name"
          header="Tên sản phẩm"
          sortable
          style={{ width: "20%" }}
          className="font-medium text-gray-800"
        />
        <Column
          field="categoryName"
          header="Danh mục"
          body={categoryBodyTemplate}
          style={{ width: "10%" }}
        />
        <Column
          field="price"
          header="Giá bán"
          body={priceBodyTemplate}
          sortable
          style={{ width: "12%" }}
        />
        <Column
          field="totalStock"
          header="Kho"
          body={stockBodyTemplate}
          sortable
          style={{ width: "80px" }}
          className="text-center"
        />
        <Column
          field="longSize"
          header="Dài"
          body={(r) => sizeBodyTemplate(r.longSize)}
          style={{ width: "70px" }}
          className="text-center text-sm"
        />
        <Column
          field="widthSize"
          header="Rộng"
          body={(r) => sizeBodyTemplate(r.widthSize)}
          style={{ width: "70px" }}
          className="text-center text-sm"
        />
        <Column
          field="heightSize"
          header="Cao"
          body={(r) => sizeBodyTemplate(r.heightSize)}
          style={{ width: "70px" }}
          className="text-center text-sm"
        />
        <Column
          header="Thao tác"
          body={actionBodyTemplate}
          alignHeader={"center"}
          align="center"
          style={{ width: "15%", minWidth: "8rem" }}
        />
      </DataTable>

      <Dialog
        visible={modalVisible}
        style={{ width: "90vw", maxWidth: "1200px" }}
        breakpoints={{ "960px": "95vw", "641px": "100vw" }}
        header={selectedProductId ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm"}
        modal
        className="p-fluid"
        onHide={() => setModalVisible(false)}
        contentClassName="!pb-0"
        maximizable
      >
        <ProductForm
          key={selectedProductId || "new"}
          productId={selectedProductId}
          onSubmitForm={handleFormSubmit}
          onClose={() => setModalVisible(false)}
          loading={isMutating}
        />
      </Dialog>

      <VariationManager
        visible={variationModalVisible}
        product={selectedProductForVariant}
        onClose={() => setVariationModalVisible(false)}
      />
    </ManagementLayout>
  );
};

export default ProductManagement;
