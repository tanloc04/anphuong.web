import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { color, getComputedStyle } from 'framer-motion';

const Overview = () => {
  const stats = [
    { title: "Doanh Thu", value: "120.040.200 đ", icon: "pi pi-dollar", color: "bg-green-100 text-green-600", sub: "+15% so với tháng trước" },
    { title: "Đơn Hàng", value: "1.234", icon: "pi pi-shopping-cart", color: "bg-blue-100 text-blue-600", sub: "24 đơn mới hôm nay" },
    { title: "Khách Hàng", value: "5000", icon: "pi pi-users", color: "bg-orange-100 text-orange-600", sub: "+180 users mới" },
    { title: "Sắp Hết Hàng", value: "12", icon: "pi pi-exclamation-triangle", color: "bg-red-100 text-red-600", sub: "Cần nhập thêm" },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "Nguyễn Văn A", total: 2500000, status: "new", date: "2025-07-19" },
    { id: "ORD-001", customer: "Nguyễn Văn A", total: 2500000, status: "new", date: "2025-07-19" },
    { id: "ORD-001", customer: "Nguyễn Văn A", total: 2500000, status: "new", date: "2025-07-19" },
    { id: "ORD-001", customer: "Nguyễn Văn A", total: 2500000, status: "new", date: "2025-07-19" },
    { id: "ORD-001", customer: "Nguyễn Văn A", total: 2500000, status: "new", date: "2025-07-19" },
  ];

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = window.getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    const data = {
      labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7"],
      datasets: [
        {
          label: "Doanh thu (Triệu VNĐ)",
          backgroundColor: documentStyle.getPropertyValue("--blue-500"),
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          data: [65, 59, 80, 81, 56, 55, 40]
        },

        {
          label: "Chi phí",
          backgroundColor: documentStyle.getPropertyValue("--pink-500"),
          borderColor: documentStyle.getPropertyValue("--pink-500"),
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: { ticks: { color: textColorSecondary, font: { weight: 500 } }, grid: { display: false, drawBorder: false } },
        y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } }
      }
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  const statusBodyTemplate = (rowData: any) => {
    const statusMap: any = {
      new: { severity: "info", value: "Mới" },
      processing: { severity: "warning", value: "Đang xử lý" },
      shipping: { severity: "info", value: "Đang giao" },
      delivered: { severity: "success", value: "Hoàn thành" },
      cancelled: { severity: "danger", value: "Đã hủy" }
    };

    const status = statusMap[rowData.status];
    return <Tag value={status.value} severity={status.severity} />;
  };

  const priceBodyTemplate = (item: any) => {
    return item.total.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  return(
    <div className='p-4 bg-gray-50 min-h-screen'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>Tổng Quan Hệ Thống</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {stats.map((item, index) => (
          <div key={index} className='bg-white rounded-lg shadow-sm p-5 border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-gray-500 text-sm font-medium mb-1'>{item.title}</p>
                <h3 className='text-2xl font-bold text-gray-800'>{item.value}</h3>
              </div>
              <div className={`p-3 rounded-full ${item.color}`}>
                <i className={`${item.icon} text-xl`}></i>
              </div>
            </div>
            <div className='mt-4 flex items-center text-sm'>
              <span className='text-green-500 font-medium bg-green-50 px-2 py-0.5 rounded text-xs'>
                <i className='pi pi-arrow-up text-xs mr-1'></i>
                {item.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
        <div className='lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
          <h3 className='text-lg font-bold text-gray-800 mb-4'>Biểu đồ doanh thu</h3>
          <Chart type='bar' data={chartData} options={chartOptions} style={{ height: "300px" }}/>
        </div>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
          <h3 className='text-lg font-bold text-gray-800 mb-4'>Trạng thái đơn hàng</h3>
          <Chart type='doughnut'
            data={{
              labels: ['Hoàn thành', 'Đang giao', 'Hủy'],
              datasets: [{
                data: [300, 50, 100],
                backgroundColor: ['#22C55E', '#3B82F6', '#EF4444'],
                hoverBackgroundColor: ['#16A34A', '#2563EB', '#DC2626']
              }]
            }}
            options={{ cutout: '60%' }}
            className='w-full flex justify-center'/>
        </div>
      </div>

      <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-bold text-gray-800'>Đơn hàng mới nhất</h3>
          <button className='text-blue-600 text-sm font-medium hover:underline'>Xem tất cả</button>
        </div>
        <DataTable value={recentOrders} tableStyle={{ minWidth: '50rem' }}>
          <Column field='id' header='Mã Đơn' className='font-medium'></Column> 
          <Column field='customer' header='Khách Hàng'></Column> 
          <Column field='date' header='Ngày đặt'></Column> 
          <Column field='total' header='Tổng tiền' body={priceBodyTemplate}></Column> 
          <Column field='status' header='Trạng thái' body={statusBodyTemplate}></Column> 
          <Column header='Thao tác' body={() => (<i className='pi pi-search text-gray-400 cursor-pointer hover:text-blue-600'></i>)}></Column> 
        </DataTable>
      </div> 
    </div>
  )

}

export default Overview;