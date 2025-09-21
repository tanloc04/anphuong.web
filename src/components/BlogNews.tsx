

const blogPosts = [
  {
    id: 1,
    title: "5 xu hướng nội thất 2024 không thể bỏ qua",
    excerpt:
      "Khám phá những xu hướng thiết kế nội thất mới nhất sẽ định hình không gian sống trong năm 2024.",
    date: "15/03/2024",
    category: "Xu hướng",
  },
  {
    id: 2,
    title: "Cách bố trí nội thất cho căn hộ nhỏ",
    excerpt:
      "Những mẹo thông minh để tối ưu hóa không gian và tạo cảm giác rộng rãi cho căn hộ có diện tích hạn chế.",
    date: "10/03/2024",
    category: "Mẹo hay",
  },
  {
    id: 3,
    title: "Phong thủy trong thiết kế nội thất hiện đại",
    excerpt:
      "Làm thế nào để kết hợp yếu tố phong thủy truyền thống với thiết kế nội thất hiện đại.",
    date: "05/03/2024",
    category: "Phong thủy",
  },
];

export function BlogNews() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-montserrat-bold text-gray-900 mb-4">
            Tin tức & Mẹo hay
          </h2>
          <p className="font-montserrat text-lg text-gray-600 max-w-2xl mx-auto">
            Cập nhật những xu hướng mới nhất và mẹo trang trí nội thất hữu ích
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Blog posts */}
          <div>
            <h3 className="font-montserrat-bold text-2xl  text-gray-900 mb-6">
              Bài viết mới nhất
            </h3>
            <div className="space-y-6">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="font-montserrat border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="inline-block px-3 py-1 text-sm text-white bg-[#c4a484] rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                  <h4 className="text-xl text-gray-900 mb-2 hover:text-[#c4a484] transition-colors duration-200">
                    {post.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="font-montserrat">
            <h3 className="text-2xl font-montserrat-semibold text-gray-900 mb-6">
              Câu hỏi thường gặp
            </h3>
            <div className="space-y-4">
              <details className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm group transition-all duration-300">
                <summary className="cursor-pointer font-montserrat-semibold text-gray-900 text-lg flex justify-between items-center">
                  <span>Thời gian bảo hành sản phẩm là bao lâu?</span>
                  <span className="transform transition-transform duration-300 group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed max-h-0 group-open:max-h-96 transition-all duration-500 ease-in-out overflow-hidden">
                  Tất cả sản phẩm nội thất của An Phương đều được bảo hành 2 năm
                  cho khung gỗ và 1 năm cho phụ kiện. Chúng tôi cũng cung cấp
                  dịch vụ bảo trì định kỳ để đảm bảo sản phẩm luôn trong tình
                  trạng tốt nhất.
                </p>
              </details>

              <details className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm group transition-all duration-300">
                <summary className="cursor-pointer font-montserrat-semibold text-gray-900 text-lg flex justify-between items-center">
                  <span>Có dịch vụ thiết kế và thi công trọn gói không?</span>
                  <span className="transform transition-transform duration-300 group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed max-h-0 group-open:max-h-96 transition-all duration-500 ease-in-out overflow-hidden">
                  Có, chúng tôi cung cấp dịch vụ thiết kế và thi công trọn gói từ
                  khâu khảo sát, thiết kế 3D, sản xuất đến lắp đặt hoàn thiện.
                  Đội ngũ kiến trúc sư và thợ thi công giàu kinh nghiệm sẽ đảm
                  bảo chất lượng công trình.
                </p>
              </details>

              <details className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm group transition-all duration-300">
                <summary className="cursor-pointer font-montserrat-semibold text-gray-900 text-lg flex justify-between items-center">
                  <span>Làm thế nào để đặt hàng và thanh toán?</span>
                  <span className="transform transition-transform duration-300 group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed max-h-0 group-open:max-h-96 transition-all duration-500 ease-in-out overflow-hidden">
                  Quý khách có thể đặt hàng qua website, điện thoại hoặc trực
                  tiếp tại showroom. Chúng tôi hỗ trợ nhiều hình thức thanh toán:
                  tiền mặt, chuyển khoản, thẻ tín dụng và trả góp 0% lãi suất.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}