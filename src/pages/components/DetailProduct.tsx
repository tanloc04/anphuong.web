import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { useProductDetail, useProducts } from "@/pages/Admin/Product/hooks"; // Sếp check lại đường dẫn hook nhé
import { formatCurrency } from "@/utils/format";

const DetailProduct = () => {
  // 1. Lấy ID từ URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toastRef = useRef<Toast>(null);

  // Chuyển ID từ chuỗi (URL) sang số để gọi API
  const productId = id ? parseInt(id, 10) : null;

  // 2. Gọi API lấy Chi tiết Sản phẩm
  const {
    data: product,
    isLoading: loadingProduct,
    isError,
  } = useProductDetail(productId);

  // 3. Gọi API lấy Sản phẩm liên quan (Cùng Category)
  const { data: relatedData } = useProducts({
    pageInfo: { pageNum: 1, pageSize: 5 },
    searchCondition: {
      categoryId: product?.categoryId || null, // Lọc theo danh mục của sản phẩm hiện tại
      keyword: "",
      status: "",
      isDeleted: false,
      startDate: null,
      endDate: null,
    },
  });

  // Loại bỏ sản phẩm hiện tại khỏi danh sách liên quan & lấy 4 cái đầu tiên
  const relatedProducts = (relatedData?.pageData || [])
    .filter((p: any) => p.id !== productId)
    .slice(0, 4);

  // States
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string>("");

  // 4. Set ảnh mặc định khi API trả dữ liệu về
  useEffect(() => {
    if (product) {
      // Ưu tiên Thumbnail, nếu ko có thì lấy Image1 trong DetailImage
      const firstImage =
        product.thumbnail ||
        product.detailImage?.image1 ||
        "/placeholder-product.jpg";
      setMainImage(firstImage);
      setQuantity(1); // Reset số lượng về 1 khi đổi sản phẩm khác
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    // TODO: Chỗ này sau này sếp nối với API AddToCart thật, tạm thời để LocalStorage
    const cartItem = {
      productId: product.id,
      productName: product.name,
      image: mainImage,
      price: product.price,
      discount: product.discount,
      quantity: quantity,
      stock: product.totalStock, // Dùng totalStock từ DTO
    };

    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];

    const existingItem = cart.find(
      (item: any) => item.productId === product.id,
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toastRef.current?.show({
      severity: "success",
      summary: "Thành công",
      detail: "Đã thêm vào giỏ hàng",
      life: 2000,
    });
  };

  const renderBreadcrumb = () => (
    <div className="flex items-center gap-1 md:gap-2 mb-4 md:mb-6 text-xs md:text-sm font-montserrat-medium">
      <button
        onClick={() => navigate("/")}
        className="text-gray-500 hover:text-[#8B5E3C] transition"
      >
        Trang chủ
      </button>
      <span className="text-gray-300">/</span>
      <button
        onClick={() => navigate("/products")}
        className="text-gray-500 hover:text-[#8B5E3C] transition"
      >
        Sản phẩm
      </button>
      <span className="text-gray-300">/</span>
      <span className="text-[#8B5E3C] truncate">{product?.name}</span>
    </div>
  );

  const renderImageGallery = () => {
    // Gom tất cả ảnh vào 1 mảng (Lấy từ DetailImage do Backend trả về)
    const images = [
      product?.thumbnail,
      product?.detailImage?.image1,
      product?.detailImage?.image2,
      product?.detailImage?.image3,
      product?.detailImage?.image4,
    ].filter(Boolean); // Lọc bỏ những ảnh null/undefined

    // Loại bỏ ảnh trùng lặp (ví dụ thumbnail trùng với image1)
    const uniqueImages = Array.from(new Set(images));

    return (
      <div className="flex flex-col md:flex-row gap-4">
        {/* Danh sách ảnh nhỏ (Thumbnails) */}
        <div className="flex md:flex-col gap-3 order-2 md:order-1 w-full md:w-24 overflow-x-auto">
          {uniqueImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainImage(img as string)}
              className={`w-20 h-20 md:w-24 md:h-24 shrink-0 border-2 rounded-sm overflow-hidden transition-all duration-300 ${
                mainImage === img
                  ? "border-[#8B5E3C] opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img as string}
                alt={`thumbnail-${idx}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Ảnh chính lớn */}
        <div className="order-1 md:order-2 flex-1 bg-gray-50 rounded-sm overflow-hidden flex items-center justify-center aspect-square md:aspect-[4/3] shadow-inner">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product?.name}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="text-gray-300">
              <i className="pi pi-image text-5xl"></i>
            </div>
          )}
        </div>
      </div>
    );
  };

  const calculateDiscountedPrice = () => {
    if (!product) return 0;
    return product.price * (1 - (product.discount || 0) / 100);
  };

  const renderProductInfo = () => (
    <div className="space-y-6 font-montserrat">
      {/* Tên sản phẩm */}
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-2xl md:text-4xl font-montserrat-bold text-gray-900 mb-3">
          {product?.name}
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <i key={i} className="pi pi-star-fill text-sm mr-1"></i>
            ))}
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-gray-500 font-montserrat-medium">
            SKU: AP-{product?.id.toString().padStart(4, "0")}
          </span>
        </div>
      </div>

      {/* Giá */}
      <div className="py-2">
        <div className="flex items-baseline gap-4 flex-wrap">
          <span className="text-3xl md:text-4xl font-montserrat-bold text-gray-900">
            {formatCurrency(calculateDiscountedPrice())}
          </span>
          {product?.discount > 0 && (
            <>
              <span className="text-xl text-gray-400 line-through font-montserrat-medium">
                {formatCurrency(product.price)}
              </span>
              <Tag
                value={`-${product.discount}%`}
                className="bg-[#8B5E3C] text-sm px-3 py-1 rounded-sm"
              />
            </>
          )}
        </div>
      </div>

      {/* Thông số ngắn */}
      <div className="bg-[#FAF6F3] p-5 rounded-sm border border-[#EBE3DB]">
        <h3 className="font-montserrat-semibold text-gray-800 mb-4 uppercase text-sm tracking-widest">
          Thông số kỹ thuật
        </h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">Chiều dài</span>
            <span className="font-montserrat-semibold text-gray-900">
              {product?.longSize} cm
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">Chiều rộng</span>
            <span className="font-montserrat-semibold text-gray-900">
              {product?.widthSize} cm
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">Chiều cao</span>
            <span className="font-montserrat-semibold text-gray-900">
              {product?.heightSize} cm
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">Thiết kế riêng</span>
            <span className="font-montserrat-semibold text-[#8B5E3C]">
              {product?.isCustomize ? "Có hỗ trợ" : "Không"}
            </span>
          </div>
        </div>
      </div>

      {/* Trạng thái tồn kho */}
      <div className="flex items-center gap-3">
        <span className="text-gray-600 font-montserrat-medium">
          Tình trạng:
        </span>
        {product && product.totalStock > 0 ? (
          <span className="text-green-600 font-montserrat-bold bg-green-50 px-3 py-1 rounded-sm text-sm">
            Còn hàng ({product.totalStock})
          </span>
        ) : (
          <span className="text-red-500 font-montserrat-bold bg-red-50 px-3 py-1 rounded-sm text-sm">
            Hết hàng
          </span>
        )}
      </div>

      {/* Số lượng & Add to cart */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-4 border-t border-gray-100">
        <div className="w-full sm:w-36 h-12 flex items-center border border-gray-200 rounded-sm bg-white overflow-hidden">
          <Button
            icon="pi pi-minus"
            className="p-button-text text-gray-600 hover:bg-gray-100 w-12 h-full flex items-center justify-center border-none rounded-none"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || !product || product.totalStock === 0}
          />
          <div className="flex-1 flex items-center justify-center font-montserrat-semibold text-gray-900 border-x border-gray-100 h-full">
            {quantity}
          </div>
          <Button
            icon="pi pi-plus"
            className="p-button-text text-gray-600 hover:bg-gray-100 w-12 h-full flex items-center justify-center border-none rounded-none"
            onClick={() =>
              setQuantity(Math.min(product?.totalStock || 1, quantity + 1))
            }
            disabled={
              !product ||
              quantity >= (product?.totalStock || 1) ||
              product.totalStock === 0
            }
          />
        </div>

        <Button
          label="THÊM VÀO GIỎ HÀNG"
          icon="pi pi-shopping-bag"
          className="flex-1 h-12 bg-[#8B5E3C] border-none hover:bg-[#724C31] text-white font-montserrat-semibold uppercase tracking-widest px-6 rounded-sm transition-colors shadow-sm"
          onClick={handleAddToCart}
          disabled={!product || product.totalStock === 0}
        />
      </div>
    </div>
  );

  if (loadingProduct) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Skeleton height="500px" />
          </div>
          <div className="space-y-6">
            <Skeleton height="3rem" width="80%" />
            <Skeleton height="4rem" width="40%" />
            <Skeleton height="150px" />
            <Skeleton height="3rem" width="100%" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <i className="pi pi-exclamation-circle text-6xl text-gray-300 mb-4"></i>
        <h2 className="text-2xl font-montserrat-bold text-gray-800 mb-6">
          Không tìm thấy sản phẩm
        </h2>
        <Button
          label="Quay lại cửa hàng"
          onClick={() => navigate("/products")}
          className="bg-[#8B5E3C] border-none"
        />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-8 border-t border-gray-100 font-montserrat">
      <Toast ref={toastRef} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {renderBreadcrumb()}

        {/* Cột Trái: Ảnh - Cột Phải: Thông tin */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20 mt-8">
          <div>{renderImageGallery()}</div>
          <div>{renderProductInfo()}</div>
        </div>

        {/* Tab thông tin chi tiết */}
        <div className="mb-20">
          <TabView className="font-montserrat">
            <TabPanel
              header="Mô tả sản phẩm"
              className="font-montserrat-semibold text-gray-700"
            >
              <div className="p-4 md:p-8 bg-gray-50 rounded-sm">
                <div className="prose max-w-none text-gray-600 leading-loose">
                  {product.description || "Đang cập nhật mô tả..."}
                </div>
              </div>
            </TabPanel>
            <TabPanel
              header="Giao hàng & Lắp đặt"
              className="font-montserrat-semibold text-gray-700"
            >
              <div className="p-4 md:p-8 bg-gray-50 rounded-sm space-y-4 text-gray-600 leading-loose">
                <p>
                  <i className="pi pi-truck text-[#8B5E3C] mr-2"></i> Miễn phí
                  giao hàng nội thành cho đơn hàng từ 5.000.000đ.
                </p>
                <p>
                  <i className="pi pi-wrench text-[#8B5E3C] mr-2"></i> Hỗ trợ
                  lắp đặt tận nhà bởi đội ngũ kỹ thuật viên chuyên nghiệp.
                </p>
                <p>
                  <i className="pi pi-shield text-[#8B5E3C] mr-2"></i> Bảo hành
                  kết cấu 12 tháng, bảo trì trọn đời.
                </p>
              </div>
            </TabPanel>
          </TabView>
        </div>

        {/* Sản phẩm liên quan */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-100 pt-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-montserrat-bold text-gray-900 uppercase tracking-widest mb-3">
                Có thể bạn sẽ thích
              </h2>
              <div className="w-12 h-[2px] bg-[#8B5E3C] mx-auto"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct: any) => (
                <div
                  key={relProduct.id}
                  className="group cursor-pointer flex flex-col"
                  onClick={() => navigate(`/product/${relProduct.id}`)}
                >
                  <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden mb-4">
                    <img
                      src={relProduct.thumbnail}
                      alt={relProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="text-sm font-montserrat-semibold text-gray-800 line-clamp-1 group-hover:text-[#8B5E3C] transition-colors">
                    {relProduct.name}
                  </h3>
                  <span className="text-gray-900 font-montserrat-bold mt-1">
                    {formatCurrency(relProduct.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailProduct;
