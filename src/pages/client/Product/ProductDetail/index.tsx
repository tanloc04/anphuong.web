import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BreadCrumb } from 'primereact/breadcrumb';
import { productApi } from '@/api/productApi';
import ProductImages from './components/ProductImages';
import ProductInfo from './components/ProductInfo';
import type { IProduct } from '@/types/product.types';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch chi tiết sản phẩm
    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const res = await productApi.getById(Number(id));
                // Lưu ý: Kiểm tra lại res.data hoặc res.data.data tùy API backend trả về
                setProduct(res.data?.data || res.data); 
            } catch (error) {
                console.error("Lỗi lấy chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    // --- CẬP NHẬT BREADCRUMB ---
    const items = [
        { label: 'Sản phẩm', url: '/pages/products' }, // Quay về danh sách đúng path
        { label: product?.name || 'Chi tiết' }
    ];
    
    // Nút Home mặc định
    const home = { icon: 'pi pi-home', url: '/' };

    if (loading) return <div className="h-screen flex justify-center items-center">Loading...</div>;
    if (!product) return <div className="h-screen flex justify-center items-center">Không tìm thấy sản phẩm</div>;

    return (
        <div className="bg-white min-h-screen pb-20 pt-4">
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 mb-6">
                <BreadCrumb model={items} home={home} className="border-none bg-transparent p-0 text-sm" />
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Cột trái: Ảnh */}
                    <div>
                        <ProductImages product={product} />
                    </div>

                    {/* Cột phải: Thông tin */}
                    <div>
                        <ProductInfo product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;