import React, {useState} from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const Product = () => {
  const [products, setProducts] = useState([
    {
      id: 1, 
      name: "Bàn CS001", 
      price: 3850, 
      discount: null,
      description: "Có thể sơn tĩnh điện theo màu yêu cầu.",
      longSize: 1200,
      widthSize: 300,
      heghtSize: 850,
      material: "Sắt, Gạch Ceramic",
      detailImageId: 1,
      categoryId: 1,
      variantionId: 1,
      createdAt: '20-2-2023',
      updatedAt: '22-2-2023' 
    },

    {
      id: 2, 
      name: "Bàn CS002", 
      price: 3750, 
      discount: null,
      description: "Có thể sơn tĩnh điện theo màu yêu cầu.",
      longSize: 1200,
      widthSize: 300,
      heghtSize: 850,
      material: "Sắt, Gạch Ceramic",
      detailImageId: 2,
      categoryId: 1,
      variantionId: 11,
      createdAt: '14-2-2023',
      updatedAt: '4-3-2023' 
    }
  ]);

  const handleAdd = () => {
    alert(`Add products from here.`)
  };


  return (
    <div className='p-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <h1 className='text-2xl font-bold'>PRODUCT MANAGEMENT</h1>
        <button 
          className='inline-flex items-center bg-violet-600 text-white hover:bg-violet-700 rounded-lg gap-2 px-4 py-2'
          onClick={handleAdd}>
            <Plus size={16}/>Add Product</button>
      </div>

      <div className='relative mb-6 max-w-md'>
        <div className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none'>
          <Search size={16}/>
        </div>
        <input 
          placeholder='Search product...' 
          type="text" 
          className='w-full pl-10 pr-3 py-2 rounded-md text-sm border dark:bg-zinc-900 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-violet-400'/>
      </div>

      <div className='overflow-x-auto rounded-lg border dark:border-zinc-800'>
        <table className='w-full text-sm'>
          <thead className='bg-zinc-50 dark:bg-zinc-800'>
            <tr>
              <th className='text-left px-4 py-2'>Name</th>
              <th className='text-left px-4 py-2'>Price (VND)</th>
              <th className='text-left px-4 py-2'>Discount (%)</th>
              <th className='text-left px-4 py-2'>Description</th>
              <th className='text-left px-4 py-2'>Long Size (m)</th>
              <th className='text-left px-4 py-2'>Width Size (m)</th>
              <th className='text-left px-4 py-2'>Height Size (m)</th>
              <th className='text-left px-4 py-2'>Material</th>
              <th className='text-left px-4 py-2'>Created At</th>
              <th className='text-left px-4 py-2'>Updated At</th>
              <th className='px-4 py-2'>Actions</th>
            </tr>

            {/* <tbody>
              {products.map((product) => (
                <tr key={product.id} className='border-t dark:border-zinc-800'>
                  <td className='text-left font-medium px-4 py-2'>{product.name}</td>
                  <td className='text-left px-4 py-2'>{product.price}</td>
                  <td className='text-left px-4 py-2'>{product.discount}</td>
                  <td className='text-left px-4 py-2'>{product.description}</td>
                  <td className='text-left px-4 py-2'>{product.longSize}</td>
                  <td className='text-left px-4 py-2'>{product.widthSize}</td>
                  <td className='text-left px-4 py-2'>{product.heghtSize}</td>
                </tr>
              ))}
            </tbody> */}
            
          </thead>
        </table>
      </div>
    </div>
  )
}

export default Product
