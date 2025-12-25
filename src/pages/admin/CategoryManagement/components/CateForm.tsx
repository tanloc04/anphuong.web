import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import Modal from '../../Modal';
import type { ICategory } from '../types';

interface CateFormProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: any) => void;
    initialData?: ICategory | null;
    loading?: boolean;
}

interface IFormInput {
    name: string;
    description: string;
}

const CateForm = ({ visible, onHide, onSave, initialData, loading }: CateFormProps) => {
    
    const formTitle = initialData ? "Cập nhật danh mục" : "Thêm mới danh mục";

    const { control, handleSubmit, reset, formState: { errors } } = useForm<IFormInput>({
        defaultValues: { name: '', description: '' }
    });

    useEffect(() => {
        if (visible) {
            reset({
                name: initialData?.name || '',
                description: initialData?.description || ''
            });
        }
    }, [visible, initialData, reset]);

    return (
        <Modal 
            isOpen={visible} 
            onClose={onHide} 
            title={formTitle}
        >
            <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-bold text-gray-700">
                        Tên danh mục <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: 'Vui lòng nhập tên danh mục' }}
                        render={({ field, fieldState }) => (
                            <InputText 
                                id={field.name} 
                                {...field} 
                                className={classNames({ 'p-invalid': fieldState.invalid }, 'w-full p-3 border rounded-md')} 
                                placeholder="Nhập tên..."
                            />
                        )}
                    />
                    {errors.name && <small className="text-red-500 text-sm">{errors.name.message}</small>}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="font-bold text-gray-700">Mô tả</label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <InputTextarea 
                                id={field.name} 
                                {...field} 
                                rows={4} 
                                className="w-full p-3 border rounded-md" 
                                placeholder="Mô tả chi tiết..."
                                autoResize 
                            />
                        )}
                    />
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                    <Button 
                        label="Hủy bỏ" 
                        icon="pi pi-times" 
                        type="button"
                        onClick={onHide} 
                        className="p-button-text text-gray-600" 
                    />
                    <Button 
                        label={initialData ? "Cập nhật" : "Tạo mới"} 
                        icon="pi pi-check" 
                        loading={loading}
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 border-none px-6"
                    />
                </div>

            </form>
        </Modal>
    );
};

export default CateForm;