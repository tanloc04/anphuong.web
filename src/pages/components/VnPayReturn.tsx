import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

const VnPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Bóc tách các tham số VNPay trả về trên URL
  const responseCode = searchParams.get("vnp_ResponseCode");
  const transactionNo = searchParams.get("vnp_TransactionNo");
  const amountStr = searchParams.get("vnp_Amount");
  const orderInfo = searchParams.get("vnp_OrderInfo");

  // VNPay nhân số tiền lên 100 lần, nên lúc hiển thị mình phải chia lại cho 100
  const amount = amountStr ? parseInt(amountStr) / 100 : 0;

  // Mã '00' là giao dịch thành công
  const isSuccess = responseCode === "00";

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-24">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative">
        {/* Banner trên cùng */}
        <div
          className={`h-32 ${isSuccess ? "bg-green-500" : "bg-red-500"} relative`}
        >
          {/* Vòng tròn Icon */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
            <div
              className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center text-4xl shadow-lg ${isSuccess ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"}`}
            >
              <i className={`pi ${isSuccess ? "pi-check" : "pi-times"}`}></i>
            </div>
          </div>
        </div>

        {/* Nội dung chi tiết */}
        <div className="pt-14 pb-8 px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isSuccess ? "Thanh Toán Thành Công!" : "Thanh Toán Thất Bại"}
          </h2>
          <p className="text-gray-500 mb-8 text-sm">
            {isSuccess
              ? "Cảm ơn bạn đã mua sắm tại An Phương. Đơn hàng của bạn đang được xử lý."
              : "Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng thử lại sau."}
          </p>

          {/* Hóa đơn mini */}
          <div className="bg-gray-50 rounded-xl p-5 mb-8 text-left border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-500 text-sm">Mã giao dịch</span>
              <span className="font-semibold text-gray-800">
                {transactionNo || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-500 text-sm">Nội dung</span>
              <span
                className="font-semibold text-gray-800 text-right max-w-[150px] truncate"
                title={orderInfo || ""}
              >
                {orderInfo || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-300 mt-3">
              <span className="text-gray-600 font-medium">Số tiền</span>
              <span
                className={`text-lg font-bold ${isSuccess ? "text-green-600" : "text-gray-800"}`}
              >
                {formatCurrency(amount)}
              </span>
            </div>
          </div>

          {/* Nút điều hướng */}
          <div className="flex flex-col gap-3">
            {isSuccess ? (
              <Button
                label="Xem lịch sử đơn hàng"
                className="w-full h-12 rounded-xl font-bold !bg-[#c4a484] !border-none hover:!bg-[#a88b6e] transition-colors"
                onClick={() => navigate("/account/orders")} // Chỉnh lại đường dẫn lịch sử mua hàng của sếp
              />
            ) : (
              <Button
                label="Thử thanh toán lại"
                className="w-full h-12 rounded-xl font-bold !bg-red-500 !border-none hover:!bg-red-600 transition-colors"
                onClick={() => navigate("/cart")}
              />
            )}
            <Button
              label="Tiếp tục mua sắm"
              outlined
              className="w-full h-12 rounded-xl font-bold text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors"
              onClick={() => navigate("/pages/product")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VnPayReturn;
