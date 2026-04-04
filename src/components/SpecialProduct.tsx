import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/pages/Admin/Product/hooks";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "primereact/skeleton";

export function SpecialProduct() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const itemsPerSlide = 4;

  const { data: productData, isLoading } = useProducts({
    pageInfo: { pageNum: 1, pageSize: 8 },
    searchCondition: {
      keyword: "",
      isDeleted: false,
      status: "",
      categoryId: null,
      startDate: null,
      endDate: null,
    },
  });

  const products = productData?.pageData || [];
  const totalPages = Math.ceil(products.length / itemsPerSlide);

  const goPrev = () => setPage((prev) => (prev - 1 + totalPages) % totalPages);
  const goNext = () => setPage((prev) => (prev + 1) % totalPages);

  const startIndex = page * itemsPerSlide;
  const visibleProducts = products.slice(
    startIndex,
    startIndex + itemsPerSlide,
  );

  return (
    <section className="py-20 bg-white font-montserrat relative overflow-hidden border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-montserrat-bold text-gray-900 mb-3 uppercase tracking-wider">
            Sản phẩm nổi bật
          </h2>
          <div className="w-12 h-[2px] bg-[#8B5E3C] mx-auto mb-4"></div>
          <p className="text-xs text-gray-400 uppercase tracking-[0.3em]">
            Timeless Furniture Collection
          </p>
        </div>

        <div className="relative w-full min-h-[400px]">
          <AnimatePresence mode="wait" initial={false}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col">
                    <Skeleton height="18rem" className="mb-4" />
                    <Skeleton width="70%" className="mb-2" />
                    <Skeleton width="40%" />
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
              >
                {visibleProducts.map((product: any) => (
                  <div
                    key={product.id}
                    className="group flex flex-col cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* KHUNG ẢNH - Nhỏ gọn, Square tỉ lệ 1:1 hoặc 4:5 */}
                    <div className="relative aspect-square overflow-hidden bg-[#f9f9f9] mb-5 shadow-sm transition-shadow duration-500 group-hover:shadow-md">
                      <img
                        src={product.thumbnail || "/placeholder-product.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/600x600?text=No+Image";
                        }}
                      />
                    </div>

                    {/* NỘI DUNG TEXT - Nhỏ gọn hơn */}
                    <div className="flex flex-col items-start px-1">
                      <h3 className="text-sm font-montserrat-semibold text-gray-800 mb-1.5 line-clamp-1 group-hover:text-[#8B5E3C] transition-colors duration-300">
                        {product.name}
                      </h3>

                      {/* KHUNG TRƯỢT GIÁ (SLIDING WINDOW) */}
                      <div className="h-6 overflow-hidden relative w-full">
                        <div className="flex flex-col transition-all duration-500 ease-in-out transform group-hover:-translate-y-6">
                          {/* Tầng 1: Xem chi tiết (Nhỏ gọn như ảnh mẫu) */}
                          <div className="h-6 flex items-center">
                            <span className="text-[10px] text-gray-400 font-montserrat-medium uppercase tracking-[0.2em] transition-opacity group-hover:opacity-0">
                              Xem chi tiết
                            </span>
                          </div>

                          {/* Tầng 2: Giá tiền (Hiện ra thay thế) */}
                          <div className="h-6 flex items-center gap-2">
                            <span className="text-gray-900 font-montserrat-bold text-sm">
                              {product.price > 0
                                ? formatCurrency(product.price)
                                : "Liên hệ"}
                            </span>
                            <div className="w-4 h-[1px] bg-[#8B5E3C]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ĐIỀU HƯỚNG TỐI GIẢN (Giống ảnh mẫu 2) */}
        {totalPages > 1 && !isLoading && (
          <div className="flex justify-center items-center gap-12 mt-16">
            <button
              onClick={goPrev}
              className="text-gray-300 hover:text-gray-900 transition-all transform hover:-translate-x-1"
            >
              <FontAwesomeIcon icon={faChevronLeft} size="sm" />
            </button>
            <div className="h-[1px] w-12 bg-gray-100 relative">
              <div
                className="absolute h-full bg-[#8B5E3C] transition-all duration-500"
                style={{
                  width: `${((page + 1) / totalPages) * 100}%`,
                  left: 0,
                }}
              ></div>
            </div>
            <button
              onClick={goNext}
              className="text-gray-300 hover:text-gray-900 transition-all transform hover:translate-x-1"
            >
              <FontAwesomeIcon icon={faChevronRight} size="sm" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
