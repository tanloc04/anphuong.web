import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { CreateButton, DeleteButton } from '@/components/common/buttons';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import type { ICategory, CategoryFormProps } from '@/types/category.types';
import type { IFormInput } from '@/types/common.types';

const CategoryForm = ({ visible, onHide, onSave, initialData, loading }: CategoryFormProps) => {
    
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

    const handleClose = () => {
        reset();
        onHide();
    }

    const renderFooter = () => {
        return (
            <div className="flex justify-end gap-2">
                <DeleteButton />
                <CreateButton label={initialData ? "Tạo mới" : "Cập nhật"}/>
            </div>
        );
    };

    return (
        <Dialog 
            header={formTitle} 
            visible={visible} 
            style={{ width: '32rem' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            onHide={handleClose} 
            footer={renderFooter()}
            className="p-fluid"
            modal
            draggable={false}
        >
            <form className="flex flex-col gap-5 mt-2">
                <div className="field">
                    <label htmlFor="name" className="font-medium text-gray-700 block mb-2">
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
                                className={classNames({ 'p-invalid': fieldState.invalid })} 
                                placeholder="Nhập tên danh mục..."
                                autoFocus
                            />
                        )}
                    />
                    {errors.name && <small className="p-error block mt-1">{errors.name.message}</small>}
                </div>

                <div className="field">
                    <label htmlFor="description" className="font-medium text-gray-700 block mb-2">
                        Mô tả
                    </label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <InputTextarea 
                                id={field.name} 
                                {...field} 
                                rows={5} 
                                placeholder="Nhập mô tả ngắn gọn..."
                                autoResize 
                            />
                        )}
                    />
                </div>
            </form>
        </Dialog>
    );
};

export default CategoryForm;