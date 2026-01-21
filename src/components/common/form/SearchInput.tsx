import React from 'react';
import { InputText } from 'primereact/inputtext';
import type { InputTextProps } from 'primereact/inputtext'; 
import { classNames } from 'primereact/utils';

interface SearchInputProps extends InputTextProps {
    containerClassName?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ 
    className, 
    containerClassName, 
    placeholder = "Tìm kiếm...", 
    ...props 
}) => {
    return (
        <div className={classNames("relative w-full", containerClassName)}>
            <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <InputText
                placeholder={placeholder}
                {...props}
                className={classNames(
                    "w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg",
                    "hover:border-[#c4a484]",
                    "focus:border-[#c4a484] focus:ring-1 focus:ring-[#c4a484] focus:outline-none focus:shadow-[0_0_0_2px_rgba(196,164,132,0.2)]",
                    "transition-all duration-200",
                    className
                )}
            />
        </div>
    );
};