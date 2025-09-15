import { useState, useEffect } from "react";

const tabs = ["history", "philosophy", "quality"];

export function BrandIntroduction() {
  const [activeTab, setActiveTab] = useState("history");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = tabs.indexOf(prev);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-montserrat-bold text-gray-900 mb-8">
              Về thương hiệu An Phương
            </h2>

            {/* Tab Buttons */}
            <div className="flex gap-4 border-b border-gray-200 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-3 px-4 text-lg font-montserrat transition-all duration-300 ${
                    activeTab === tab
                      ? "text-[#c4a484] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#c4a484]"
                      : "text-gray-500 hover:text-[#c4a484]"
                  }`}
                >
                  {tab === "history"
                    ? "Lịch sử"
                    : tab === "philosophy"
                    ? "Triết lý"
                    : "Chất lượng"}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="relative h-full">
              <div
                key={activeTab}
                className="transition-all duration-700 ease-in-out opacity-0 translate-x-10 animate-[fadeSlide_0.7s_ease-in-out_forwards]"
              >
                {activeTab === "history" && (
                  <p className="text-gray-700 font-dancing-script text-2xl leading-relaxed bg-white p-6 rounded-xl shadow-sm">
                    Được thành lập từ năm 2015, An Phương đã trở thành một trong
                    những thương hiệu nội thất uy tín tại Việt Nam. Chúng tôi bắt
                    đầu từ một xưởng nhỏ với niềm đam mê tạo ra những sản phẩm nội
                    thất chất lượng cao cho không gian sống hiện đại.
                  </p>
                )}
                {activeTab === "philosophy" && (
                  <p className="text-gray-700 font-dancing-script text-2xl leading-relaxed bg-white p-6 rounded-xl shadow-sm">
                    Triết lý thiết kế của chúng tôi tập trung vào sự tối giản và
                    tinh tế. Mỗi sản phẩm được tạo ra không chỉ để phục vụ chức
                    năng mà còn để mang lại cảm xúc và trải nghiệm sống tốt nhất
                    cho người sử dụng.
                  </p>
                )}
                {activeTab === "quality" && (
                  <p className="text-gray-700 font-dancing-script text-2xl leading-relaxed bg-white p-6 rounded-xl shadow-sm">
                    Chúng tôi cam kết sử dụng chỉ những vật liệu cao cấp nhất và
                    áp dụng quy trình sản xuất nghiêm ngặt. Mỗi sản phẩm đều được
                    kiểm tra kỹ lưỡng trước khi đến tay khách hàng, đảm bảo độ bền
                    và thẩm mỹ hoàn hảo.
                  </p>
                )}
              </div>
            </div>

          </div>

          <div className="relative">
            <img
              src="/home-page/AnPhuong.jpg"
              alt="Xưởng sản xuất An Phương"
              className="ml-12 w-5/6 h-auto rounded-2xl shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl object-cover"
            />
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeSlide {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </section>
  );
}