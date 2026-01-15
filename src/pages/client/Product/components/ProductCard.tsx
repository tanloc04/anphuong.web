// src/pages/Client/Product/components/ProductCard.tsx
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { getCloudinaryImage } from '@/utils/imageUtils'; 
import type { IProduct } from '@/types/product.types';

const ProductCard = ({ product }: { product: IProduct }) => {
    const formatCurrency = (value: number) => {
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const finalPrice = product.discount 
        ? product.price * (1 - product.discount / 100) 
        : product.price;

    const detailPath = `/pages/products/${product.id}`;

    // --- SỬ DỤNG HÀM TỐI ƯU ẢNH ---
    // Card thường nhỏ nên chỉ cần ảnh rộng khoảng 400px là đủ nét
    const imageUrl = getCloudinaryImage(product.thumbnail, 400, 300);

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                <img 
                    src={imageUrl} 
                    alt={product.name}
                    loading="lazy" // Tải chậm để tăng tốc trang
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.discount > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                        -{product.discount}%
                    </span>
                )}
            </div>
            
            {/* ... Phần nội dung giữ nguyên ... */}
            <div className="p-4 flex flex-col flex-1">
                <Link to={detailPath} className="block">
                    <h3 className="text-gray-800 font-semibold text-lg mb-1 line-clamp-2 hover:text-orange-600 transition-colors min-h-[3.5rem]">
                        {product.name}
                    </h3>
                </Link>

                <div className="mb-4">
                    <span className="text-xl font-bold text-gray-900 block">
                        {formatCurrency(finalPrice)}
                    </span>
                    {product.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                            {formatCurrency(product.price)}
                        </span>
                    )}
                </div>

                <div className="mt-auto">
                    <Link to={detailPath}>
                        <Button 
                            label="Xem chi tiết" 
                            className="w-full p-button-outlined !border-gray-300 !text-gray-700 hover:!bg-gray-800 hover:!text-white hover:!border-gray-800 !rounded-lg transition-all" 
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;