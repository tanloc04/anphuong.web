import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { ColorPicker } from "primereact/colorpicker";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";
import { Image } from "primereact/image";
import { uploadToCloudinary } from "@/services/uploadCloudinaryService";

// 👇 Nhớ Import thêm useMaterialMutations
import {
  useColors,
  useMaterials,
  useVariants,
  useVariantMutations,
  useMaterialMutations,
} from "../hooks";
import type { Color } from "@/@types/color.types";
import type { VariationManagerProps } from "@/@types/variant.types";

const VariationManager = ({
  visible,
  product,
  onClose,
}: VariationManagerProps) => {
  const toast = useRef<Toast>(null);

  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [stock, setStock] = useState<number | null>(0);
  const [variantPrice, setVariantPrice] = useState<number | null>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [showCreateColor, setShowCreateColor] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("000000");

  const [showCreateMaterial, setShowCreateMaterial] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState("");

  const { data: colorsData } = useColors();
  const colors = colorsData?.pageData || [];

  // KHÔNG CẦN refetch NỮA, React Query tự lo
  const { data: materialsData } = useMaterials();
  const materials = materialsData?.pageData || [];

  const { data: variantsData, isLoading: isLoadingVariants } = useVariants(
    visible && product ? product.id : null,
    { pageInfo: { pageNum: 1, pageSize: 100 } },
  );
  const productVariants = variantsData?.pageData || [];

  const {
    createColor,
    createVariant,
    deleteVariant,
    isCreatingColor,
    isMutatingVariant,
  } = useVariantMutations(toast);

  // 👇 GỌI HOOK MATERIAL MUTATION Ở ĐÂY
  const { createMaterial, isCreatingMaterial } = useMaterialMutations(toast);

  useEffect(() => {
    if (visible && product) {
      setVariantPrice(product.price);
      setSelectedColor(null);
      setSelectedMaterial(null);
      setStock(0);
      clearSelectedFile();
    }
  }, [visible, product]);

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.current?.show({
          severity: "warn",
          summary: "File không hợp lệ!",
          detail: "Vui lòng chọn file ảnh!",
        });
        return;
      }
      setPreviewUrl(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddVariant = async () => {
    if (
      !selectedColor ||
      !selectedMaterial ||
      stock === null ||
      variantPrice === null ||
      !product
    ) {
      toast.current?.show({
        severity: "warn",
        summary: "Thiếu thông tin",
        detail: "Vui lòng nhập đủ thông tin biến thể!",
      });
      return;
    }

    const isExist = productVariants.some(
      (v: any) =>
        v.colorId === selectedColor.id && v.materialId === selectedMaterial.id,
    );
    if (isExist) {
      toast.current?.show({
        severity: "warn",
        summary: "Đã tồn tại",
        detail: "Biến thể với Màu và Chất liệu này đã có rồi!",
      });
      return;
    }

    setIsUploading(true);
    try {
      let uploadedImageUrl = "";
      if (selectedFile) {
        const url = await uploadToCloudinary(selectedFile);
        if (url) {
          uploadedImageUrl = url;
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Lỗi upload",
            detail: "Upload ảnh không thành công!",
          });
          setIsUploading(false);
          return;
        }
      }

      const payload = {
        productId: product.id,
        colorId: selectedColor.id,
        materialId: selectedMaterial.id || selectedMaterial.Id,
        price: variantPrice,
        stock: stock,
        variantImage: uploadedImageUrl,
      };

      createVariant(payload, {
        onSuccess: () => {
          setSelectedColor(null);
          setSelectedMaterial(null);
          setStock(0);
          setVariantPrice(product.price);
          clearSelectedFile();
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDeleteVariant = (variant: any) => {
    const colorName = variant.color?.name || "biến thể";
    confirmDialog({
      message: `Bạn có chắc muốn xóa "${colorName}" khỏi sản phẩm?`,
      header: "Xác nhận xóa",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => deleteVariant(variant.id),
    });
  };

  const handleCreateNewColor = () => {
    if (!newColorName.trim()) return;
    let finalHex = newColorHex.startsWith("#")
      ? newColorHex
      : `#${newColorHex}`;
    createColor(
      { name: newColorName, hexCode: finalHex },
      {
        onSuccess: (data: any) => {
          const createdColor = data?.data?.data || data?.data;
          if (createdColor) setSelectedColor(createdColor);
          setShowCreateColor(false);
          setNewColorName("");
          setNewColorHex("000000");
        },
      },
    );
  };

  // 👇 HÀM TẠO CHẤT LIỆU MỚI BÂY GIỜ GỌN GÀNG HƠN NHIỀU
  const handleCreateNewMaterial = () => {
    if (!newMaterialName.trim()) return;

    createMaterial(
      { name: newMaterialName, description: "" },
      {
        onSuccess: (res: any) => {
          const createdMaterial = res.data?.data || res.data;
          if (createdMaterial) setSelectedMaterial(createdMaterial);
          setShowCreateMaterial(false);
          setNewMaterialName("");
        },
      },
    );
  };

  const colorOptionTemplate = (option: Color) => {
    if (!option) return <span>Chọn màu</span>;
    return (
      <div className="flex align-items-center gap-2">
        <div
          className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
          style={{ backgroundColor: option.hexCode }}
        ></div>
        <span>{option.name}</span>
      </div>
    );
  };

  const imageBodyTemplate = (rowData: any) => {
    return rowData.variantImage ? (
      <div className="border-1 border-gray-200 border-round overflow-hidden w-4rem h-4rem bg-white mx-auto flex align-items-center justify-content-center">
        <Image
          src={rowData.variantImage}
          alt="Variant"
          width="100%"
          height="100%"
          preview
          className="w-full h-full object-cover"
          imageClassName="w-full h-full object-cover"
        />
      </div>
    ) : (
      <span className="text-gray-400 italic text-sm">Không có ảnh</span>
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex align-items-center justify-content-center w-full">
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={() => confirmDeleteVariant(rowData)}
          loading={isMutatingVariant}
        />
      </div>
    );
  };

  const headerContent = (
    <div className="flex align-items-center gap-2">
      <div className="p-2 bg-purple-50 rounded-full">
        <i className="pi pi-palette text-purple-600 text-xl"></i>
      </div>
      <div>
        <div className="font-bold text-gray-800">Quản lý Biến thể</div>
        <div className="text-xs text-gray-500 font-normal">
          Sản phẩm:{" "}
          <span className="text-purple-600 font-semibold">{product?.name}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Dialog
        header={headerContent}
        visible={visible}
        style={{ width: "1000px", maxWidth: "95vw" }}
        onHide={onClose}
        modal
        className="p-fluid"
      >
        <Toast ref={toast} />

        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded-r flex align-items-start gap-3">
          <i className="pi pi-info-circle text-blue-500 mt-1"></i>
          <div className="text-sm text-blue-700">
            Thêm các phiên bản biến thể. Giá bán mặc định được lấy từ sản phẩm
            gốc, bạn có thể thay đổi tùy ý.
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 mb-4 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Thông tin biến thể mới
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Màu sắc <span className="text-red-500">*</span>
              </label>
              <div className="p-inputgroup h-3rem">
                <Dropdown
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.value)}
                  options={colors}
                  optionLabel="name"
                  itemTemplate={colorOptionTemplate}
                  valueTemplate={
                    selectedColor ? colorOptionTemplate : undefined
                  }
                  placeholder="-- Chọn Màu --"
                  filter
                  showClear
                />
                <Button
                  icon="pi pi-plus"
                  severity="secondary"
                  className="bg-white text-gray-600 border-gray-300"
                  tooltip="Tạo màu mới"
                  onClick={() => setShowCreateColor(true)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Chất liệu <span className="text-red-500">*</span>
              </label>
              <div className="p-inputgroup h-3rem">
                <Dropdown
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.value)}
                  options={materials}
                  optionLabel="name"
                  placeholder="-- Chọn Chất Liệu --"
                  filter
                  showClear
                />
                <Button
                  icon="pi pi-plus"
                  severity="secondary"
                  className="bg-white text-gray-600 border-gray-300"
                  tooltip="Tạo chất liệu mới"
                  onClick={() => setShowCreateMaterial(true)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Giá bán riêng (VNĐ) <span className="text-red-500">*</span>
              </label>
              <div className="p-inputgroup h-3rem">
                <span className="p-inputgroup-addon bg-white font-bold text-green-600">
                  ₫
                </span>
                <InputNumber
                  value={variantPrice}
                  onValueChange={(e) => setVariantPrice(e.value ?? null)}
                  placeholder="Nhập giá..."
                  min={0}
                />
              </div>
              <small className="text-gray-400 mt-1 block italic">
                Mặc định: {product?.price?.toLocaleString("vi-VN")} ₫
              </small>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Tồn kho <span className="text-red-500">*</span>
              </label>
              <div className="p-inputgroup h-3rem">
                <span className="p-inputgroup-addon bg-white">
                  <i className="pi pi-box"></i>
                </span>
                <InputNumber
                  value={stock}
                  onValueChange={(e) => setStock(e.value ?? null)}
                  placeholder="Nhập số lượng..."
                  min={0}
                />
              </div>
            </div>
          </div>

          <div className="flex align-items-center gap-4 border-t border-gray-200 pt-4 mt-2">
            <div className="flex align-items-center gap-3 w-10rem">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={onFileSelect}
              />
              {!previewUrl ? (
                <Button
                  type="button"
                  icon="pi pi-image"
                  label="Thêm Ảnh"
                  className="p-button-outlined p-button-secondary h-3rem w-full white-space-nowrap"
                  onClick={() => fileInputRef.current?.click()}
                />
              ) : (
                <div
                  className="relative border-1 border-gray-300 border-round"
                  style={{ width: "3.5rem", height: "3.5rem" }}
                >
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full border-round object-cover"
                  />
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white border-circle w-1.5rem h-1.5rem flex align-items-center justify-content-center border-none shadow-1"
                    onClick={clearSelectedFile}
                    type="button"
                  >
                    <i className="pi pi-times text-xs"></i>
                  </button>
                </div>
              )}
            </div>

            <Button
              label="Thêm Biến Thể"
              icon="pi pi-check"
              className="flex-1 h-3rem font-bold"
              onClick={handleAddVariant}
              disabled={
                !selectedColor ||
                !selectedMaterial ||
                stock === null ||
                variantPrice === null ||
                isMutatingVariant
              }
              loading={isUploading || isMutatingVariant}
            />
          </div>
        </div>

        <div className="border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-4 py-3 border-b flex justify-content-between align-items-center">
            <span className="font-bold text-gray-700 text-sm">
              Danh sách đang bán
            </span>
            <Tag value={`${productVariants.length} loại`} severity="info"></Tag>
          </div>

          <DataTable
            value={productVariants}
            size="small"
            emptyMessage="Chưa có biến thể nào."
            loading={isLoadingVariants}
            stripedRows
            rowHover
            scrollable
            scrollHeight="300px"
          >
            <Column
              header="#"
              body={(data, options) => options.rowIndex + 1}
              style={{ minWidth: "50px" }}
              headerStyle={{ textAlign: "center" }}
              bodyStyle={{ textAlign: "center" }}
              className="text-gray-500"
            />
            <Column
              header="Ảnh"
              body={imageBodyTemplate}
              style={{ minWidth: "80px" }}
              headerStyle={{ textAlign: "center" }}
              bodyStyle={{ textAlign: "center" }}
            />

            <Column
              header="Màu Sắc"
              body={(rowData) => (
                <div className="flex align-items-center gap-2">
                  <div
                    className="shadow-sm border-round"
                    style={{
                      width: "24px",
                      height: "24px",
                      backgroundColor: rowData.color?.hexCode || "#ccc",
                    }}
                  />
                  <span className="font-bold text-gray-800">
                    {rowData.color?.name}
                  </span>
                </div>
              )}
              style={{ minWidth: "150px" }}
            />

            <Column
              header="Chất liệu"
              body={(rowData) => (
                <span className="text-gray-700">
                  {rowData.material?.name || "---"}
                </span>
              )}
              style={{ minWidth: "140px" }}
            />

            <Column
              header="Giá bán"
              body={(rowData) => (
                <span className="font-semibold text-green-600">
                  {rowData.price?.toLocaleString("vi-VN")} ₫
                </span>
              )}
              style={{ minWidth: "130px", textAlign: "right" }}
            />

            <Column
              header="Tồn kho"
              body={(rowData) => {
                const qty = rowData.inventory?.quantityInStock ?? 0;
                return (
                  <Tag
                    value={qty}
                    severity={qty > 0 ? "success" : "danger"}
                    rounded
                  />
                );
              }}
              style={{ minWidth: "100px" }}
              headerStyle={{ textAlign: "center" }}
              bodyStyle={{ textAlign: "center" }}
            />

            <Column
              header="Thao tác"
              body={actionBodyTemplate}
              style={{ minWidth: "80px" }}
              headerStyle={{ textAlign: "center" }}
              bodyStyle={{ textAlign: "center" }}
            />
          </DataTable>
        </div>
      </Dialog>

      <Dialog
        header="Tạo Màu Sắc Mới"
        visible={showCreateColor}
        style={{ width: "400px" }}
        onHide={() => setShowCreateColor(false)}
        footer={
          <div className="flex justify-content-end gap-2 pt-2">
            <Button
              label="Hủy"
              icon="pi pi-times"
              text
              onClick={() => setShowCreateColor(false)}
              className="text-gray-600"
            />
            <Button
              label="Lưu Màu"
              icon="pi pi-check"
              loading={isCreatingColor}
              onClick={handleCreateNewColor}
            />
          </div>
        }
      >
        <div className="flex flex-column gap-4 mt-2">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tên màu <span className="text-red-500">*</span>
            </label>
            <InputText
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              autoFocus
              className="w-full"
              placeholder="Ví dụ: Xanh Navy..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Mã màu (Hex)
            </label>
            <div className="flex gap-3 align-items-center border p-3 rounded-lg">
              <ColorPicker
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.value as string)}
              />
              <span className="font-mono text-lg font-semibold">
                #{newColorHex}
              </span>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        header="Tạo Chất Liệu Mới"
        visible={showCreateMaterial}
        style={{ width: "400px" }}
        onHide={() => setShowCreateMaterial(false)}
        footer={
          <div className="flex justify-content-end gap-2 pt-2">
            <Button
              label="Hủy"
              icon="pi pi-times"
              text
              onClick={() => setShowCreateMaterial(false)}
              className="text-gray-600"
            />
            <Button
              label="Lưu Chất Liệu"
              icon="pi pi-check"
              loading={isCreatingMaterial}
              onClick={handleCreateNewMaterial}
            />
          </div>
        }
      >
        <div className="flex flex-column gap-4 mt-2">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tên chất liệu <span className="text-red-500">*</span>
            </label>
            <InputText
              value={newMaterialName}
              onChange={(e) => setNewMaterialName(e.target.value)}
              autoFocus
              className="w-full"
              placeholder="Ví dụ: Gỗ Sồi, Vải Nỉ..."
              onKeyDown={(e) => e.key === "Enter" && handleCreateNewMaterial()}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default VariationManager;
