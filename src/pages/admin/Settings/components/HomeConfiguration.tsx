import React, { useState, useRef } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { Tag } from 'primereact/tag';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Toolbar } from 'primereact/toolbar';

const HomeConfiguration = () => {
    const toast = useRef<Toast>(null);

    const [carousels, setCarousels] = useState([
        { id: 1, title: 'Summer Sale 2025', image: 'https://primefaces.org/cdn/primereact/images/galleria/galleria1.jpg', link: '/category/sofa', order: 1, active: true },
        { id: 2, title: 'BST Bàn ăn mới', image: 'https://primefaces.org/cdn/primereact/images/galleria/galleria2.jpg', link: '/category/ban-an', order: 2, active: true },
    ]);
    const [carouselDialog, setCarouselDialog] = useState(false);

    const [homeModules, setHomeModules] = useState([
        { id: 1, title: 'Sản phẩm Bán Chạy', type: 'BEST_SELLER', itemCount: 8, active: true },
        { id: 2, title: 'Sofa Mới Về', type: 'NEW_ARRIVAL', itemCount: 4, active: true },
    ]);
    const [moduleDialog, setModuleDialog] = useState(false);

    const imageBodyTemplate = (rowData: any) => {
        return <img src={rowData.image} alt={rowData.title} className="w-6rem shadow-2 border-round" />;
    };

    const statusBodyTemplate = (rowData: any) => {
        return <Tag value={rowData.active ? 'Hiển thị' : 'Ẩn'} severity={rowData.active ? 'success' : 'warning'} />;
    };

    const actionBodyTemplate = () => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" rounded text severity="info" />
                <Button icon="pi pi-trash" rounded text severity="danger" />
            </div>
        );
    };

    const renderCarouselTab = () => (
        <div className="card">
            <Toolbar start={<div className="font-bold text-xl text-gray-800">Quản lý Slider Chính</div>} end={<Button label="Thêm Slide Mới" icon="pi pi-plus" onClick={() => setCarouselDialog(true)} />} />
            
            <DataTable value={carousels} className="mt-3" size="small" stripedRows>
                <Column field="order" header="TT" sortable style={{ width: '5rem' }} />
                <Column header="Hình ảnh" body={imageBodyTemplate} />
                <Column field="title" header="Tiêu đề / Mô tả" />
                <Column field="link" header="Đường dẫn (Link)" className="text-blue-600" />
                <Column header="Trạng thái" body={statusBodyTemplate} />
                <Column header="Thao tác" body={actionBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </DataTable>
        </div>
    );

    const renderProductModulesTab = () => (
        <div className="card">
            <div className="mb-4 p-3 bg-blue-50 border-round-md text-blue-700">
                <i className="pi pi-info-circle mr-2"></i>
                Tại đây bạn có thể cấu hình các <strong>kệ hàng (section)</strong> hiển thị ngoài trang chủ.
            </div>
            
            <Toolbar start={<div className="font-bold text-xl text-gray-800">Danh sách Module</div>} end={<Button label="Thêm Kệ Hàng" icon="pi pi-plus" severity="help" onClick={() => setModuleDialog(true)} />} />

            <div className="grid mt-3">
                {homeModules.map((module) => (
                    <div className="col-12 md:col-6 lg:col-4" key={module.id}>
                        <div className="surface-card p-4 shadow-2 border-round h-full flex flex-column justify-content-between relative overflow-hidden group">
                            <div>
                                <div className="flex justify-content-between align-items-center mb-3">
                                    <span className="text-xl font-bold text-900">{module.title}</span>
                                    <InputSwitch checked={module.active} />
                                </div>
                                <div className="text-600 mb-2">Loại: <Tag value={module.type} severity="info"></Tag></div>
                                <div className="text-600">Số lượng hiển thị: <strong>{module.itemCount} sản phẩm</strong></div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-3 border-top-1 surface-border">
                                <Button label="Chọn Sản Phẩm" icon="pi pi-list" className="flex-1" outlined size="small" />
                                <Button icon="pi pi-cog" className="p-button-secondary" outlined size="small" tooltip="Cấu hình" />
                                <Button icon="pi pi-trash" className="p-button-danger" outlined size="small" tooltip="Xóa module" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderBannerTab = () => (
        <div className="card text-center py-5">
            <div className="text-400 mb-3"><i className="pi pi-image text-6xl"></i></div>
            <h3>Tính năng đang phát triển</h3>
            <p className="text-gray-500">Nơi quản lý banner quảng cáo giữa trang, banner popup...</p>
        </div>
    );

    return (
        <div className="p-4">
            <Toast ref={toast} />
            
            <div className="flex align-items-center gap-2 mb-4">
                <i className="pi pi-cog text-3xl text-purple-600"></i>
                <div>
                    <h2 className="m-0 text-gray-800">Cấu hình Trang chủ</h2>
                    <span className="text-gray-500">Quản lý giao diện hiển thị cho người dùng cuối</span>
                </div>
            </div>

            <TabView>
                <TabPanel header="Carousel / Slider" leftIcon="pi pi-images mr-2">
                    {renderCarouselTab()}
                </TabPanel>
                <TabPanel header="Kệ Sản Phẩm (Modules)" leftIcon="pi pi-th-large mr-2">
                    {renderProductModulesTab()}
                </TabPanel>
                <TabPanel header="Banner Quảng Cáo" leftIcon="pi pi-megaphone mr-2">
                    {renderBannerTab()}
                </TabPanel>
            </TabView>

            <Dialog header="Thêm Slide Mới" visible={carouselDialog} style={{ width: '500px' }} onHide={() => setCarouselDialog(false)}>
                <div className="flex flex-column gap-3 mt-2">
                    <div className="border-2 border-dashed surface-border border-round p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <i className="pi pi-cloud-upload text-4xl text-gray-400 mb-2"></i>
                        <div className="font-semibold text-gray-600">Kéo thả hoặc chọn ảnh banner</div>
                        <div className="text-xs text-gray-400 mt-1">Khuyên dùng: 1920x600px</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tiêu đề (Alt text)</label>
                        <InputText className="w-full" placeholder="VD: Khuyến mãi mùa hè" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Đường dẫn khi click</label>
                        <InputText className="w-full" placeholder="VD: /products/sofa-giam-gia" />
                    </div>
                    <div className="flex gap-3">
                         <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Thứ tự</label>
                            <InputNumber value={1} className="w-full" showButtons min={1} />
                         </div>
                         <div className="flex-1 flex align-items-end mb-2">
                             <div className="flex align-items-center gap-2">
                                <InputSwitch checked={true} />
                                <span>Hiển thị ngay</span>
                             </div>
                         </div>
                    </div>
                    <Button label="Lưu Slide" icon="pi pi-check" onClick={() => setCarouselDialog(false)} />
                </div>
            </Dialog>

             <Dialog header="Tạo Kệ Hàng Mới" visible={moduleDialog} style={{ width: '500px' }} onHide={() => setModuleDialog(false)}>
                <div className="flex flex-column gap-3 mt-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tên hiển thị (Tiêu đề)</label>
                        <InputText className="w-full" placeholder="VD: Sofa Bán Chạy Nhất" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Loại nội dung</label>
                        <Dropdown 
                            options={[
                                {label: 'Sản phẩm mới nhất', value: 'NEW'},
                                {label: 'Sản phẩm bán chạy', value: 'BEST_SELLER'},
                                {label: 'Sản phẩm khuyến mãi', value: 'SALE'},
                                {label: 'Tự chọn (Thủ công)', value: 'MANUAL'}
                            ]} 
                            placeholder="Chọn loại hiển thị" 
                            className="w-full" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Số lượng hiển thị</label>
                        <InputNumber value={4} className="w-full" showButtons min={4} max={12} step={4} />
                    </div>
                    <Button label="Tạo Module" icon="pi pi-check" severity="help" onClick={() => setModuleDialog(false)} />
                </div>
            </Dialog>
        </div>
    );
};

export default HomeConfiguration;