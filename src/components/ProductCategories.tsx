import { useCategories } from "@/pages/Admin/Category/hooks";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";

export function ProductCategories() {
  const navigate = useNavigate();

  const { data: categoryData, isLoading } = useCategories({
    pageInfo: { pageNum: 1, pageSize: 5 },
    searchCondition: { keyword: "", isDeleted: false, status: "" },
  });

  const categories = categoryData?.pageData || [];

  return (
    <section className="py-20 bg-white font-montserrat">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề thanh lịch, tối giản */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-montserrat-bold text-gray-900 mb-3 uppercase tracking-wider">
            Danh mục sản phẩm
          </h2>
          <div className="w-12 h-[2px] bg-[#8B5E3C] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton height="16rem" borderRadius="8px" />
                  <Skeleton
                    width="60%"
                    className="mt-4 mx-auto"
                    height="1.2rem"
                  />
                </div>
              ))
            : categories.map((category: any) => (
                <div
                  key={category.id}
                  onClick={() => navigate(`/product?category=${category.id}`)}
                  className="group cursor-pointer flex flex-col"
                >
                  {/* Khung ảnh: Dùng lại h-64 thần thánh của sếp, bao Fit, bao đẹp */}
                  <div className="relative w-full h-64 overflow-hidden rounded-lg shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                    <img
                      src={
                        category.imageUrl || "/home-page/categories/default.jpg"
                      }
                      alt={category.name}
                      // Giữ nguyên object-cover như bản gốc sếp dùng
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/600x800?text=No+Image";
                      }}
                    />
                    {/* Lớp phủ màu cực nhẹ để tôn tên danh mục khi hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                  </div>

                  {/* Phần chữ: Bỏ nút, chỉ giữ tên danh mục sang chảnh */}
                  <div className="mt-6 text-center">
                    <h3 className="text-sm font-montserrat-semibold text-gray-800 uppercase tracking-[0.2em] transition-colors duration-300 group-hover:text-[#8B5E3C]">
                      {category.name}
                    </h3>
                    {/* Thanh gạch chân tinh tế tự mở rộng khi hover */}
                    <div className="w-0 h-[1px] bg-[#8B5E3C] mx-auto mt-2 transition-all duration-500 group-hover:w-10"></div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
