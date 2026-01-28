import type { ManagementLayoutProps } from '@/types/management.layout.types'
import React from 'react'
import { SearchInput } from '../form'
import { CreateButton } from '../buttons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const ManagementLayout: React.FC<ManagementLayoutProps> = ({ 
    title,
    children,
    searchTerm,
    onSearchChange,
    onCreate,
    createButtonLabel = "Thêm mới"
 }) => {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100 h-full flex flex-col animate-fade-in'>
        <div className='p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <h1 className='text-xl md:text-2xl font-bold text-gray-800'>{title}</h1>
            <div className='flex flex-col sm:flex-row gap-3'>
                {onSearchChange && (
                    <div className='p-input-icon-left w-full sm:w-64'>
                        <SearchInput 
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder='Tìm kiếm...'
                            containerClassName='w-full sm:w-64'
                            className='!pl-10 focus:!border-purple-500 focus:!ring-purple-200 hover:!border-purple-300'
                        />
                    </div>
                )}

                {onCreate && (
                    <CreateButton 
                        label={createButtonLabel}
                        icon={<FontAwesomeIcon icon={faPlus} className='mr-2'/>}
                        className='!bg-purple-600 !border-purple-600 hover:!bg-purple-700 focus:!ring-purple-200 transition-all shadow-sm !text-white'
                        onClick={onCreate}
                    />
                )}
            </div>      
        </div>

        <div className='border-b border-gray-100 w-full'></div>

        <div className='p-4 md:p-6 flex-1 overflow-auto'>
            {children}
        </div>
    </div>
  )
}

export default ManagementLayout