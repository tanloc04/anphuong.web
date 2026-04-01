import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { useProductDetail, useProducts } from "@/pages/Admin/Product/hooks";
import { formatCurrency } from "@/utils/format";
import { useAuth } from "@/context/auth.context";
import { cartApi } from "@/api/cartApi";
import { useQueryClient } from "@tanstack/react-query";

const DetailProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toastRef = useRef<Toast>(null);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const productId = id ? parseInt(id, 10) : null;

  const {
    data: product,
    isLoading: loadingProduct,
    isError,
  } = useProductDetail(productId);

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

  const relatedProducts = (relatedData?.pageData || [])
    .filter((p: any) => p.id !== productId)
    .slice(0, 4);

  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string>("");

  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (product) {
      const firstImage =
        product.thumbnail ||
        product.detailImage?.image1 ||
        "/placeholder-product.jpg";
      setMainImage(firstImage);
      setQuantity(1);

      // Mặc định CHƯA chọn biến thể nào (để hiện giá gốc).
      // Hoặc sếp có thể set chọn biến thể đầu tiên: setSelectedVariant(product.variants?.[0] || null);
      setSelectedVariant(null);
    }
  }, [product]);

  const currentPrice = selectedVariant
    ? selectedVariant.price
    : product?.price || 0;
  const currentStock = selectedVariant
    ? selectedVariant.inventory?.quantityInStock ||
      selectedVariant.quantityInStock ||
      0
    : product?.totalStock || 0;

  const calculateDiscountedPrice = () => {
    if (!product) return 0;
    // Vẫn áp dụng % discount của sản phẩm gốc lên giá của biến thể
    return currentPrice * (1 - (product.discount || 0) / 100);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    // 1. Kiểm tra khách đã chọn Phân loại chưa (nếu sản phẩm có biến thể)
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toastRef.current?.show({
        severity: "warn",
        summary: "Thiếu thông tin",
        detail:
          "Vui lòng chọn Phân loại / Màu sắc trước khi thêm vào giỏ hàng!",
        life: 3000,
      });
      return;
    }

    // 2. Chuẩn bị giỏ đồ (Payload)
    const payload = {
      productId: product.id,
      variantId: selectedVariant ? selectedVariant.id : null,
      quantity: quantity,

      // Mấy trường này mình lưu thêm nếu xài LocalStorage để show UI cho đẹp
      // Backend sẽ tự ignore mấy trường dư thừa này nếu ko có trong request DTO
      productName: product.name,
      productImage: selectedVariant?.variantImage || product.thumbnail,
      price: product.price,
      variantDisplay: selectedVariant?.color?.name || "Mặc định",
      maxStock: selectedVariant?.inventory?.quantityInStock || 999,
    };

    // 3. CHIA LUỒNG: ĐÃ ĐĂNG NHẬP VS VÃNG LAI
    if (isAuthenticated) {
      // LUỒNG 1: Gọi API thẳng xuống Database
      try {
        await cartApi.addToCart({
          productId: payload.productId,
          variantId: payload.variantId,
          quantity: payload.quantity,
        });

        toastRef.current?.show({
          severity: "success",
          detail: "Đã thêm vào giỏ hàng!",
        });

        // TODO: Gọi hàm báo hiệu cho Header cập nhật số lượng (Làm ở bước sau)
        queryClient.invalidateQueries({ queryKey: ["cart-data"] });
      } catch (error) {
        toastRef.current?.show({
          severity: "error",
          detail: "Lỗi khi thêm vào giỏ hàng!",
        });
      }
    } else {
      // LUỒNG 2: Lưu vào LocalStorage cho khách vãng lai
      try {
        const localCartStr = localStorage.getItem("cart");
        let localCart = localCartStr ? JSON.parse(localCartStr) : [];

        // Kiểm tra xem món này có trong giỏ local chưa
        const existingItemIndex = localCart.findIndex(
          (item: any) =>
            item.productId === payload.productId &&
            item.variantId === payload.variantId,
        );

        if (existingItemIndex !== -1) {
          localCart[existingItemIndex].quantity += payload.quantity; // Cộng dồn
        } else {
          localCart.push(payload); // Thêm mới
        }

        localStorage.setItem("cart", JSON.stringify(localCart));
        toastRef.current?.show({
          severity: "success",
          detail: "Đã thêm vào giỏ hàng!",
        });

        // TODO: Dispatch event để báo Header update (Làm ở bước sau)
        window.dispatchEvent(new Event("localCartUpdated"));
      } catch (error) {
        console.error("Lỗi LocalStorage", error);
      }
    }
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
    // 1. Lấy ảnh gốc
    const baseImages = [
      product?.thumbnail,
      product?.detailImage?.image1,
      product?.detailImage?.image2,
      product?.detailImage?.image3,
      product?.detailImage?.image4,
    ];

    // 2. Lấy thêm ảnh của tất cả các biến thể
    const variantImages = (product?.variants || []).map(
      (v: any) => v.variantImage,
    );

    // 3. Gom lại và lọc trùng lặp + lọc null
    const allImages = [...baseImages, ...variantImages].filter(Boolean);
    const uniqueImages = Array.from(new Set(allImages));

    // 👇 Cắt đúng 4 ảnh để hiển thị dựa theo state startIndex
    const visibleImages = uniqueImages.slice(
      thumbnailStartIndex,
      thumbnailStartIndex + 4,
    );

    return (
      <div className="flex flex-col md:flex-row gap-4">
        {/* CỘT THUMBNAILS (BÊN TRÁI) */}
        <div className="flex md:flex-col gap-2 order-2 md:order-1 w-full md:w-24">
          {/* Nút UP (Chỉ hiện ở Desktop nếu tổng số ảnh > 4) */}
          {uniqueImages.length > 4 && (
            <button
              onClick={() =>
                setThumbnailStartIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={thumbnailStartIndex === 0}
              className={`hidden md:flex items-center justify-center w-full py-1.5 bg-gray-50 hover:bg-gray-200 text-gray-500 rounded-sm transition-all ${
                thumbnailStartIndex === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <i className="pi pi-chevron-up text-xs font-bold"></i>
            </button>
          )}

          {/* Danh sách 4 ảnh đang hiển thị */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-hidden scroll-smooth hide-scrollbar">
            {visibleImages.map((img, idx) => {
              // Lấy index thật để truyền vào key
              const realIdx = thumbnailStartIndex + idx;
              return (
                <button
                  key={realIdx}
                  onClick={() => setMainImage(img as string)}
                  className={`w-20 h-20 md:w-24 md:h-24 shrink-0 border-2 rounded-sm overflow-hidden transition-all duration-300 ${
                    mainImage === img
                      ? "border-[#8B5E3C] opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img as string}
                    alt={`thumbnail-${realIdx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>

          {/* Nút DOWN (Chỉ hiện ở Desktop nếu tổng số ảnh > 4) */}
          {uniqueImages.length > 4 && (
            <button
              onClick={() =>
                setThumbnailStartIndex((prev) =>
                  Math.min(uniqueImages.length - 4, prev + 1),
                )
              }
              disabled={thumbnailStartIndex >= uniqueImages.length - 4}
              className={`hidden md:flex items-center justify-center w-full py-1.5 bg-gray-50 hover:bg-gray-200 text-gray-500 rounded-sm transition-all ${
                thumbnailStartIndex >= uniqueImages.length - 4
                  ? "opacity-30 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <i className="pi pi-chevron-down text-xs font-bold"></i>
            </button>
          )}
        </div>

        {/* ẢNH CHÍNH LỚN */}
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

  const renderProductInfo = () => (
    <div className="space-y-6 font-montserrat">
      {/* Tên sản phẩm */}
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-2xl md:text-4xl font-montserrat-bold text-gray-900 mb-3">
          {product?.name}
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`pi text-sm mr-1 ${
                    star <= (product?.averageRating || 0)
                      ? "pi-star-fill" // Tô vàng nếu <= số sao thật
                      : "pi-star text-gray-300" // Sao rỗng (xám) nếu chưa đạt
                  }`}
                ></i>
              ))}
            </div>
            {/* Hiển thị số lượng review nếu có */}
            <span className="text-gray-500 text-xs mt-0.5">
              {product?.totalReviews > 0
                ? `(${product?.totalReviews} đánh giá)`
                : "(Chưa có đánh giá)"}
            </span>
          </div>

          <span className="text-gray-400">|</span>
          <span className="text-gray-500 font-montserrat-medium">
            SKU: AP-{product?.id.toString().padStart(4, "0")}
          </span>
        </div>
      </div>

      {/* GIÁ TIỀN (Đã được làm cho nhảy tự động theo Variant) */}
      <div className="py-2">
        <div className="flex items-baseline gap-4 flex-wrap">
          <span className="text-3xl md:text-4xl font-montserrat-bold text-gray-900">
            {formatCurrency(calculateDiscountedPrice())}
          </span>
          {product?.discount > 0 && (
            <>
              <span className="text-xl text-gray-400 line-through font-montserrat-medium">
                {formatCurrency(currentPrice)}
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
              {product?.longSize} m
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">Chiều rộng</span>
            <span className="font-montserrat-semibold text-gray-900">
              {product?.widthSize} m
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">Chiều cao</span>
            <span className="font-montserrat-semibold text-gray-900">
              {product?.heightSize} m
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

      {product?.variants && product.variants.length > 0 && (
        <div className="pt-4">
          <h3 className="text-gray-800 font-montserrat-semibold mb-3">
            Phân loại / Màu sắc:
          </h3>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((v: any) => {
              // Hứng số lượng tồn kho của biến thể này
              const variantStock =
                v.inventory?.quantityInStock || v.quantityInStock || 0;
              // Lấy tên hiển thị: Ưu tiên Tên màu -> Tên chất liệu -> Mã SKU -> Biến thể ID
              const displayName =
                v.color?.name ||
                v.material?.name ||
                v.sku ||
                `Biến thể ${v.id}`;

              return (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVariant(v);
                    if (v.variantImage) setMainImage(v.variantImage);
                    setQuantity(1);
                  }}
                  className={`flex items-center gap-2 border px-3 py-2 rounded-sm transition-all ${
                    selectedVariant?.id === v.id
                      ? "border-[#8B5E3C] bg-[#8B5E3C]/5 text-[#8B5E3C] ring-1 ring-[#8B5E3C]"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  } ${variantStock === 0 ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
                  disabled={variantStock === 0}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                    style={{
                      // Đổ mã màu hex vào đây, nếu không có thì để nền xám nhạt
                      backgroundColor: v.color?.hexCode || "#f3f4f6",
                      // Tạo viền nét đứt nếu không có mã màu để người dùng dễ phân biệt
                      borderStyle: v.color?.hexCode ? "solid" : "dashed",
                    }}
                  ></div>

                  <span className="text-sm font-medium">{displayName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Trạng thái tồn kho (Đã nhảy số theo Variant) */}
      <div className="flex items-center gap-3">
        <span className="text-gray-600 font-montserrat-medium">
          Tình trạng:
        </span>
        {currentStock > 0 ? (
          <span className="text-green-600 font-montserrat-bold bg-green-50 px-3 py-1 rounded-sm text-sm">
            Còn hàng ({currentStock})
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
            disabled={quantity <= 1 || currentStock === 0}
          />
          <div className="flex-1 flex items-center justify-center font-montserrat-semibold text-gray-900 border-x border-gray-100 h-full">
            {quantity}
          </div>
          <Button
            icon="pi pi-plus"
            className="p-button-text text-gray-600 hover:bg-gray-100 w-12 h-full flex items-center justify-center border-none rounded-none"
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            disabled={
              !product || quantity >= currentStock || currentStock === 0
            }
          />
        </div>

        <Button
          label="THÊM VÀO GIỎ HÀNG"
          icon="pi pi-shopping-bag"
          className="flex-1 h-12 bg-[#8B5E3C] border-none hover:bg-[#724C31] text-white font-montserrat-semibold uppercase tracking-widest px-6 rounded-sm transition-colors shadow-sm"
          onClick={handleAddToCart} // Sếp nhớ update lại hàm này để lưu thêm selectedVariant.id nhé
          disabled={
            !product ||
            currentStock === 0 ||
            (product?.variants?.length > 0 && !selectedVariant)
          } // Bắt buộc chọn biến thể mới cho Add
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
