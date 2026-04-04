import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Checkbox } from "primereact/checkbox";
import { Slider } from "primereact/slider";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useProducts } from "@/pages/Admin/Product/hooks";

const Product = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      const ids = categoryFromUrl
        .split(",")
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));
      setSelectedCategories(ids);
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  const currentCategoryId =
    selectedCategories.length > 0 ? selectedCategories[0] : null;

  let currentSortBy = "CreatedAt";
  let currentSortDesc = true;

  if (sortOption === "priceAsc") {
    currentSortBy = "Price";
    currentSortDesc = false;
  } else if (sortOption === "priceDesc") {
    currentSortBy = "Price";
    currentSortDesc = true;
  }

  const { data: serverData, isLoading } = useProducts({
    searchCondition: {
      categoryId: currentCategoryId,
      isDeleted: false,
      status: "1",
      keyword: "",
      startDate: null,
      endDate: null,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 20,
      sortBy: currentSortBy,
      sortDesc: currentSortDesc,
    },
  });

  const products = serverData?.pageData || [];

  const categories = [
    { name: "Sofa cao cấp", value: 1 },
    { name: "Bàn trà / Bàn góc", value: 2 },
    { name: "Kệ Tivi", value: 3 },
    { name: "Giường ngủ", value: 4 },
    { name: "Tủ quần áo", value: 5 },
    { name: "Bàn ăn gia đình", value: 6 },
  ];

  const sortOptions = [
    { label: "Mới nhất", value: "newest" },
    { label: "Giá tăng dần", value: "priceAsc" },
    { label: "Giá giảm dần", value: "priceDesc" },
  ];

  const onCategoryChange = (e: any) => {
    let _selectedCategories = [...selectedCategories];
    if (e.checked) {
      _selectedCategories.push(e.value);
    } else {
      _selectedCategories = _selectedCategories.filter((id) => id !== e.value);
    }
    setSelectedCategories(_selectedCategories);

    if (_selectedCategories.length > 0) {
      setSearchParams({ category: _selectedCategories.join(",") });
    } else {
      searchParams.delete("category");
      setSearchParams(searchParams);
    }
  };

  const clearFilter = () => {
    setSelectedCategories([]);
    setPriceRange([0, 50000000]);
    setSortOption("newest");
    setSearchParams({});
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">
            Sản Phẩm Của Chúng Tôi
          </h1>
          <p className="text-gray-600">
            Khám phá bộ sưu tập nội thất cao cấp mang đến không gian sống hoàn
            hảo.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-1/4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <i className="pi pi-filter"></i> Bộ Lọc
                </h2>
                <Button
                  label="Xóa lọc"
                  text
                  size="small"
                  className="text-gray-500 hover:text-red-500 p-0"
                  onClick={clearFilter}
                />
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-4">Danh Mục</h3>
                <div className="flex flex-col gap-3">
                  {categories.map((cat) => (
                    <div key={cat.value} className="flex items-center">
                      <Checkbox
                        inputId={cat.value.toString()}
                        name="category"
                        value={cat.value}
                        onChange={onCategoryChange}
                        checked={selectedCategories.includes(cat.value)}
                      />
                      <label
                        htmlFor={cat.value.toString()}
                        className="ml-2 text-gray-700 cursor-pointer hover:text-[#8B5E3C] transition-colors text-sm"
                      >
                        {cat.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-4">Khoảng Giá</h3>
                <Slider
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.value as [number, number])}
                  range
                  min={0}
                  max={50000000}
                  step={1000000}
                  className="mb-4"
                />
                <div className="flex items-center justify-between text-sm font-medium text-gray-600">
                  <span>{formatCurrency(priceRange[0])}</span>
                  <span>-</span>
                  <span>{formatCurrency(priceRange[1])}</span>
                </div>
              </div>
            </div>
          </aside>

          <main className="w-full lg:w-3/4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-gray-600 font-medium">
                Tìm thấy{" "}
                <span className="font-bold text-gray-900">
                  {products.length}
                </span>{" "}
                sản phẩm
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Sắp xếp theo:</span>
                <Dropdown
                  value={sortOption}
                  options={sortOptions}
                  onChange={(e) => setSortOption(e.value)}
                  className="w-48 h-10 flex items-center"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <ProgressSpinner
                  style={{ width: "50px", height: "50px" }}
                  strokeWidth="4"
                />
              </div>
            ) : products.length === 0 ? (
              // ==========================================
              // GIAO DIỆN TRỐNG CUTE PHÔ MAI QUE Ở ĐÂY SẾP NHÉ
              // ==========================================
              <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 py-24 px-4 text-center mt-6">
                <div className="w-40 h-40 bg-[#FAF6F3] rounded-full flex items-center justify-center mb-6 relative">
                  <i className="pi pi-box text-7xl text-[#8B5E3C] opacity-80 animate-bounce"></i>
                  <i className="pi pi-star-fill text-yellow-400 absolute top-4 right-4 animate-pulse"></i>
                  <i className="pi pi-star-fill text-yellow-400 absolute bottom-8 left-4 animate-pulse text-sm"></i>
                </div>

                <h3 className="text-2xl font-montserrat-bold text-gray-800 mb-3">
                  Ú òa! Danh mục này đang trống...
                </h3>

                <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                  Rất xin lỗi bạn, hiện tại chúng tôi chưa kịp cập nhật sản phẩm
                  cho mục này. Bạn vui lòng xem thử các món nội thất tuyệt đẹp
                  khác nhé! 🛋️✨
                </p>

                <Button
                  label="Khám phá danh mục khác"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  className="bg-[#8B5E3C] border-none hover:bg-[#724C31] rounded-full px-8 py-3 font-semibold shadow-md hover:shadow-lg transition-all"
                  onClick={clearFilter}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={
                          product.thumbnail ||
                          product.detailImage?.image1 ||
                          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80";
                        }}
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                        {product.category?.name || "Danh mục"}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-[#8B5E3C] transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xl font-bold text-red-500">
                          {formatCurrency(product.price)}
                        </span>
                        <Button
                          icon="pi pi-shopping-cart"
                          rounded
                          text
                          className="text-gray-400 hover:text-white hover:bg-[#8B5E3C] hover:border-[#8B5E3C]"
                          aria-label="Add to cart"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {products.length > 0 && (
              <div className="flex justify-center mt-10">
                <Button
                  label="Xem thêm sản phẩm"
                  outlined
                  className="text-[#8B5E3C] border-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white px-8 py-3 rounded-full font-semibold"
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Product;
