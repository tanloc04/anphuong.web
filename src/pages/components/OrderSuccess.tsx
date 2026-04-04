import React from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm text-center transform transition-all animate-fade-in-up">
        {/* Icon check mark xanh lá siêu bự */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
          <i className="pi pi-check text-5xl text-green-500"></i>
        </div>

        <h2 className="text-3xl font-montserrat-bold text-gray-900 mb-4">
          Đặt Hàng Thành Công!
        </h2>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Cảm ơn bạn đã mua sắm tại{" "}
          <span className="font-bold text-[#8B5E3C]">An Phương</span>. Đơn hàng
          của bạn đã được ghi nhận và đang trong quá trình xử lý. Chúng tôi sẽ
          sớm liên hệ để giao hàng cho bạn.
        </p>

        <div className="flex flex-col gap-3">
          {/* Nút xem lịch sử đơn hàng (Anh em mình sẽ làm sau) */}
          <Button
            label="Xem lịch sử đơn hàng"
            icon="pi pi-list"
            className="w-full p-3 font-semibold text-[#8B5E3C] bg-[#FAF6F3] border-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white transition-colors"
            outlined
            onClick={() => navigate("/account/profile")}
          />

          <Button
            label="Tiếp tục mua sắm"
            icon="pi pi-shopping-bag"
            className="w-full p-3 font-semibold bg-[#8B5E3C] border-none hover:bg-[#724C31] transition-colors"
            onClick={() => navigate("/pages/product")}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
