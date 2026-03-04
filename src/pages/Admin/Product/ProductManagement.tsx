import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { EditButton, DeleteButton } from "@/components/common/buttons";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Image } from "primereact/image";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { useProducts, useProductMutations } from "./hooks";
import ProductForm from "./components/ProductForm";
import VariationManager from "./components/VariationManager";
import ManagementLayout from "@/components/common/layout/ManagementLayout";

const ProductManagement = () => {
  const [lazyParams, setLazyParams] = useState({ first: 0, rows: 10, page: 0 });
  const [keyword, setKeyword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [variationModalVisible, setVariationModalVisible] = useState(false);
  const [selectedProductForVariant, setSelectedProductForVariant] =
    useState<any>(null);

  const toast = useRef<Toast>(null);

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
    const stock = rowData.stock ?? 0;
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
          severity="help"
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
          field="stock"
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
          field="material"
          header="Chất liệu"
          style={{ width: "10%" }}
          className="text-gray-600 text-sm"
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
