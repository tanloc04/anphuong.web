import React, { useState, useMemo } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { useClientProducts } from './hooks/useClientProducts';
import { useCategories } from '@/pages/Admin/Category/hooks';
import ProductCard from './components/ProductCard';
import type { IClientProductSearchCondition } from '@/types/product.types';

const ProductPage = () => {
    const [searchCondition, setSearchCondition] = useState<IClientProductSearchCondition>({
        keyword: '',
        status: 'ACTIVE',
        isDeleted: false,
        categoryIds: [],
        minPrice: undefined,
        maxPrice: undefined,
        sortBy: 'newest'
    });
    
    const [first, setFirst] = useState(0);
    const pageSize = 12;

    const { data: allProducts = [], isLoading } = useClientProducts(searchCondition);
    
    const { data: categoryData } = useCategories({ pageInfo: { pageNum: 1, pageSize: 50 } });
    const categories = categoryData?.pageData || [];

    const filteredProducts = useMemo(() => {
        let result = [...allProducts];

  
        if (searchCondition.categoryIds && searchCondition.categoryIds.length > 0) {
            result = result.filter(p => searchCondition.categoryIds?.includes(p.categoryId));
        }


        if (searchCondition.minPrice !== undefined) {
            result = result.filter(p => {
                const price = p.discount ? p.price * (1 - p.discount/100) : p.price;
                return price >= (searchCondition.minPrice || 0);
            });
        }
        if (searchCondition.maxPrice !== undefined) {
            result = result.filter(p => {
                const price = p.discount ? p.price * (1 - p.discount/100) : p.price;
                return price <= (searchCondition.maxPrice || Infinity);
            });
        }


        if (searchCondition.sortBy) {
            result.sort((a, b) => {
                const priceA = a.discount ? a.price * (1 - a.discount/100) : a.price;
                const priceB = b.discount ? b.price * (1 - b.discount/100) : b.price;

                if (searchCondition.sortBy === 'price_asc') return priceA - priceB;
                if (searchCondition.sortBy === 'price_desc') return priceB - priceA;
                return 0; 
            });
        }

        return result;
    }, [allProducts, searchCondition]);

    const currentProducts = filteredProducts.slice(first, first + pageSize);
    const totalRecords = filteredProducts.length;

    const sortOptions = [
        { label: 'Mới nhất', value: 'newest' },
        { label: 'Giá tăng dần', value: 'price_asc' },
        { label: 'Giá giảm dần', value: 'price_desc' },
    ];

    const priceRanges = [
        { label: 'Tất cả giá', value: null },
        { label: 'Dưới 5 triệu', value: '0-5000000' },
        { label: '5 - 10 triệu', value: '5000000-10000000' },
        { label: 'Trên 10 triệu', value: '10000000-100000000' },
    ];

    const handlePriceChange = (e: any) => {
        if (!e.value) {
            setSearchCondition(prev => ({ ...prev, minPrice: undefined, maxPrice: undefined }));
        } else {
            const [min, max] = e.value.split('-').map(Number);
            setSearchCondition(prev => ({ ...prev, minPrice: min, maxPrice: max }));
        }
        setFirst(0);
    };

    return (
        <div className="bg-white min-h-screen pb-10">
            
            <div className="container mx-auto px-4 max-w-7xl mt-8">
                {/* TOOLBAR BỘ LỌC */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 sticky top-[70px] z-10 bg-white/95 backdrop-blur-sm py-4 border-b border-gray-100">
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <span className="font-bold text-gray-700 mr-2"><i className="pi pi-filter mr-2"/>BỘ LỌC</span>
                        
                        <Dropdown 
                            value={searchCondition.categoryIds?.[0]} 
                            options={categories} 
                            optionLabel="name" 
                            optionValue="id"
                            onChange={(e) => {
                                setSearchCondition(prev => ({ ...prev, categoryIds: e.value ? [e.value] : [] }));
                                setFirst(0);
                            }}
                            placeholder="Danh mục" 
                            showClear
                            className="w-40 md:w-48 p-inputtext-sm rounded-lg"
                        />

                        <Dropdown 
                            options={priceRanges} 
                            onChange={handlePriceChange}
                            placeholder="Mức giá" 
                            className="w-40 md:w-48 p-inputtext-sm rounded-lg"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                        <span className="p-input-icon-left w-full md:w-60">
                            <i className="pi pi-search" />
                            <InputText 
                                placeholder="Tìm sản phẩm..." 
                                className="p-inputtext-sm w-full rounded-lg"
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        setSearchCondition(prev => ({ ...prev, keyword: e.target.value }));
                                        setFirst(0);
                                    }
                                }}
                            />
                        </span>
                        <Dropdown 
                            value={searchCondition.sortBy} 
                            options={sortOptions} 
                            onChange={(e) => setSearchCondition(prev => ({ ...prev, sortBy: e.value }))}
                            className="w-40 md:w-48 p-inputtext-sm bg-gray-50 border-none"
                        />
                    </div>
                </div>

                {/* GRID SẢN PHẨM */}
                {isLoading ? (
                    <div className="text-center">Đang tải...</div>
                ) : (
                    <>
                        {currentProducts.length === 0 ? (
                             <div className="text-center py-20 text-gray-500">Không tìm thấy sản phẩm nào.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {currentProducts.map((product: any) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                        <div className="mt-12 flex justify-center">
                            <Paginator 
                                first={first} 
                                rows={pageSize} 
                                totalRecords={totalRecords} 
                                onPageChange={(e) => setFirst(e.first)} 
                                className="!bg-transparent"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductPage;