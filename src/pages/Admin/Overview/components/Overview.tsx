import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { useDarkMode } from "@/hooks/useDarkMode";

const Overview = () => {
  const { isDarkMode } = useDarkMode();

  const stats = [
    {
      title: "Doanh Thu",
      value: "120.040.200 đ",
      icon: "pi pi-dollar",
      color:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      sub: "+15% so với tháng trước",
      subColor:
        "text-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      title: "Đơn Hàng",
      value: "1.234",
      icon: "pi pi-shopping-cart",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      sub: "24 đơn mới hôm nay",
      subColor:
        "text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      title: "Khách Hàng",
      value: "5000",
      icon: "pi pi-users",
      color:
        "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      sub: "+180 users mới",
      subColor:
        "text-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400",
    },
    {
      title: "Sắp Hết Hàng",
      value: "12",
      icon: "pi pi-exclamation-triangle",
      color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      sub: "Cần nhập thêm",
      subColor: "text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Nguyễn Văn A",
      total: 2500000,
      status: "new",
      date: "2025-07-19",
    },
    {
      id: "ORD-002",
      customer: "Trần Thị B",
      total: 1200000,
      status: "processing",
      date: "2025-07-19",
    },
    {
      id: "ORD-003",
      customer: "Lê Văn C",
      total: 500000,
      status: "shipping",
      date: "2025-07-18",
    },
    {
      id: "ORD-004",
      customer: "Phạm Thị D",
      total: 3400000,
      status: "delivered",
      date: "2025-07-17",
    },
    {
      id: "ORD-005",
      customer: "Hoàng Văn E",
      total: 800000,
      status: "cancelled",
      date: "2025-07-16",
    },
  ];

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = window.getComputedStyle(document.documentElement);
    const textColor = isDarkMode ? "#e5e7eb" : "#4b5563";
    const textColorSecondary = isDarkMode ? "#9ca3af" : "#6b7280";
    const surfaceBorder = isDarkMode ? "#374151" : "#dfe7ef";

    const data = {
      labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7"],
      datasets: [
        {
          label: "Doanh thu (Triệu VNĐ)",
          backgroundColor: documentStyle.getPropertyValue("--blue-500"),
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          data: [65, 59, 80, 81, 56, 55, 40],
        },
        {
          label: "Chi phí",
          backgroundColor: documentStyle.getPropertyValue("--pink-500"),
          borderColor: documentStyle.getPropertyValue("--pink-500"),
          data: [28, 48, 40, 19, 86, 27, 90],
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: { color: textColor },
        },
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary, font: { weight: 500 } },
          grid: { display: false, drawBorder: false },
        },
        y: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [isDarkMode]);

  const statusBodyTemplate = (rowData: any) => {
    const statusMap: Record<
      string,
      {
        severity: "success" | "info" | "warning" | "danger" | null | undefined;
        value: string;
      }
    > = {
      new: { severity: "info", value: "Mới" },
      processing: { severity: "warning", value: "Đang xử lý" },
      shipping: { severity: "info", value: "Đang giao" },
      delivered: { severity: "success", value: "Hoàn thành" },
      cancelled: { severity: "danger", value: "Đã hủy" },
    };

    const status = statusMap[rowData.status];
    return <Tag value={status.value} severity={status.severity} />;
  };

  const priceBodyTemplate = (item: any) => {
    return item.total.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Tổng Quan Hệ Thống
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-700 flex flex-col justify-between hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                  {item.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {item.value}
                </h3>
              </div>
              <div className={`p-3 rounded-full ${item.color}`}>
                <i className={`${item.icon} text-xl`}></i>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span
                className={`font-medium px-2 py-0.5 rounded text-xs ${item.subColor}`}
              >
                <i className="pi pi-arrow-up text-xs mr-1"></i>
                {item.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Biểu đồ doanh thu
          </h3>
          <Chart
            type="bar"
            data={chartData}
            options={chartOptions}
            style={{ height: "300px" }}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Trạng thái đơn hàng
          </h3>
          <Chart
            type="doughnut"
            data={{
              labels: ["Hoàn thành", "Đang giao", "Hủy"],
              datasets: [
                {
                  data: [300, 50, 100],
                  backgroundColor: ["#22C55E", "#3B82F6", "#EF4444"],
                  hoverBackgroundColor: ["#16A34A", "#2563EB", "#DC2626"],
                  borderColor: isDarkMode ? "#1f2937" : "#ffffff",
                },
              ],
            }}
            options={{
              cutout: "60%",
              plugins: {
                legend: {
                  labels: { color: isDarkMode ? "#e5e7eb" : "#4b5563" },
                },
              },
            }}
            className="w-full flex justify-center"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            Đơn hàng mới nhất
          </h3>
          <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
            Xem tất cả
          </button>
        </div>

        <div className="card">
          <DataTable
            value={recentOrders}
            tableStyle={{ minWidth: "50rem" }}
            className="custom-datatable"
            rowClassName={() =>
              "dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            }
          >
            <Column
              field="id"
              header="Mã Đơn"
              className="font-medium dark:text-white"
              headerClassName="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            ></Column>
            <Column
              field="customer"
              header="Khách Hàng"
              className="dark:text-gray-300"
              headerClassName="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            ></Column>
            <Column
              field="date"
              header="Ngày đặt"
              className="dark:text-gray-300"
              headerClassName="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            ></Column>
            <Column
              field="total"
              header="Tổng tiền"
              body={priceBodyTemplate}
              className="dark:text-gray-300"
              headerClassName="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            ></Column>
            <Column
              field="status"
              header="Trạng thái"
              body={statusBodyTemplate}
              headerClassName="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            ></Column>
            <Column
              header="Thao tác"
              body={() => (
                <i className="pi pi-search text-gray-400 dark:text-gray-500 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"></i>
              )}
              headerClassName="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Overview;
