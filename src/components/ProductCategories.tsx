export function ProductCategories() {
  const categories = [
  {
    name: "Sofa",
    image: "/home-page/product/sofa.jpg",
    price: "15.000.000đ",
  },
  {
    name: "Bàn ăn",
    image: "/home-page/product/ban_an.jpg",
    price: "8.000.000đ",
  },
  {
    name: "Tủ bếp",
    image: "/home-page/product/tu_bep.jpg",
    price: "25.000.000đ",
  },
  {
    name: "Giường ngủ",
    image: "/home-page/product/giuong_ngu.jpg",
    price: "12.000.000đ",
  },
  {
    name: "Decor",
    image: "/home-page/product/decor.jpg",
    price: "500.000đ",
  },
]


  return (
    <section className="py-16 bg-muted/30 font-montserrat">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-montserrat-bold text-foreground mb-4" >Danh mục sản phẩm nổi bật</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá bộ sưu tập nội thất hiện đại, được thiết kế tỉ mỉ cho không gian sống đô thị
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
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
                <p className="text-accent font-montserrat-medium mb-4">{category.price}</p>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-montserrat-medium hover:bg-gray-100 transition">
                Xem chi tiết
                </button>
            </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
