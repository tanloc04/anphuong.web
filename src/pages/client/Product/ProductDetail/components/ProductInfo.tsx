// src/pages/Client/Product/ProductDetail/components/ProductInfo.tsx
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import type { IProduct } from '@/types/product.types';

interface ProductInfoProps {
    product: IProduct;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const [quantity, setQuantity] = useState<number>(1);

    // Tính giá sau giảm
    const finalPrice = product.discount 
        ? product.price * (1 - product.discount / 100) 
        : product.price;

    // Format tiền tệ
    const formatCurrency = (value: number) => 
        value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    return (
        <div className="flex flex-col gap-6">
            {/* Tên & Mã */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Mã SP: #{product.id}</span>
                    <span>|</span>
                    <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-500"}>
                        {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                    </span>
                </div>
            </div>

            {/* Giá bán */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-end gap-3">
                    <span className="text-3xl font-bold text-red-600">
                        {formatCurrency(finalPrice)}
                    </span>
                    {product.discount > 0 && (
                        <div className="flex flex-col mb-1">
                            <span className="text-sm text-gray-400 line-through">
                                {formatCurrency(product.price)}
                            </span>
                            <span className="text-xs text-red-500 font-bold">
                                Tiết kiệm {product.discount}%
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Thông số kỹ thuật (Dựa trên DB Diagram của bạn) */}
            <div className="grid grid-cols-2 gap-y-3 text-sm border-t border-b border-gray-100 py-4">
                <div className="text-gray-500">Chất liệu:</div>
                <div className="font-medium text-gray-900">{product.material}</div>

                <div className="text-gray-500">Kích thước (D x R x C):</div>
                <div className="font-medium text-gray-900">
                    {product.longSize} x {product.widthSize} x {product.heightSize} cm
                </div>
                
                {/* Chỗ này sau này sẽ thêm logic chọn Màu sắc từ bảng Variants */}
            </div>

            {/* Số lượng & Nút Mua */}
            <div className="flex flex-col gap-4 pt-2">
                <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-700">Số lượng:</span>
                    <InputNumber 
                        value={quantity} 
                        onValueChange={(e) => setQuantity(e.value || 1)} 
                        showButtons 
                        buttonLayout="horizontal" 
                        min={1} 
                        max={product.stock}
                        className="w-32"
                        inputClassName="w-12 text-center !p-1"
                        decrementButtonClassName="!bg-gray-100 !text-gray-600 !border-gray-300"
                        incrementButtonClassName="!bg-gray-100 !text-gray-600 !border-gray-300"
                    />
                </div>

                <div className="flex gap-3 mt-2">
                    <Button 
                        label="Thêm vào giỏ" 
                        icon="pi pi-cart-plus" 
                        className="flex-1 p-button-outlined !border-gray-800 !text-gray-800 hover:!bg-gray-50" 
                    />
                    <Button 
                        label="Mua ngay" 
                        className="flex-1 !bg-gray-800 !border-gray-800 hover:!bg-gray-700" 
                    />
                </div>
            </div>

            {/* Mô tả chi tiết */}
            <div className="pt-6">
                <h3 className="font-bold text-gray-900 mb-3 text-lg border-b pb-2">Mô tả sản phẩm</h3>
                <div 
                    className="text-gray-600 leading-relaxed space-y-2"
                />
            </div>
        </div>
    );
};

export default ProductInfo;