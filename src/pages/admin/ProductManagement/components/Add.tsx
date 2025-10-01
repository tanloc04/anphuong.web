import { Plus } from 'lucide-react';

const Add = () => {

  const handleAdd = () => {
    alert(`Add a product from here.`);
  }


  return (
    <div>
      <button 
        onClick={handleAdd}
        className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700'
        >
          <Plus size={16}/>Add Product
      </button>
    </div>
  )
}

export default Add
