// src/pages/Client/Product/ProductDetail/components/ProductImages.tsx
import React, { useState, useEffect } from 'react';
import { getCloudinaryImage } from '@/utils/imageUtils'; 
import type { IProduct } from '@/types/product.types';

interface ProductImagesProps {
    product: IProduct;
}

const ProductImages: React.FC<ProductImagesProps> = ({ product }) => {
    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>('');

    useEffect(() => {
        const imgs = [
            product.thumbnail,
            product.image1,
            product.image2,
            product.image3,
            product.image4
        ].filter(img => img); // Lọc bỏ null

        setImages(imgs);
        if (imgs.length > 0) setSelectedImage(imgs[0]);
    }, [product]);

    return (
        <div className="flex flex-col gap-4">
            {/* Ảnh lớn chính: Lấy chất lượng cao, kích thước khoảng 800px */}
            <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative">
                <img 
                    src={getCloudinaryImage(selectedImage, 800, 800)} 
                    alt="Product Detail" 
                    className="w-full h-full object-cover animate-fade-in"
                />
                {product.discount > 0 && (
                     <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded shadow-sm">
                        -{product.discount}%
                    </span>
                )}
            </div>

            {/* List ảnh nhỏ: Chỉ cần lấy size nhỏ 100x100 để nhẹ web */}
            <div className="grid grid-cols-5 gap-2">
                {images.map((img, index) => (
                    <div 
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`
                            aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all
                            ${selectedImage === img ? 'border-gray-800 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}
                        `}
                    >
                        {/* Ảnh thumbnail tối ưu */}
                        <img 
                            src={getCloudinaryImage(img, 150, 150)} 
                            alt={`thumb-${index}`} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductImages;