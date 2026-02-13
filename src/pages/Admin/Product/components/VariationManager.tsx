import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { ColorPicker } from "primereact/colorpicker";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";
import { Image } from "primereact/image";
import { uploadToCloudinary } from "@/services/uploadCloudinaryService";
import { useColors, useVariants, useVariantMutations } from "../hooks";
import type { Color } from "@/@types/color.types";
import type { VariationManagerProps } from "@/@types/variant.types";

const VariationManager = ({
  visible,
  product,
  onClose,
}: VariationManagerProps) => {
  const toast = useRef<Toast>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [showCreateColor, setShowCreateColor] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("000000");

  const { data: colorsData } = useColors();
  const colors = colorsData?.pageData || [];

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
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setSelectedFile(file);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddVariant = async () => {
    if (!selectedColor || !product) return;

    const isExist = productVariants.some(
      (v: any) => v.colorId === selectedColor.id,
    );
    if (isExist) {
      toast.current?.show({
        severity: "warn",
        summary: "Đã tồn tại",
        detail: "Màu này đã được thêm rồi!",
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
            detail: "Upload ảnh cho variant không thành công!",
          });
          setIsUploading(false);
          return;
        }

        const payload = {
          productId: product.id,
          colorId: selectedColor.id,
          variantImage: uploadedImageUrl,
        };

        createVariant(payload, {
          onSuccess: () => {
            setSelectedColor(null);
            clearSelectedFile();
          },

          onError: () => {},
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDeleteVariant = (variant: any) => {
    const colorName = variant.color?.name || "màu này";
    confirmDialog({
      message: `Bạn có chắc muốn xóa "${colorName}" khỏi sản phẩm?`,
      header: "Xác nhận xóa",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      acceptLabel: "Xóa",
      rejectLabel: "Hủy",
      accept: () => deleteVariant(variant.id),
    });
  };

  const handleCreateNewColor = () => {
    if (!newColorName.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Thiếu thông tin",
        detail: "Vui lòng nhập tên màu!",
      });
      return;
    }

    let finalHex = newColorHex.startsWith("#")
      ? newColorHex
      : `#${newColorHex}`;

    createColor(
      { name: newColorName, hexCode: finalHex },
      {
        onSuccess: (data: any) => {
          const createdColor = data?.data?.data || data?.data;
          if (createdColor) {
            setSelectedColor(createdColor);
          }
          setShowCreateColor(false);
          setNewColorName("");
          setNewColorHex("000000");
        },
      },
    );
  };

  const colorOptionTemplate = (option: Color) => {
    if (!option) {
      return <span>Chọn màu</span>;
    }

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
      <div className="border-1 border-gray-200 border-round overflow-hidden w-4rem bg-white">
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
        style={{ width: "650px", maxWidth: "95vw" }}
        onHide={onClose}
        modal
        className="p-fluid"
      >
        <Toast ref={toast} />

        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-5 rounded-r flex align-items-start gap-3">
          <i className="pi pi-info-circle text-blue-500 mt-1"></i>
          <div className="text-sm text-blue-700">
            Thêm các phiên bản màu sắc và ảnh đại diện cho biến thể này.
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 mb-4 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Thêm biến thể mới
          </label>

          <div className="flex flex-wrap gap-3 align-items-end">
            {/*Đây là dropdow dành cho màu*/}
            <div className="flex-1 min-w-[200px]">
              <div className="p-inputgroup flex-1 h-3rem">
                <Dropdown
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.value)}
                  options={colors}
                  optionLabel="name"
                  itemTemplate={colorOptionTemplate}
                  valueTemplate={
                    selectedColor ? colorOptionTemplate : undefined
                  }
                  placeholder="-- Chọn màu từ danh sách --"
                  className="w-full"
                  filter
                  emptyMessage="Không tìm thấy màu nào."
                  showClear
                />
                <Button
                  icon="pi pi-plus"
                  severity="secondary"
                  className="bg-white text-gray-600 border-gray-300"
                  tooltip="Không có màu bạn cần? Tạo mới ngay!"
                  tooltipOptions={{ position: "top" }}
                  onClick={() => setShowCreateColor(true)}
                />
              </div>
            </div>
            {/*Đây là khu vực chọn ảnh*/}
            <div className="flex align-items-center gap-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={onFileSelect}
              />

              {!previewUrl && (
                <Button
                  type="button"
                  icon="pi pi-image"
                  label="Ảnh"
                  className="p-button-outlined p-button-secondary h-3rem"
                  tooltip="Chọn ảnh đại diện cho màu này"
                  onClick={() => fileInputRef.current?.click()}
                />
              )}

              {previewUrl && (
                <div
                  className="relative border-1 border-gray-300 border-round surface-card"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full border-round object-cover"
                  />
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white border-circle w-1.5rem h-1.5rem flex align-items-center justify-content-center border-none cursor-pointer shadow-1"
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
              className="w-auto px-4"
              onClick={handleAddVariant}
              disabled={!selectedColor || isMutatingVariant}
              loading={isMutatingVariant}
            />
          </div>
        </div>

        <div className="border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-4 py-3 border-b flex justify-content-between align-items-center">
            <span className="font-bold text-gray-700 text-sm">
              Danh sách đang bán
            </span>
            <Tag value={`${productVariants.length} màu`} severity="info"></Tag>
          </div>

          <DataTable
            value={productVariants}
            size="small"
            emptyMessage="Chưa có màu nào."
            loading={isLoadingVariants}
            stripedRows
            rowHover
          >
            <Column
              header="#"
              body={(data, options) => options.rowIndex + 1}
              style={{ width: "50px" }}
              className="text-center text-gray-500"
            />

            <Column
              header="Ảnh"
              body={imageBodyTemplate}
              style={{ width: "80px" }}
              className="text-center"
            />

            <Column
              header="Màu Sắc"
              body={(rowData) => {
                const colorData = rowData.color || {};
                const hex = colorData.hexCode || "#ccc";
                const name = colorData.name || "Chưa đặt tên";

                return (
                  <div className="flex align-items-center gap-3">
                    <div
                      className="shadow-sm border-round-md"
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: hex,
                        border: "1px solid #e5e7eb",
                      }}
                    />
                    <div>
                      <div className="font-bold text-gray-800">{name}</div>
                      <div className="text-xs text-gray-500 font-mono uppercase bg-gray-100 px-1 rounded inline-block">
                        {hex}
                      </div>
                    </div>
                  </div>
                );
              }}
            />

            <Column
              header="Thao tác"
              body={(rowData) => (
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  tooltip="Xóa biến thể này"
                  onClick={() => confirmDeleteVariant(rowData)}
                  loading={isMutatingVariant}
                />
              )}
              style={{ width: "100px", textAlign: "center" }}
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
              placeholder="Ví dụ: Xanh Navy..."
              className="w-full"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Mã màu (Hex)
            </label>
            <div className="flex gap-3 align-items-center border p-3 rounded-lg bg-gray-50 hover:bg-white transition-colors border-gray-200">
              <ColorPicker
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.value as string)}
              />
              <span className="font-mono text-lg text-gray-600 font-semibold tracking-wider">
                #{newColorHex}
              </span>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default VariationManager;
