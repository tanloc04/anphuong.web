import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export function SpecialProduct() {
  const products = [
  { name: "Sofa góc L cao cấp", image: "/home-page/products/sofa_goc_L_cao_cap.jpg", price: "18.000.000đ" },
  { name: "Bàn ăn mặt đá 6 ghế", image: "/home-page/products/ban_an_mat_da.jpg", price: "12.000.000đ" },
  { name: "Tủ bếp chữ L gỗ công nghiệp", image: "/home-page/products/tu_bep_chu_L.jpg", price: "28.000.000đ" },
  { name: "Giường ngủ gỗ sồi kèm ngăn kéo", image: "/home-page/products/giuong_go_soi.jpg", price: "14.000.000đ" },
  { name: "Kệ tivi hiện đại", image: "/home-page/products/ke_tivi.jpg", price: "6.500.000đ" },
  { name: "Đèn trang trí trần nhà", image: "/home-page/products/den_trang_tri.jpg", price: "1.200.000đ" },
  { name: "Tủ quần áo 3 cánh trượt", image: "/home-page/products/tu_quan_ao.jpg", price: "10.000.000đ" },
  { name: "Ghế thư giãn bọc nỉ", image: "/home-page/products/ghe_thu_gian.jpg", price: "4.800.000đ" },
];


  const [page, setPage] = useState(0);
  const itemsPerSlide = 4;
  const totalPages = Math.ceil(products.length / itemsPerSlide);

  const goPrev = () => setPage((prev) => (prev - 1 + totalPages) % totalPages);
  const goNext = () => setPage((prev) => (prev + 1) % totalPages);

  const startIndex = page * itemsPerSlide;
  const visibleProducts = products.slice(startIndex, startIndex + itemsPerSlide);

  return (
    <section className="py-16 bg-muted/30 font-montserrat relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-montserrat-bold text-foreground mb-4">
            Sản phẩm nổi bật
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá bộ sưu tập nội thất hiện đại, được thiết kế tỉ mỉ cho không gian sống đô thị
          </p>
        </div>

        {/* Khung hiển thị 4 sản phẩm */}
        <div className="relative w-full overflow-hidden">
          <div className="h-full">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={page}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {visibleProducts.map((category) => (
                  <div
                    key={category.name}
                    className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-transform duration-300 hover:scale-105"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-montserrat-semibold text-foreground mb-2">
                        {category.name}
                      </h3>
                      <p className="text-accent font-montserrat-medium mb-4">
                        {category.price}
                      </p>
                      <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-montserrat-medium hover:bg-gray-100 transition">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Nút điều hướng */}
        <button
          onClick={goPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          onClick={goNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </section>
  );
}
