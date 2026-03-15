import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/api/orderApi";
import { productApi } from "@/api/productApi";
import { formatCurrency } from "@/utils/format";

export const useDashboardOverview = (isDarkMode: boolean) => {
  const { data: queryData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ["revenueOverview"],
    queryFn: () =>
      orderApi.getRevenue({
        searchCondition: { isTotalPrice: true, isDeleted: false },
        pageInfo: { pageNum: 1, pageSize: 1000 },
      }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: lowStockCount = 0, isLoading: isLoadingLowStock } = useQuery({
    queryKey: ["lowStockCount"],
    queryFn: () => productApi.getLowStockCount(5), // Ngưỡng mặc định là 5
  });

  const realData = queryData?.data?.data || queryData?.data || queryData || {};

  const orders = useMemo(() => {
    return realData?.orders || realData?.Orders || [];
  }, [realData]);

  const totalRevenue = realData?.totalPrice || realData?.TotalPrice || 0;
  const totalOrders = realData?.totalItems || realData?.TotalItems || 0;

  const uniqueCustomers = useMemo(() => {
    const ids = new Set(orders.map((o: any) => o.customerId).filter(Boolean));
    return ids.size;
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [orders]);

  const stats = useMemo(
    () => [
      {
        title: "Doanh Thu",
        value: isLoadingRevenue ? "..." : formatCurrency(totalRevenue),
        icon: "pi pi-dollar",
        color:
          "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
        sub: "Cập nhật real-time",
        subColor:
          "text-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
      },
      {
        title: "Đơn Hàng",
        value: isLoadingRevenue ? "..." : totalOrders,
        icon: "pi pi-shopping-cart",
        color:
          "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        sub: "Tổng số đơn hệ thống",
        subColor:
          "text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
      },
      {
        title: "Khách Hàng",
        value: isLoadingRevenue ? "..." : uniqueCustomers,
        icon: "pi pi-users",
        color:
          "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
        sub: "Khách hàng duy nhất",
        subColor:
          "text-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400",
      },
      {
        title: "Sắp Hết Hàng",
        value: isLoadingLowStock ? "..." : lowStockCount,
        icon: "pi pi-exclamation-triangle",
        color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
        sub: "Cần nhập thêm",
        subColor: "text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
        route: "/admin/products",
      },
    ],
    [
      isLoadingRevenue,
      isLoadingLowStock,
      totalRevenue,
      totalOrders,
      uniqueCustomers,
      lowStockCount,
    ],
  );

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [doughnutData, setDoughnutData] = useState({});

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    const documentStyle = window.getComputedStyle(document.documentElement);
    const textColor = isDarkMode ? "#e5e7eb" : "#4b5563";
    const textColorSecondary = isDarkMode ? "#9ca3af" : "#6b7280";
    const surfaceBorder = isDarkMode ? "#374151" : "#dfe7ef";

    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    });

    const revenueByDay = new Array(7).fill(0);
    let completed = 0,
      shipping = 0,
      cancelled = 0;

    orders.forEach((o: any) => {
      if (o.status === 3) completed++;
      else if (o.status === 2) shipping++;
      else if (o.status === 4) cancelled++;

      if (o.status !== 4) {
        const dateStr = new Date(o.createdAt).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        });
        const index = last7Days.indexOf(dateStr);
        if (index !== -1) revenueByDay[index] += o.totalPrice;
      }
    });

    setChartData({
      labels: last7Days,
      datasets: [
        {
          label: "Doanh thu (VNĐ)",
          backgroundColor: documentStyle.getPropertyValue("--blue-500"),
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          data: revenueByDay,
        },
      ],
    });

    setChartOptions({
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: { legend: { labels: { color: textColor } } },
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
    });

    setDoughnutData({
      labels: ["Hoàn thành", "Đang giao", "Hủy"],
      datasets: [
        {
          data: [completed, shipping, cancelled],
          backgroundColor: ["#22C55E", "#3B82F6", "#EF4444"],
          hoverBackgroundColor: ["#16A34A", "#2563EB", "#DC2626"],
          borderColor: isDarkMode ? "#1f2937" : "#ffffff",
        },
      ],
    });
  }, [isDarkMode, orders]);

  return {
    stats,
    chartData,
    chartOptions,
    doughnutData,
    recentOrders,
    isLoading: isLoadingRevenue || isLoadingLowStock,
  };
};
