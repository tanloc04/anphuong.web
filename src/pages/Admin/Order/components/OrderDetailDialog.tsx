import React, { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { formatCurrency, formatDate } from "@/utils/format";
import { getStatusSeverity, getStatusLabel } from "@/utils/orderHelper";
import type { OrderDetailProps } from "@/@types/order.types";
import { useReactToPrint } from "react-to-print";

const OrderDetailDialog = ({ visible, onHide, order }: OrderDetailProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Hoa_Don_DH_${order?.id || ""}`,
  });

  if (!order) return null;

  const productTemplate = (rowData: any) => (
    <div className="flex align-items-center gap-3">
      <Image
        src={rowData.variantImage || "/placeholder.png"}
        alt={rowData.productName}
        width="50"
        preview
        className="rounded-md overflow-hidden shadow-sm object-cover"
      />
      <div className="flex flex-col">
        <span className="font-medium text-sm text-gray-800">
          {rowData.productName}
        </span>
        <span className="text-xs text-gray-500 mt-0.5">
          Size: {rowData.finalLong}m x {rowData.finalWidth}m x{" "}
          {rowData.finalHeight}m
        </span>
        {rowData.isCustomized && (
          <Tag
            value="Hàng đặt riêng"
            className="text-[10px] w-fit mt-1"
            severity="warning"
          />
        )}
      </div>
    </div>
  );

  const priceTemplate = (rowData: any) =>
    formatCurrency(rowData.unitPrice * rowData.quantity);

  const renderFooter = () => (
    <div className="flex justify-end gap-2 pt-4">
      <Button
        label="Đóng"
        icon="pi pi-times"
        text
        onClick={onHide}
        className="!text-gray-500"
      />
      <Button
        label="In hóa đơn"
        icon="pi pi-print"
        severity="secondary"
        outlined
        onClick={handlePrint}
      />
    </div>
  );

  return (
    <Dialog
      header={`Chi tiết đơn hàng #${order.id}`}
      visible={visible}
      style={{ width: "95%", maxWidth: "900px" }}
      modal
      onHide={onHide}
      footer={renderFooter()}
      className="p-fluid"
    >
      {/* ================= GIAO DIỆN HIỂN THỊ TRÊN WEB (BÌNH THƯỜNG) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col gap-4 bg-gray-50 p-4 rounded-lg h-fit">
          <div>
            <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">
              Thông tin giao hàng
            </h4>
            <p className="text-sm mb-2">
              <i className="pi pi-user mr-2 text-purple-600"></i>
              <span className="font-medium">
                {order.receiverName || order.customer?.fullname}
              </span>
            </p>
            <p className="text-sm mb-2">
              <i className="pi pi-phone mr-2 text-purple-600"></i>
              {order.receiverPhone || order.customer?.phone}
            </p>
            <p className="text-sm mb-2">
              <i className="pi pi-envelope mr-2 text-purple-600"></i>
              {order.customer?.email ? (
                order.customer.email
              ) : (
                <span className="text-gray-400 italic text-xs">
                  Chưa cập nhật email
                </span>
              )}
            </p>
            <p className="text-sm flex items-start">
              <i className="pi pi-map-marker mr-2 text-purple-600 mt-1"></i>
              <span className="leading-relaxed">
                {order.shippingAddress || order.customer?.customerAddress || (
                  <span className="text-gray-400 italic text-xs">
                    Chưa cập nhật địa chỉ
                  </span>
                )}
              </span>
            </p>
          </div>

          <Divider className="my-2" />

          <div>
            <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">
              Thông tin đơn hàng
            </h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-500">
                Trạng thái hiện tại:
              </span>
              <Tag
                value={getStatusLabel(order.status)}
                severity={getStatusSeverity(order.status)}
                className="text-base py-2 w-fit"
              />
              <p className="text-xs text-gray-500 mt-2 italic">
                Ngày đặt: {formatDate(order.createdAt)}
              </p>
              <p className="text-xs text-gray-500 italic">
                Thanh toán:{" "}
                <span className="font-semibold">
                  {order.paymentMethod === 0
                    ? "Tiền mặt (COD)"
                    : "Chuyển khoản"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-bold text-gray-800 mb-3">
            Danh sách sản phẩm ({order.orderDetails?.length || 0})
          </h4>
          <DataTable
            value={order.orderDetails}
            scrollable
            scrollHeight="400px"
            size="small"
            stripedRows
            showGridlines
            emptyMessage="Không có sản phẩm nào."
          >
            <Column
              header="Sản phẩm"
              body={productTemplate}
              style={{ minWidth: "200px" }}
            ></Column>
            <Column
              field="quantity"
              header="SL"
              align="center"
              style={{ width: "60px" }}
            ></Column>
            <Column
              header="Đơn giá"
              body={(row) => formatCurrency(row.unitPrice)}
              align="right"
              style={{ width: "100px" }}
            ></Column>
            <Column
              header="Thành tiền"
              body={priceTemplate}
              align="right"
              style={{ width: "120px" }}
              className="font-bold text-purple-700"
            ></Column>
          </DataTable>

          <div className="flex justify-end mt-4 text-right">
            <div className="bg-purple-50 p-4 rounded-lg min-w-[250px] border border-purple-100 shadow-sm">
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>Tạm tính:</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>Phí vận chuyển:</span>
                <span>0 ₫</span>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between font-black text-lg text-purple-700">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= KHU VỰC ẨN: GIAO DIỆN CHUẨN ĐỂ IN RA GIẤY A4 ================= */}
      <div className="hidden">
        <div
          ref={printRef}
          className="p-8 text-black bg-white"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          {/* Header Cửa hàng */}
          <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold uppercase mb-1">
                Nội Thất An Phương
              </h2>
              <p className="text-sm">
                Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
              </p>
              <p className="text-sm">Điện thoại: 0909.123.456</p>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold mb-2 uppercase">
                Hóa Đơn Bán Hàng
              </h1>
              <p className="text-sm font-semibold">Mã đơn: #{order.id}</p>
              <p className="text-sm">
                Ngày in: {new Date().toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          {/* Thông tin khách hàng */}
          <div className="mb-6">
            <p className="mb-1">
              <span className="font-semibold w-32 inline-block">
                Khách hàng:
              </span>{" "}
              {order.receiverName || order.customer?.fullname}
            </p>
            <p className="mb-1">
              <span className="font-semibold w-32 inline-block">
                Điện thoại:
              </span>{" "}
              {order.receiverPhone || order.customer?.phone}
            </p>
            <p className="mb-1">
              <span className="font-semibold w-32 inline-block">Địa chỉ:</span>{" "}
              {order.shippingAddress || order.customer?.customerAddress}
            </p>
            <p className="mb-1">
              <span className="font-semibold w-32 inline-block">
                Ngày đặt hàng:
              </span>{" "}
              {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Bảng sản phẩm chuẩn HTML để in */}
          <table className="w-full mb-6 border-collapse border border-gray-800 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-800 p-2 text-center w-12">
                  STT
                </th>
                <th className="border border-gray-800 p-2 text-left">
                  Tên sản phẩm
                </th>
                <th className="border border-gray-800 p-2 text-center w-24">
                  Kích thước
                </th>
                <th className="border border-gray-800 p-2 text-center w-16">
                  SL
                </th>
                <th className="border border-gray-800 p-2 text-right w-32">
                  Đơn giá
                </th>
                <th className="border border-gray-800 p-2 text-right w-32">
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody>
              {order.orderDetails?.map((item: any, index: number) => (
                <tr key={item.id}>
                  <td className="border border-gray-800 p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-800 p-2">
                    <div className="font-semibold">{item.productName}</div>
                    {item.isCustomized && (
                      <div className="text-[10px] italic">Hàng đặt riêng</div>
                    )}
                  </td>
                  <td className="border border-gray-800 p-2 text-center text-xs">
                    {item.finalLong} x {item.finalWidth} x {item.finalHeight}
                  </td>
                  <td className="border border-gray-800 p-2 text-center">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-800 p-2 text-right">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="border border-gray-800 p-2 text-right font-semibold">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tổng kết tiền */}
          <div className="flex justify-end mb-12">
            <div className="w-1/2">
              <div className="flex justify-between border-b border-gray-300 py-1">
                <span>Tạm tính:</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 py-1">
                <span>Phí vận chuyển:</span>
                <span>0 ₫</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-bold">
                <span>TỔNG CỘNG:</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Chữ ký */}
          <div className="flex justify-between px-12 text-center">
            <div>
              <p className="font-bold mb-16">Người mua hàng</p>
              <p className="italic text-sm">(Ký, ghi rõ họ tên)</p>
            </div>
            <div>
              <p className="font-bold mb-16">Người bán hàng</p>
              <p className="italic text-sm">(Ký, đóng dấu)</p>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default OrderDetailDialog;
