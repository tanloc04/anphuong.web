import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { 
  ProductProps, 
  ProductFormData, 
  PreviewUrls 
} from "../type";

import { Button } from "primereact/button";
import ImagePreview from "./ImagePreview";
import ImagePlaceholder from "./ImagePlaceholder";

const fetchImageUrls = async (detailImageId: number): Promise<PreviewUrls> => {
  console.log("Đang gọi API để lấy ảnh cho ID:", detailImageId);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    thumbnail: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
  };
};

interface ProductFormProps {
  initialData: ProductProps | null;
  onSubmitForm: (formData: FormData) => void;
  onClose: () => void;
}

const emptyFormData: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  discount: 0,
  material: '',
  longSize: 0,
  widthSize: 0,
  heightSize: 0,
  categoryId: 0,
  variationId: 0,
  thumbnail: null,
  image1: null,
  image2: null,
  image3: null,
  image4: null
};

const emptyPreviewUrls: PreviewUrls = {
  thumbnail: "",
  image1: "",
  image2: "",
  image3: "",
  image4: ""
};

const ProductForm = ({ initialData, onSubmitForm, onClose }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>(emptyFormData);
  const [previewUrls, setPreviewUrls] = useState<PreviewUrls>(emptyPreviewUrls);
  
  const [originalPreviewUrls, setOriginalPreviewUrls] = useState<PreviewUrls>(emptyPreviewUrls);
  
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  const isUpdateMode = !!initialData;

  useEffect(() => {
    const loadDataForUpdate = async (data: ProductProps) => {
      setFormData({
        name: data.name,
        description: data.description ?? '',
        price: data.price,
        discount: data.discount ?? 0,
        material: data.material,
        longSize: data.longSize,
        widthSize: data.widthSize,
        heightSize: data.heightSize,
        categoryId: data.categoryId,
        variationId: data.variationId,
        thumbnail: null,
        image1: null,
        image2: null,
        image3: null,
        image4: null,
      });

      if (data.detailImageId) {
        setIsLoadingImages(true);
        try {
          const urls = await fetchImageUrls(data.detailImageId); 
          setPreviewUrls(urls);
          setOriginalPreviewUrls(urls);
        } catch (error) {
          console.error("Lỗi khi tải ảnh sản phẩm:", error);
          setPreviewUrls(emptyPreviewUrls);
          setOriginalPreviewUrls(emptyPreviewUrls);
        } finally {
          setIsLoadingImages(false);
        }
      } else {
        setPreviewUrls(emptyPreviewUrls);
        setOriginalPreviewUrls(emptyPreviewUrls);
      }
    };

    if (initialData) {
      loadDataForUpdate(initialData);
    } else {
      setFormData(emptyFormData);
      setPreviewUrls(emptyPreviewUrls);
      setOriginalPreviewUrls(emptyPreviewUrls);
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;

    if (e.target instanceof HTMLInputElement && e.target.type === 'number') {
      processedValue = parseFloat(value) || 0;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const key = name as keyof PreviewUrls;

    if (previewUrls[key] && previewUrls[key].startsWith('blob:')) {
      URL.revokeObjectURL(previewUrls[key]);
    }

    if (files && files.length > 0) {
      const file = files[0];
      const newPreviewUrl = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,
        [key]: file
      }));

      setPreviewUrls((prev) => ({
        ...prev,
        [key]: newPreviewUrl
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]: null
      }));
      setPreviewUrls((prev) => ({
        ...prev,
        [key]: originalPreviewUrls[key]
      }));
    }
  };

  const handleRemoveImage = (key: keyof PreviewUrls) => {
    if (previewUrls[key] && previewUrls[key].startsWith('blob:')) {
      URL.revokeObjectURL(previewUrls[key]);
    }

    setFormData((prev) => ({ ...prev, [key]: null }));
    setPreviewUrls((prev) => ({ ...prev, [key]: originalPreviewUrls[key] }));

    const input = document.getElementById(key) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSubmit = new FormData();

    if (isUpdateMode) {
      dataToSubmit.append('id', initialData.id.toString());
    }
    (Object.keys(formData) as Array<keyof ProductFormData>).forEach((key) => {
      const value = formData[key];

      if (value instanceof File) {
        dataToSubmit.append(key, value);
      } else if (key !== 'thumbnail' && !key.startsWith('image')) {
        if (value !== null) {
          dataToSubmit.append(key, String(value));
        }
      }
    });
    onSubmitForm(dataToSubmit);
  };

  const commonInputClass = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm';
  const commonLabelClass = 'block text-sm font-medium text-gray-700';
  const commonFileClass = 'block w-full text-sm text-gray-500 file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100';

  return (
    <>
      {/* <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isUpdateMode ? 'CẬP NHẬT SẢN PHẨM' : 'TẠO MỚI SẢN PHẨM'}
      </h1> */}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="name" className={commonLabelClass}>
                  Tên Sản Phẩm
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={commonInputClass}
                  required />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className={commonLabelClass}>Mô Tả</label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className={commonInputClass} />
              </div>

              <div>
                <label htmlFor="price" className={commonLabelClass}>Giá</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={commonInputClass}
                  min="0"
                  step="0.01"
                  required />
              </div>

              <div>
                <label htmlFor="discount" className={commonLabelClass}>Giảm Giá</label>
                <input
                  type="number"
                  name="discount"
                  id="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className={commonInputClass}
                  min="0"
                  step="0.01" />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="material" className={commonLabelClass}>Chất Liệu</label>
                <input
                  type="text"
                  name="material"
                  id="material"
                  value={formData.material}
                  onChange={handleChange}
                  className={commonInputClass} />
              </div>

              <div className="md:col-span-2">
                <label className={commonLabelClass}>Kích Thước</label>
                <div className="grid grid-cols-3 gap-4 mt-1">
                  <div>
                    <label htmlFor="longSize" className="text-xs text-gray-500">Dài (m)</label>
                    <input
                      type="number"
                      name="longSize"
                      id="longSize"
                      value={formData.longSize}
                      onChange={handleChange}
                      className={commonInputClass}
                      placeholder="Dài"
                    />
                  </div>

                  <div>
                    <label htmlFor="widthSize" className="text-xs text-gray-500">Rộng (m)</label>
                    <input
                      type="number"
                      name="widthSize"
                      id="widthSize"
                      value={formData.widthSize}
                      onChange={handleChange}
                      className={commonInputClass}
                      placeholder="Rộng"
                    />
                  </div>

                  <div>
                    <label htmlFor="heightSize" className="text-xs text-gray-500">Cao (m)</label>
                    <input
                      type="number"
                      name="heightSize"
                      id="heightSize"
                      value={formData.heightSize}
                      onChange={handleChange}
                      className={commonInputClass}
                      placeholder="Cao"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="categoryId" className={commonLabelClass}>Danh Mục</label>
                <input
                  type="number"
                  name="categoryId"
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={commonInputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="variationId" className={commonLabelClass}>Loại</label>
                <input
                  type="number"
                  name="variationId"
                  id="variationId"
                  value={formData.variationId}
                  onChange={handleChange}
                  className={commonInputClass}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className={commonLabelClass}>Hình Ảnh Sản Phẩm</label>
              <div>
                <label htmlFor="thumbnail" className="text-xs text-gray-500">Thumbnail</label>
                <input
                  type="file"
                  name="thumbnail"
                  id="thumbnail"
                  onChange={handleFileChange}
                  className={commonFileClass}
                  accept="image/*"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="image1" className="text-xs text-gray-500">Ảnh 1</label>
                  <input
                    type="file"
                    name="image1"
                    id="image1"
                    onChange={handleFileChange}
                    className={commonFileClass}
                    accept="image/*"
                  />
                </div>

                <div>
                  <label htmlFor="image2" className="text-xs text-gray-500">Ảnh 2</label>
                  <input
                    type="file"
                    name="image2"
                    id="image2"
                    onChange={handleFileChange}
                    className={commonFileClass}
                    accept="image/*"
                  />
                </div>

                <div>
                  <label htmlFor="image3" className="text-xs text-gray-500">Ảnh 3</label>
                  <input
                    type="file"
                    name="image3"
                    id="image3"
                    onChange={handleFileChange}
                    className={commonFileClass}
                    accept="image/*"
                  />
                </div>

                <div>
                  <label htmlFor="image4" className="text-xs text-gray-500">Ảnh 4</label>
                  <input
                    type="file"
                    name="image4"
                    id="image4"
                    onChange={handleFileChange}
                    className={commonFileClass}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 space-y-6">
            <div>
              <label className={commonLabelClass}>Xem trước Thumbnail</label>
              <div className="w-full h-48 mt-1">
                {isLoadingImages ? (
                  <ImagePlaceholder label="Đang tải ảnh..." />
                ) : previewUrls.thumbnail ? (
                  <ImagePreview
                    src={previewUrls.thumbnail}
                    onRemove={() => handleRemoveImage('thumbnail')}
                  />
                ) : (
                  <ImagePlaceholder label="Ảnh đại diện (Thumbnail)" />
                )}
              </div>
            </div>

            <div>
              <label className={commonLabelClass}>Xem trước thư viện ảnh</label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                {isLoadingImages ? (
                  <>
                    <div className="w-full h-32"><ImagePlaceholder label="Đang tải..." /></div>
                    <div className="w-full h-32"><ImagePlaceholder label="Đang tải..." /></div>
                    <div className="w-full h-32"><ImagePlaceholder label="Đang tải..." /></div>
                    <div className="w-full h-32"><ImagePlaceholder label="Đang tải..." /></div>
                  </>
                ) : (
                  <>
                    <div className="w-full h-32">
                      {previewUrls.image1 ? (
                        <ImagePreview
                          src={previewUrls.image1}
                          onRemove={() => handleRemoveImage('image1')}
                        />
                      ) : (
                        <ImagePlaceholder label="Ảnh 1" />
                      )}
                    </div>
                    <div className="w-full h-32">
                      {previewUrls.image2 ? (
                        <ImagePreview
                          src={previewUrls.image2}
                          onRemove={() => handleRemoveImage('image2')}
                        />
                      ) : (
                        <ImagePlaceholder label="Ảnh 2" />
                      )}
                    </div>
                    <div className="w-full h-32">
                      {previewUrls.image3 ? (
                        <ImagePreview
                          src={previewUrls.image3}
                          onRemove={() => handleRemoveImage('image3')}
                        />
                      ) : (
                        <ImagePlaceholder label="Ảnh 3" />
                      )}
                    </div>
                    <div className="w-full h-32">
                      {previewUrls.image4 ? (
                        <ImagePreview
                          src={previewUrls.image4}
                          onRemove={() => handleRemoveImage('image4')}
                        />
                      ) : (
                        <ImagePlaceholder label="Ảnh 4" />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-right mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
          <Button
            label="Hủy"
            severity="secondary"
            type="button"
            onClick={onClose}
            outlined
          />
          <Button
            severity="success"
            type="submit"
            label={isUpdateMode ? 'Cập nhật' : 'Thêm'}
          />
        </div>
      </form>
    </>
  );
}

export default ProductForm;