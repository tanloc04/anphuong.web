import { useState } from 'react';
import { Save, X, Upload } from 'lucide-react';

const Add = () => {
  const [product, setProduct] = useState({
      name: "",
      description: "",
      price: "",
      stock: "",
      image: ""
    });

  const handleChange = (e :any) => {
    const { name, value } = e.target;
    setProduct({...product, [name]: value});
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(`Product submitted: ${product}`);
    alert("Product added successfully!");
  };

  return (
    <div>
      <div className='p-6 max-w-3xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>Add New Product</h1>
      </div>
    </div>
  )
}

export default Add
