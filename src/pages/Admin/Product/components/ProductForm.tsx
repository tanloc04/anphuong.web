import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { ProductFormData, PreviewUrls, ProductFormProps } from "@/@types/product.types";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import { useCategories } from "../../Category/hooks";
import { useProductDetail } from "../hooks";
import { Controller, useForm } from "react-hook-form";

const materialOptions = [
    { label: 'Gỗ', value: 'Gỗ' },
    { label: 'Thép', value: 'Thép' },
    { label: 'Sắt', value: 'Sắt' },
    { label: 'Kính', value: 'Kính' },
];

const emptyFormData: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  discount: 0,
  material: '',
  longSize: 0,
  widthSize: 0,
  heightSize: 0,
  categoryId: null,
  variationId: null,
  stock: 0,
  thumbnail: null,
  image1: null,
  image2: null,
  image3: null,
  image4: null
};

const emptyPreviewUrls: PreviewUrls = {
  thumbnail: null, image1: null, image2: null, image3: null, image4: null
};

const ProductForm = ({ productId, onSubmitForm, onClose, loading }: ProductFormProps & { loading?: boolean }) => {
  const [formData, setFormData] = useState<ProductFormData>(emptyFormData);
  const [previewUrls, setPreviewUrls] = useState<PreviewUrls>(emptyPreviewUrls);
  
  const isUpdateMode = !!productId;

  const { data: productDetail, isLoading: isLoadingDetail } = useProductDetail(productId || null);

  const { data: categoryData } = useCategories({
    pageInfo: { pageNum: 1, pageSize: 100 },
    searchCondition: { keyword: "", isDeleted: false, status: "" }
  });

  const { control } = useForm();

  useEffect(() => {
    if (!productId) {
      setFormData(emptyFormData);
      setPreviewUrls(emptyPreviewUrls);
      return;
    }

    if (productDetail) {
      setFormData({
        id: productDetail.id,
        name: productDetail.name,
        description: productDetail.description ?? "",
        price: productDetail.price,
        discount: productDetail.discount ?? 0,
        material: productDetail.material,
        longSize: productDetail.longSize,
        widthSize: productDetail.widthSize,
        heightSize: productDetail.heightSize,
        categoryId: productDetail.categoryId,
        variationId: productDetail.variationId,
        stock: productDetail.stock ?? 0,
        thumbnail: productDetail.thumbnail,
        image1: productDetail.image1,
        image2: productDetail.image2,
        image3: productDetail.image3,
        image4: productDetail.image4
      });

      const urls = {
        thumbnail: productDetail.thumbnail || null,
        image1: productDetail.image1 || null,
        image2: productDetail.image2 || null,
        image3: productDetail.image3 || null,
        image4: productDetail.image4 || null
      };

      setPreviewUrls(urls);
    }
  }, [productDetail, productId]);

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(url => {
        if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleValueChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const key = name as keyof PreviewUrls;

    if (files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [key]: file }));
      
      setPreviewUrls((prev) => {
        if (prev[key]?.startsWith('blob:')) URL.revokeObjectURL(prev[key]!);
        return { ...prev, [key]: URL.createObjectURL(file) };
      });
    }
  };

  const handleRemoveImage = (key: keyof PreviewUrls) => {
    if (previewUrls[key]?.startsWith('blob:')) URL.revokeObjectURL(previewUrls[key]!);
    
    setFormData((prev) => ({ ...prev, [key]: null }));
    setPreviewUrls((prev) => ({ ...prev, [key]: null }));
    
    const input = document.getElementById(key) as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitForm(formData);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const fileInputClass = "hidden"; 

  const renderImageUpload = (key: keyof PreviewUrls, label: string) => (
    <div className="relative group h-full">
      <label htmlFor={key} className="cursor-pointer block h-full">
        <div className={`border-2 border-dashed ${previewUrls[key] ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50/50'} rounded-lg p-2 h-full min-h-[120px] flex flex-col items-center justify-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors`}>
            {previewUrls[key] ? (
                <div className="relative w-full h-full flex items-center justify-center group-image">
                    <img src={previewUrls[key]!} alt={label} className="max-w-full max-h-full object-contain rounded-md shadow-sm" />
                    <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); handleRemoveImage(key); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                    >
                        <i className="pi pi-times"></i>
                    </button>
                </div>
            ) : (
                <>
                    <i className="pi pi-image text-gray-400 text-2xl mb-2"></i>
                    <span className="text-xs text-gray-500 text-center font-medium">{label}</span>
                </>
            )}
        </div>
      </label>
      <input type="file" id={key} name={key} accept="image/*" className={fileInputClass} onChange={handleFileChange} />
    </div>
  );

  if (isUpdateMode && isLoadingDetail) {
    return (
        <div className="p-6 space-y-6">
            <div className="flex gap-6">
                <div className="w-[70%] space-y-4">
                    <Skeleton width="100%" height="150px" borderRadius="12px" />
                    <Skeleton width="100%" height="200px" borderRadius="12px" />
                </div>
                <div className="w-[30%] space-y-4">
                    <Skeleton width="100%" height="360px" borderRadius="12px" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <div className="flex flex-col lg:flex-row gap-8 pb-24">
        <div className="lg:w-[70%] space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                    <i className="pi pi-info-circle text-blue-500"></i> Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 gap-5">
                    <div>
                        <label htmlFor="name" className={labelClass}>Tên Sản Phẩm <span className="text-red-500">*</span></label>
                        <InputText 
                            id="name" name="name" value={formData.name} onChange={handleChange} 
                            className="w-full" placeholder="Nhập tên sản phẩm..." required 
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className={labelClass}>Mô Tả</label>
                        <InputTextarea 
                            id="description" name="description" value={formData.description} onChange={handleChange} 
                            rows={4} className="w-full" autoResize placeholder="Mô tả chi tiết sản phẩm..." 
                        />
                    </div>
                    <div>
                        <label htmlFor="material" className={labelClass}>Chất Liệu</label>
                        <Controller 
                            name="material"
                            control={control}
                            rules={{ required: "Vui lòng chọn chất liệu" }}
                            render={({ field, fieldState }) => (
                                <>
                                    <div className="flex flex-wrap gap-3">
                                        {materialOptions.map((option) => (
                                            <div key={option.value} className="flex align-items-center">
                                                <RadioButton 
                                                    inputId={option.value}
                                                    name="material"
                                                    value={option.value}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    checked={field.value === option.value}
                                                />
                                                <label htmlFor={option.label} className="ml-2 cursor-pointer">
                                                    {option.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    {fieldState.error && (
                                        <small className="p-error block mt-2">{fieldState.error.message}</small>
                                    )}
                                </>
                            )}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                    <i className="pi pi-tag text-green-500"></i> Thiết lập kinh doanh
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="price" className={labelClass}>Giá bán <span className="text-red-500">*</span></label>
                        <InputNumber 
                            id="price" name="price" value={formData.price} onValueChange={(e) => handleValueChange('price', e.value)} 
                            mode="currency" currency="VND" locale="vi-VN" className="w-full" required placeholder="0 ₫"
                        />
                    </div>
                    <div>
                        <label htmlFor="discount" className={labelClass}>Giảm giá</label>
                        <InputNumber 
                            id="discount" name="discount" value={formData.discount} onValueChange={(e) => handleValueChange('discount', e.value)} 
                            mode="currency" currency="VND" locale="vi-VN" className="w-full" placeholder="0 ₫"
                        />
                    </div>
                    
                    <div className="md:col-span-2">
                        <label htmlFor="stock" className={labelClass}>Năng lực sản xuất (Tồn kho) <span className="text-red-500">*</span></label>
                        <div className="p-inputgroup flex-1">
                             <span className="p-inputgroup-addon bg-gray-50"><i className="pi pi-box"></i></span>
                             <InputNumber 
                                id="stock" name="stock" value={formData.stock} onValueChange={(e) => handleValueChange('stock', e.value)} 
                                className="w-full" placeholder="Nhập số lượng..." min={0} showButtons
                             />
                        </div>
                        <small className="text-gray-400 mt-1 block">Số lượng tối đa có thể nhận đặt hàng trong chu kỳ này.</small>
                    </div>

                    <div>
                        <label htmlFor="categoryId" className={labelClass}>Danh Mục <span className="text-red-500">*</span></label>
                        <Dropdown 
                          id="categoryId" 
                          value={formData.categoryId} 
                          onChange={(e) => handleValueChange('categoryId', e.value)} 
                          options={categoryData?.pageData || []} 
                          optionLabel="name"              
                          optionValue="id"                  
                          placeholder="-- Chọn danh mục --" 
                          className="w-full" 
                          filter
                          required
                          emptyMessage="Không có danh mục nào"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                    <i className="pi pi-arrows-alt text-orange-500"></i> Kích thước (Mét)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                        <label htmlFor="longSize" className={labelClass}>Dài</label>
                        <InputNumber 
                            id="longSize" name="longSize" value={formData.longSize} onValueChange={(e) => handleValueChange('longSize', e.value)} 
                            minFractionDigits={0} maxFractionDigits={2} className="w-full" suffix=" m" placeholder="0" min={0}
                        />
                    </div>
                    <div>
                        <label htmlFor="widthSize" className={labelClass}>Rộng</label>
                        <InputNumber 
                            id="widthSize" name="widthSize" value={formData.widthSize} onValueChange={(e) => handleValueChange('widthSize', e.value)} 
                            minFractionDigits={0} maxFractionDigits={2} className="w-full" suffix=" m" placeholder="0" min={0}
                        />
                    </div>
                    <div>
                        <label htmlFor="heightSize" className={labelClass}>Cao</label>
                        <InputNumber 
                            id="heightSize" name="heightSize" value={formData.heightSize} onValueChange={(e) => handleValueChange('heightSize', e.value)} 
                            minFractionDigits={0} maxFractionDigits={2} className="w-full" suffix=" m" placeholder="0" min={0}
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="lg:w-[30%]">
            <div className="sticky top-4 space-y-6">
                <div className="bg-white p-5 rounded-xl border shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide border-b pb-2 text-center text-indigo-600">
                        Ảnh đại diện
                    </h3>
                    <div className="h-64">
                        {renderImageUpload('thumbnail', 'Tải ảnh Thumbnail')}
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide border-b pb-2 text-center text-indigo-600">
                        Thư viện ảnh
                    </h3>
                    <div className="grid grid-cols-2 gap-3 h-64">
                        {renderImageUpload('image1', 'Ảnh 1')}
                        {renderImageUpload('image2', 'Ảnh 2')}
                        {renderImageUpload('image3', 'Ảnh 3')}
                        {renderImageUpload('image4', 'Ảnh 4')}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t sticky bottom-0 bg-white/95 backdrop-blur-sm z-50 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] -mx-6 px-6 rounded-b-lg">
        <Button label="Hủy Bỏ" icon="pi pi-times" severity="secondary" type="button" onClick={onClose} outlined disabled={loading} className="w-32" />
        <Button label={isUpdateMode ? 'Lưu Thay Đổi' : 'Tạo Sản Phẩm'} icon="pi pi-check" severity="success" type="submit" loading={loading} className="w-40" />
      </div>
    </form>
  );
}

export default ProductForm;