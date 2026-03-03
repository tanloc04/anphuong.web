import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import type { Product } from "@/@types/product.types";
import { formatCurrency } from "@/utils/format";

// Dummy data for testing
const dummyProduct: Product = {
  id: 1,
  name: "Kệ tivi hiện đại gỗ sồi cao cấp",
  description:
    "Kệ tivi được thiết kế hiện đại với chất liệu gỗ sồi cao cấp, có khả năng chống ước tốt. Phù hợp với các phòng khách có diện tích vừa và lớn. Sản phẩm có nhiều ngăn chứa tạo không gian gọn gàng và tinh tế cho phòng khách của bạn.",
  price: 8500000,
  discount: 15,
  material: "Gỗ sồi",
  longSize: 180,
  widthSize: 45,
  heightSize: 65,
  categoryId: 1,
  variationId: null,
  thumbnail:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
  image1:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  image2:
    "https://images.unsplash.com/photo-1550439062-1d5daa881006?w=800&q=80",
  image3:
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
  image4:
    "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80",
  stock: 15,
};

const dummyRelatedProducts: Product[] = [
  {
    id: 2,
    name: "Tủ quần áo 3 cánh trượt",
    description: "Tủ quần áo với 3 cánh trượt tiết kiệm không gian",
    price: 12000000,
    discount: 10,
    material: "Gỗ MDF",
    longSize: 150,
    widthSize: 50,
    heightSize: 200,
    categoryId: 1,
    variationId: null,
    thumbnail:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    image1:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    image2:
      "https://images.unsplash.com/photo-1550439062-1d5daa881006?w=800&q=80",
    image3:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
    image4:
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80",
    stock: 8,
  },
  {
    id: 3,
    name: "Ghế thư giãn bọc nỉ",
    description: "Ghế thư giãn với thiết kế ergonomic và bọc nỉ mềm mại",
    price: 5500000,
    discount: 0,
    material: "Nỉ",
    longSize: 80,
    widthSize: 85,
    heightSize: 90,
    categoryId: 1,
    variationId: null,
    thumbnail:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    image1:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    image2:
      "https://images.unsplash.com/photo-1550439062-1d5daa881006?w=800&q=80",
    image3:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
    image4:
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80",
    stock: 20,
  },
  {
    id: 4,
    name: "Đèn trang trí trần nhà",
    description:
      "Đèn trang trí với thiết kế hiện đại phù hợp với mọi không gian",
    price: 1800000,
    discount: 20,
    material: "Kính",
    longSize: 40,
    widthSize: 40,
    heightSize: 25,
    categoryId: 1,
    variationId: null,
    thumbnail:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    image1:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    image2:
      "https://images.unsplash.com/photo-1550439062-1d5daa881006?w=800&q=80",
    image3:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
    image4:
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80",
    stock: 0,
  },
];

const DetailProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toastRef = useRef<Toast>(null);

  // States
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string>("");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Fetch product detail
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Using dummy data for testing
        setProduct(dummyProduct);
        setMainImage(dummyProduct.image1 || dummyProduct.thumbnail);
        setRelatedProducts(dummyRelatedProducts);
        setLoading(false);

        // Uncomment below to use real API
        /*
        if (!id) return;
        const response = await productApi.getById(parseInt(id));
        const productData = response.data?.data || response.data;
        setProduct(productData);
        setMainImage(productData.image1 || productData.thumbnail);
        setLoading(false);

        // Fetch related products
        const relatedResponse = await productApi.search({
          searchCondition: { keyword: "", status: "", isDeleted: false },
          pageInfo: { pageNum: 1, pageSize: 4 },
        });
        const allProducts = relatedResponse.data?.data?.pageData || [];
        setRelatedProducts(
          allProducts
            .filter((p: Product) => p.id !== productData.id)
            .slice(0, 4),
        );
        */
      } catch (error) {
        console.error("Error fetching product:", error);
        toastRef.current?.show({
          severity: "error",
          summary: "Lỗi",
          detail: "Không thể tải sản phẩm",
          life: 3000,
        });
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      productId: product.id,
      productName: product.name,
      image: mainImage,
      price: product.price,
      discount: product.discount,
      quantity: quantity,
      stock: product.stock,
    };

    // Get existing cart from localStorage
    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];

    // Check if product already in cart
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
    <div className="flex items-center gap-1 md:gap-2 mb-4 md:mb-6 text-xs md:text-sm">
      <button
        onClick={() => navigate("/")}
        className="text-blue-600 hover:underline"
      >
        Trang chủ
      </button>
      <span className="text-gray-400">/</span>
      <button
        onClick={() => navigate("/products")}
        className="text-blue-600 hover:underline"
      >
        Sản phẩm
      </button>
      <span className="text-gray-400">/</span>
      <span className="text-gray-600 truncate">{product?.name}</span>
    </div>
  );

  const renderImageGallery = () => (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4">
      {/* Thumbnail list */}
      <div className="flex md:flex-col gap-2 order-2 md:order-1 w-full md:w-auto overflow-x-auto">
        {[
          product?.thumbnail,
          product?.image1,
          product?.image2,
          product?.image3,
          product?.image4,
        ]
          .filter(Boolean)
          .map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainImage(img || "")}
              className={`w-16 h-16 md:w-20 md:h-20 shrink-0 border-2 rounded-lg overflow-hidden transition ${
                mainImage === img ? "border-blue-500" : "border-gray-300"
              }`}
            >
              <img
                src={img}
                alt={`thumbnail-${idx}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
      </div>

      {/* Main image */}
      <div className="order-1 md:order-2 flex-1 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center h-64 md:h-96">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product?.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-gray-400">
            <i className="pi pi-image text-3xl md:text-5xl"></i>
          </div>
        )}
      </div>
    </div>
  );

  const calculateDiscountedPrice = () => {
    if (!product) return 0;
    return product.price * (1 - product.discount / 100);
  };

  const renderProductInfo = () => (
    <div className="space-y-4 md:space-y-6">
      {/* Product name */}
      <div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 line-clamp-3">
          {product?.name}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <i key={i} className="pi pi-star-fill text-sm"></i>
            ))}
          </div>
          <span className="text-sm text-gray-600">(120 đánh giá)</span>
        </div>
      </div>

      {/* Price section */}
      <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
        <div className="flex items-baseline gap-2 md:gap-3 flex-wrap">
          <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600">
            {formatCurrency(calculateDiscountedPrice())}
          </span>
          {product?.discount ? (
            <>
              <span className="text-lg text-gray-500 line-through">
                {formatCurrency(product.price)}
              </span>
              <Tag
                value={`-${product.discount}%`}
                severity="danger"
                className="text-sm"
              />
            </>
          ) : (
            <span className="text-lg text-gray-500">
              {formatCurrency(product?.price || 0)}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2 text-base md:text-lg">
          Mô tả ngắn
        </h3>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
          {product?.description}
        </p>
      </div>

      {/* Specifications */}
      <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">
          Kích thước & Thông số
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
          <div>
            <span className="text-gray-600">Chiều dài:</span>
            <p className="font-medium text-gray-900">{product?.longSize} cm</p>
          </div>
          <div>
            <span className="text-gray-600">Chiều rộng:</span>
            <p className="font-medium text-gray-900">{product?.widthSize} cm</p>
          </div>
          <div>
            <span className="text-gray-600">Chiều cao:</span>
            <p className="font-medium text-gray-900">
              {product?.heightSize} cm
            </p>
          </div>
          <div>
            <span className="text-gray-600">Chất liệu:</span>
            <p className="font-medium text-gray-900">{product?.material}</p>
          </div>
        </div>
      </div>

      {/* Stock status */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-gray-600 text-sm md:text-base">Tồn kho:</span>
        {product && product.stock > 0 ? (
          <Tag
            value={`${product.stock} sản phẩm`}
            severity="success"
            className="text-xs md:text-sm"
          />
        ) : (
          <Tag
            value="Hết hàng"
            severity="danger"
            className="text-xs md:text-sm"
          />
        )}
      </div>

      {/* Quantity & Add to cart */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-start md:items-center pt-3 md:pt-4 border-t">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">
            Số lượng:
          </span>
          <InputNumber
            value={quantity}
            onValueChange={(e) => setQuantity(e.value || 1)}
            min={1}
            max={product?.stock || 1}
            showButtons
            buttonLayout="horizontal"
            decrementButtonClassName="p-button-danger"
            incrementButtonClassName="p-button-success"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            className="w-full md:w-auto"
          />
        </div>
      </div>

      {/* Add to cart button */}
      <Button
        label="Thêm vào giỏ"
        icon="pi pi-shopping-cart"
        className="w-full p-2 md:p-3 text-base md:text-lg"
        onClick={handleAddToCart}
        disabled={!product || product.stock === 0}
        severity={product && product.stock === 0 ? "secondary" : "info"}
      />

      {/* Contact info */}
      <div className="bg-green-50 p-3 md:p-4 rounded-lg border border-green-200 text-xs md:text-sm">
        <div className="flex items-start gap-2">
          <i className="pi pi-phone text-green-600 mt-1 shrink-0"></i>
          <div className="min-w-0">
            <p className="font-medium text-green-900">Hỗ trợ khách hàng</p>
            <p className="text-green-800">
              Hotline: 1900.xxxx hoặc Chat với chúng tôi
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div>
            <Skeleton height="250px" borderRadius="12px" className="mb-4" />
            <div className="flex gap-2 flex-row">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  width="64px"
                  height="64px"
                  borderRadius="12px"
                />
              ))}
            </div>
          </div>
          <div className="space-y-3 md:space-y-4">
            <Skeleton height="40px" borderRadius="12px" />
            <Skeleton height="80px" borderRadius="12px" />
            <Skeleton height="40px" borderRadius="12px" />
            <Skeleton height="40px" borderRadius="12px" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Sản phẩm không tồn tại
          </h2>
          <Button
            label="Quay lại trang chủ"
            icon="pi pi-arrow-left"
            onClick={() => navigate("/")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-4 md:py-8">
      <Toast ref={toastRef} />

      <div className="container mx-auto px-2 md:px-4">
        {/* Breadcrumb */}
        {renderBreadcrumb()}

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 bg-white p-3 md:p-6 rounded-lg shadow-sm mb-4 md:mb-8">
          {/* Image gallery */}
          <div>{renderImageGallery()}</div>

          {/* Product info */}
          <div>{renderProductInfo()}</div>
        </div>

        {/* Tabs section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 md:mb-8">
          <TabView className="text-xs md:text-base">
            <TabPanel header="Mô tả sản phẩm" leftIcon="pi pi-file-text">
              <div className="p-3 md:p-6">
                <div className="prose prose-sm md:prose max-w-none text-gray-700 whitespace-pre-wrap text-xs md:text-sm">
                  {product.description}
                </div>
              </div>
            </TabPanel>

            <TabPanel header="Hướng dẫn chọn chất liệu" leftIcon="pi pi-book">
              <div className="p-3 md:p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                      Chất liệu: {product.material}
                    </h4>
                    <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                      Sản phẩm này được chế tạo từ{" "}
                      {product.material.toLowerCase()} chất lượng cao.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 md:p-4 rounded-lg text-xs md:text-sm text-blue-900">
                    <p className="font-medium mb-2">💡 Lưu ý:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
                      <li>Bảo quản ở nơi khô mát</li>
                      <li>Tránh tiếp xúc với bụi và ẩm ướt</li>
                      <li>Vệ sinh định kỳ bằng khăn mềm</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel header="Bảo hành - Bảo quản" leftIcon="pi pi-shield">
              <div className="p-3 md:p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                      Chính sách bảo hành
                    </h4>
                    <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                      <li>✓ Bảo hành 12 tháng từ ngày mua</li>
                      <li>✓ Đổi trả miễn phí trong 7 ngày</li>
                      <li>✓ Hỗ trợ sửa chữa vĩnh viễn</li>
                    </ul>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                      Hướng dẫn bảo quản
                    </h4>
                    <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                      <li>• Lau sạch bằng khăn mềm hàng tháng</li>
                      <li>• Tránh nước và ẩm độ cao</li>
                      <li>• Tránh ánh nắng trực tiếp quá lâu</li>
                      <li>• Sử dụng chất làm mới chuyên dụng nếu cần</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel header="Giao hàng - Lắp đặt" leftIcon="pi pi-truck">
              <div className="p-3 md:p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                      Dịch vụ giao hàng
                    </h4>
                    <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                      <li>🚚 Giao hàng toàn quốc trong 3-7 ngày</li>
                      <li>📦 Đóng gói chuyên nghiệp, an toàn</li>
                      <li>💳 Thanh toán linh hoạt (COD/CK)</li>
                      <li>📞 Hỗ trợ tracking theo dõi đơn hàng</li>
                    </ul>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                      Dịch vụ lắp đặt
                    </h4>
                    <p className="text-xs md:text-sm text-gray-700 mb-2">
                      Chúng tôi cung cấp dịch vụ lắp đặt miễn phí cho khách hàng
                      tại các thành phố lớn.
                    </p>
                    <p className="text-xs md:text-sm text-blue-600 font-medium">
                      Liên hệ: 1900.xxxx để đặt lịch lắp đặt
                    </p>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-3 md:p-6">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
              Các sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer flex flex-col"
                  onClick={() => navigate(`/product/${relProduct.id}`)}
                >
                  <div className="bg-gray-100 h-32 md:h-48 overflow-hidden flex items-center justify-center shrink-0">
                    <img
                      src={relProduct.thumbnail}
                      alt={relProduct.name}
                      className="w-full h-full object-cover hover:scale-110 transition"
                    />
                  </div>
                  <div className="p-2 md:p-4 flex-1 flex flex-col justify-between">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 md:mb-2 text-xs md:text-sm">
                      {relProduct.name}
                    </h3>
                    <div className="flex items-baseline gap-1 md:gap-2">
                      <span className="text-sm md:text-lg font-bold text-blue-600">
                        {formatCurrency(
                          relProduct.price * (1 - relProduct.discount / 100),
                        )}
                      </span>
                      {relProduct.discount > 0 && (
                        <Tag
                          value={`-${relProduct.discount}%`}
                          severity="danger"
                          className="text-xs"
                        />
                      )}
                    </div>
                  </div>
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
