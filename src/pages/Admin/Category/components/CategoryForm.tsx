import React, { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { CreateButton, DeleteButton } from "@/components/common/buttons";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import { ProgressSpinner } from "primereact/progressspinner";
import { uploadToCloudinary } from "@/services/uploadCloudinaryService";
import type {
  CategoryFormProps,
  CategoryFormInput,
} from "@/@types/category.types";

const CategoryForm = ({
  visible,
  onHide,
  onSave,
  initialData,
  loading,
}: CategoryFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formTitle = initialData ? "Cập nhật danh mục" : "Thêm mới danh mục";

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormInput>({
    defaultValues: { name: "", description: "", imageUrl: "" },
  });

  const currentImageUrl = watch("imageUrl");

  const onSubmitHandler = (data: CategoryFormInput) => {
    onSave(data);
  };

  useEffect(() => {
    if (visible) {
      reset({
        name: initialData?.name || "",
        description: initialData?.description || "",
        imageUrl: initialData?.imageUrl || "",
      });
    }
  }, [visible, initialData, reset]);

  const handleClose = () => {
    reset();
    onHide();
  };

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      if (url) {
        setValue("imageUrl", url);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const renderFooter = () => {
    return (
      <div className="flex justify-end gap-2">
        <DeleteButton
          label="Hủy"
          size="small"
          onClick={handleClose}
          type="button"
        />
        <CreateButton
          label={initialData ? "Cập nhật" : "Tạo mới"}
          onClick={handleSubmit(onSubmitHandler)}
          loading={loading || isUploading}
          disabled={isUploading}
        />
      </div>
    );
  };

  return (
    <Dialog
      header={formTitle}
      visible={visible}
      style={{ width: "35rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      onHide={handleClose}
      footer={renderFooter()}
      className="p-fluid"
      modal
      draggable={false}
    >
      <form className="flex flex-col gap-5 mt-2">
        <div className="field">
          <label className="font-medium text-gray-700 block mb-2">
            Ảnh danh mục
          </label>
          <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            {isUploading ? (
              <div className="flex flex-col items-center py-4">
                <ProgressSpinner
                  style={{ width: "40px", height: "40px" }}
                  strokeWidth="4"
                />
                <span className="text-sm text-gray-500 mt-2">
                  Đang tải ảnh lên Cloudinary...
                </span>
              </div>
            ) : currentImageUrl ? (
              <div className="relative group">
                <img
                  src={currentImageUrl}
                  alt="Preview"
                  className="w-full max-h-48 object-cover rounded-md shadow-md border"
                />
                <button
                  type="button"
                  onClick={() => setValue("imageUrl", "")}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  title="Xóa ảnh"
                >
                  <i className="pi pi-times text-xs px-1"></i>
                </button>
              </div>
            ) : (
              <div
                className="flex flex-col items-center cursor-pointer py-4"
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="pi pi-image text-4xl text-gray-400 mb-2"></i>
                <span className="text-sm text-gray-600 font-medium">
                  Click để chọn ảnh danh mục
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Hỗ trợ: JPG, PNG, WEBP
                </span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileSelect}
              className="hidden"
            />
          </div>
          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => <input type="hidden" {...field} />}
          />
        </div>

        <div className="field">
          <label
            htmlFor="name"
            className="font-medium text-gray-700 block mb-2"
          >
            Tên danh mục <span className="text-red-500">*</span>
          </label>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Vui lòng nhập tên danh mục" }}
            render={({ field, fieldState }) => (
              <InputText
                id={field.name}
                {...field}
                className={classNames({ "p-invalid": fieldState.invalid })}
                placeholder="Ví dụ: Bàn làm việc, Sofa da..."
              />
            )}
          />
          {errors.name && (
            <small className="p-error block mt-1">{errors.name.message}</small>
          )}
        </div>

        <div className="field">
          <label
            htmlFor="description"
            className="font-medium text-gray-700 block mb-2"
          >
            Mô tả
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <InputTextarea
                id={field.name}
                {...field}
                rows={4}
                placeholder="Nhập vài dòng mô tả về danh mục này..."
                autoResize
              />
            )}
          />
        </div>
      </form>
    </Dialog>
  );
};

export default CategoryForm;
