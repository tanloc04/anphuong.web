import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { ColorPicker } from 'primereact/colorpicker';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';

import { getAllColors, createColor, createVariant, searchVariants, deleteVariant } from '../requests';
import type { IColor } from '../types';

interface VariationManagerProps {
    visible: boolean;
    product: any;
    onClose: () => void;
}

const VariationManager = ({ visible, product, onClose }: VariationManagerProps) => {
    const [colors, setColors] = useState<IColor[]>([]);
    const [selectedColor, setSelectedColor] = useState<IColor | null>(null);
    const [productVariants, setProductVariants] = useState<any[]>([]); 
    const [loading, setLoading] = useState(false);

    const [showCreateColor, setShowCreateColor] = useState(false);
    const [newColorName, setNewColorName] = useState("");
    const [newColorHex, setNewColorHex] = useState("000000");
    const [isCreatingColor, setIsCreatingColor] = useState(false);

    const toast = useRef<Toast>(null);

    const fetchProductVariants = async () => {
        if (!product?.id) return;
        setLoading(true);

        try {
            const res: any = await searchVariants(product.id);
            
            console.log("Check API Response:", res);
            const responseBody = res.data ? res.data : res;
            
            if (responseBody && responseBody.success && responseBody.data && responseBody.data.pageData) {
                setProductVariants(responseBody.data.pageData || []);
            } else {
                setProductVariants([]);
            }

        } catch(error: any) {
            console.error("Lỗi fetch:", error);
            setProductVariants([]);
        } finally {
            setLoading(false);
        }
    }

    const fetchColors = async () => {
        try {
            const res: any = await getAllColors();
            if (res.success && res.data) {
                setColors(res.data.pageData || []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (visible && product) {
            fetchColors();
            fetchProductVariants();
            setSelectedColor(null);
        }
    }, [visible, product]);

    const handleAddVariant = async () => {
        if (!selectedColor || !product) return;
        
        const isExist = productVariants.some((v: any) => v.colorId === selectedColor.id);
        
        if (isExist) {
            toast.current?.show({ severity: "warn", summary: "Đã tồn tại", detail: "Màu này đã được thêm rồi!" });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                productId: product.id,
                colorId: selectedColor.id
            };

            const res: any = await createVariant(payload);

            if (res.success) {
                toast.current?.show({ severity: "success", summary: "Thành công", detail: `Đã thêm màu ${selectedColor.name}` });
                setSelectedColor(null);
                await fetchProductVariants();
            } else {
                console.log(res.success);
                toast.current?.show({ severity: "error", summary: "Lỗi", detail: res.message || "Không thể thêm!" });
            }
        } catch(error: any) {
            const errorMsg = error.response?.data?.message || "Lỗi server!";
            toast.current?.show({ severity: "error", summary: "Lỗi", detail: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteVariant = (variant: any) => {
        const colorName = variant.color?.name || "màu này";
        
        confirmDialog({
            message: `Bạn có chắc muốn xóa "${colorName}" khỏi sản phẩm?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: () => handleDeleteVariant(variant)
        });
    };

    const handleDeleteVariant = async (variant: any) => {
        setLoading(true);
        try {
            const res: any = await deleteVariant(variant.id);
            if (res.success) {
                toast.current?.show({ severity: 'success', summary: 'Đã xóa', detail: 'Đã gỡ bỏ biến thể.' });
                await fetchProductVariants();
            } else {
                toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: res.message });
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa biến thể' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNewColor = async () => {
        if (!newColorName.trim()) {
            toast.current?.show({ severity: 'error', summary: 'Thiếu thông tin', detail: 'Vui lòng nhập tên màu!' });
            return;
        }
        setIsCreatingColor(true);
        try {
            let finalHex = newColorHex.startsWith('#') ? newColorHex : `#${newColorHex}`;
            const res: any = await createColor({ name: newColorName, hexCode: finalHex });
            if (res.success) {
                const createdColor = res.data;
                setColors(prev => [...prev, createdColor]);
                setSelectedColor(createdColor);
                toast.current?.show({ severity: "success", summary: "Tạo thành công", detail: "Đã thêm màu mới!" });
                setShowCreateColor(false);
                setNewColorName("");
                setNewColorHex("000000");
            } else {
                toast.current?.show({ severity: "error", summary: "Lỗi", detail: res.message || "Không thể tạo màu!" });
            }      
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Có lỗi xảy ra!' });
        } finally {
            setIsCreatingColor(false);
        }
    };

    const colorOptionTemplate = (option: IColor) => {
        return (
            <div className="flex align-items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: option.hexCode }}></div>
                <span>{option.name}</span>
            </div>
        );
    };

    const headerContent = (
        <div className="flex align-items-center gap-2">
            <div className="p-2 bg-purple-50 rounded-full"><i className="pi pi-palette text-purple-600 text-xl"></i></div>
            <div>
                <div className="font-bold text-gray-800">Quản lý Biến thể</div>
                <div className="text-xs text-gray-500 font-normal">Sản phẩm: <span className="text-purple-600 font-semibold">{product?.name}</span></div>
            </div>
        </div>
    );

    return (
        <>
            <Dialog header={headerContent} visible={visible} style={{ width: '650px', maxWidth: '95vw' }} onHide={onClose} modal className="p-fluid">
                <Toast ref={toast} />

                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-5 rounded-r flex align-items-start gap-3">
                    <i className="pi pi-info-circle text-blue-500 mt-1"></i>
                    <div className="text-sm text-blue-700">Thêm các phiên bản màu sắc cho sản phẩm này.</div>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 mb-4 shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Chọn màu sắc để thêm</label>
                    
                    <div className="flex gap-3">                       
                        <div className="p-inputgroup flex-1 h-3rem"> 
                            <Dropdown 
                                value={selectedColor} 
                                onChange={(e) => setSelectedColor(e.value)} 
                                options={colors} 
                                optionLabel="name" 
                                itemTemplate={colorOptionTemplate} 
                                valueTemplate={selectedColor ? colorOptionTemplate : undefined}
                                placeholder="-- Chọn màu từ danh sách --" 
                                className="w-full"
                                filter 
                                emptyMessage="Không tìm thấy màu nào." 
                                showClear
                            />
                            <Button 
                                icon="pi pi-plus" 
                                severity="secondary"
                                className="bg-white text-gray-600 border-gray-300"
                                tooltip="Không có màu bạn cần? Tạo mới ngay!" 
                                tooltipOptions={{ position: 'top' }}
                                onClick={() => setShowCreateColor(true)} 
                            />
                        </div>

                        <Button 
                            label="Thêm Biến Thể" 
                            icon="pi pi-check" 
                            className="w-auto px-4"
                            onClick={handleAddVariant} 
                            disabled={!selectedColor || loading} 
                            loading={loading} 
                        />
                    </div>
                </div>

                <div className="border rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50 px-4 py-3 border-b flex justify-content-between align-items-center">
                        <span className="font-bold text-gray-700 text-sm">Danh sách đang bán</span>
                        <Tag value={`${productVariants.length} màu`} severity="info"></Tag>
                    </div>
                    
                    <DataTable value={productVariants} size="small" emptyMessage="Chưa có màu nào." loading={loading} stripedRows rowHover>
                        <Column header="#" body={(data, options) => options.rowIndex + 1} style={{ width: '50px' }} className="text-center text-gray-500" />
                        
                        <Column 
                            header="Màu Sắc" 
                            body={(rowData) => {
                                const colorData = rowData.color || {}; 
                                const hex = colorData.hexCode || '#ccc';
                                const name = colorData.name || 'Chưa đặt tên';

                                return (
                                    <div className="flex align-items-center gap-3">
                                        <div 
                                            className="shadow-sm border-round-md"
                                            style={{ width: '32px', height: '32px', backgroundColor: hex, border: '1px solid #e5e7eb' }} 
                                        />
                                        <div>
                                            <div className="font-bold text-gray-800">{name}</div>
                                            <div className="text-xs text-gray-500 font-mono uppercase bg-gray-100 px-1 rounded inline-block">{hex}</div>
                                        </div>
                                    </div>
                                );
                            }} 
                        />
                        
                        <Column 
                            header="Thao tác" 
                            body={(rowData) => (
                                <Button icon="pi pi-trash" rounded text severity="danger" tooltip="Xóa biến thể này" onClick={() => confirmDeleteVariant(rowData)} />
                            )} 
                            style={{ width: '100px', textAlign: 'center' }} 
                        />
                    </DataTable>
                </div>
            </Dialog>
           
            <Dialog header="Tạo Màu Sắc Mới" visible={showCreateColor} style={{ width: '400px' }} onHide={() => setShowCreateColor(false)} footer={
                <div className="flex justify-content-end gap-2 pt-2">
                    <Button label="Hủy" icon="pi pi-times" text onClick={() => setShowCreateColor(false)} className="text-gray-600" />
                    <Button label="Lưu Màu" icon="pi pi-check" loading={isCreatingColor} onClick={handleCreateNewColor} />
                </div>
            }>
                <div className="flex flex-column gap-4 mt-2">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tên màu <span className="text-red-500">*</span></label>
                        <InputText value={newColorName} onChange={(e) => setNewColorName(e.target.value)} placeholder="Ví dụ: Xanh Navy..." className="w-full" autoFocus />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Mã màu (Hex)</label>
                        <div className="flex gap-3 align-items-center border p-3 rounded-lg bg-gray-50 hover:bg-white transition-colors border-gray-200">
                            <ColorPicker value={newColorHex} onChange={(e) => setNewColorHex(e.value as string)} />
                            <span className="font-mono text-lg text-gray-600 font-semibold tracking-wider">#{newColorHex}</span>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default VariationManager;