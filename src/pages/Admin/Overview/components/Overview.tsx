import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { useDarkMode } from "@/hooks/useDarkMode";
import { getStatusLabel, getStatusSeverity } from "@/utils/orderHelper";
import { formatCurrency, formatDate } from "@/utils/format";
import { useDashboardOverview } from "../hooks/useDashboardOverview";

const Overview = () => {
  const { isDarkMode } = useDarkMode();

  const {
    stats,
    chartData,
    chartOptions,
    doughnutData,
    recentOrders,
    isLoading,
  } = useDashboardOverview(isDarkMode);

  const statusBodyTemplate = (rowData: any) => {
    return (
      <Tag
        value={getStatusLabel(rowData.status)}
        severity={getStatusSeverity(rowData.status)}
        rounded
      />
    );
  };

  const priceBodyTemplate = (rowData: any) => {
    return (
      <span className="font-bold">{formatCurrency(rowData.totalPrice)}</span>
    );
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Tổng Quan Hệ Thống
      </h2>

      {/* Cụm 4 Thẻ Stats */}
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
                <i className="pi pi-bolt text-xs mr-1"></i>
                {item.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Biểu đồ Cột */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Doanh thu 7 ngày gần nhất
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <i className="pi pi-spin pi-spinner text-3xl text-blue-500"></i>
            </div>
          ) : (
            <Chart
              type="bar"
              data={chartData}
              options={chartOptions}
              style={{ height: "300px" }}
            />
          )}
        </div>

        {/* Biểu đồ Tròn */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Trạng thái đơn hàng
          </h3>
          <Chart
            type="doughnut"
            data={doughnutData}
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

      {/* Bảng Đơn hàng mới nhất */}
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
            loading={isLoading}
            emptyMessage="Chưa có đơn hàng nào"
            rowClassName={() =>
              "dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            }
          >
            <Column
              field="id"
              header="Mã Đơn"
              className="font-medium dark:text-white"
              headerClassName="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            />
            <Column
              header="Khách Hàng"
              body={(row) => row.customer?.fullname || "Khách vãng lai"}
              className="dark:text-gray-300"
              headerClassName="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            />
            <Column
              header="Ngày đặt"
              body={(row) => formatDate(row.createdAt)}
              className="dark:text-gray-300"
              headerClassName="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            />
            <Column
              header="Tổng tiền"
              body={priceBodyTemplate}
              className="dark:text-gray-300"
              headerClassName="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            />
            <Column
              header="Trạng thái"
              body={statusBodyTemplate}
              headerClassName="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Overview;
