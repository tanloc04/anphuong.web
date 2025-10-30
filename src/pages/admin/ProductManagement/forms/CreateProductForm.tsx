import { useState, type ChangeEvent, type FormEvent } from "react";
import type { ProductFormData } from "../type";
import { Button } from "primereact/button";


const CreateProduct = () => {
  const [formData, setFormData] = useState<ProductFormData>({
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
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0]
      }))
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSubmit = new FormData();

    (Object.keys(formData) as Array<keyof ProductFormData>).forEach((key) => {
      const value = formData[key];
      if(value !== null) {
        dataToSubmit.append(key, value as string | Blob);
      }
    });

    console.log('Form data to submit:', dataToSubmit);
  }

  const commonInputClass = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm';
  const commonLabelClass = 'block text-sm font-medium text-gray-700';
  const commonFileClass = 'block w-full text-sm text-gray-500 file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100';

  return (
    <div className="max-w-4xl mx-auto ml-2 p-6 bg-white rounded-lg shadow-md mt-2">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">TẠO MỚI SẢN PHẨM</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
                required 
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
          <div className="text-right">
            <Button 
              severity="success"
              type="submit"
              label="Hoàn Thành"
            />
          </div>
      </form>
    </div>
  )
}

export default CreateProduct