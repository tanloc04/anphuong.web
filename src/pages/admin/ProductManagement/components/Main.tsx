import { useState, useEffect } from 'react';
import Header from "./Header";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

import Modal from '../components/Modal'; 
import ProductForm from './ProductForm'; 
import type { ProductProps, ProductListType, Tab } from '../type'; 

import { useSetRecoilState } from 'recoil';
import { tabsState, activeTabIdState } from '../../store/tabAtom';
import TabHistoryBar from '../../components/TabHistoryBar';


const api = {
  getAllProducts: async (): Promise<ProductListType[]> => {
    await new Promise(r => setTimeout(r, 500));
    return [
      {
        id: 1,
        name: "Bàn Console",
        price: 12000000,
        discount: 10,
        description: "Một chiếc bàn console.",
        longSize: 220,
        widthSize: 90,
        heightSize: 80,
        material: "Gỗ",
        detailImageId: 101,
        categoryId: 1,
        variationId: 2,
        createdAt: "2025-10-05",
        updatedAt: "2025-10-05",
        stock: 10,
        status: 'Stock'
      },
      {
        id: 2,
        name: "Ghế Sofa",
        price: 25000000,
        discount: null,
        description: "Một chiếc ghế sofa êm ái.",
        longSize: 300,
        widthSize: 100,
        heightSize: 85,
        material: "Vải nỉ",
        detailImageId: 102,
        categoryId: 1,
        variationId: 1,
        createdAt: "2025-10-15",
        updatedAt: "2025-10-15",
        stock: 5,
        status: 'Stock'
      }
    ];
  },
  createProduct: async (formData: FormData): Promise<ProductListType> => {
    await new Promise(r => setTimeout(r, 1000));
    return {
      id: Math.floor(Math.random() * 1000),
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      discount: Number(formData.get('discount')) as 10 | 30 | 50,
      description: formData.get('description') as string,
      longSize: Number(formData.get('longSize')),
      widthSize: Number(formData.get('widthSize')),
      heightSize: Number(formData.get('heightSize')),
      material: formData.get('material') as string,
      detailImageId: 202,
      categoryId: Number(formData.get('categoryId')),
      variationId: Number(formData.get('variationId')),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      stock: 0, 
      status: 'Stock'
    };
  },
  updateProduct: async (formData: FormData): Promise<ProductListType> => {
    await new Promise(r => setTimeout(r, 1000));
    return {
      id: Number(formData.get('id')),
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      discount: Number(formData.get('discount')) as 10 | 30 | 50,
      description: formData.get('description') as string,
      longSize: Number(formData.get('longSize')),
      widthSize: Number(formData.get('widthSize')),
      heightSize: Number(formData.get('heightSize')),
      material: formData.get('material') as string,
      detailImageId: 303,
      categoryId: Number(formData.get('categoryId')),
      variationId: Number(formData.get('variationId')),
      createdAt: "2025-10-05",
      updatedAt: new Date().toISOString().split('T')[0],
      stock: 10,
      status: 'Stock'
    };
  }
};


const ProductList = () => {
  const [products, setProducts] = useState<ProductListType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductProps | null>(null);

  const setTabs = useSetRecoilState(tabsState);
  const setActiveTabId = useSetRecoilState(activeTabIdState);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const tabToAdd: Tab = { id: 'products', label: 'Products', path: '/products' };
    setTabs(prevTabs => {
      const existingTab = prevTabs.find(tab => tab.id === tabToAdd.id);
      return existingTab ? prevTabs : [...prevTabs, tabToAdd];
    });
    setActiveTabId(tabToAdd.id);
  }, [setTabs, setActiveTabId]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenUpdateModal = (product: ProductProps) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (editingProduct) {
        await api.updateProduct(formData);
      } else {
        await api.createProduct(formData);
      }
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi submit form:", error);
    }
  };

  return (
    <div className="w-full">
      <TabHistoryBar />
      
      <div className="w-[1000px] mx-auto p-4">
        <Header />
        
        <div className="flex justify-end w-full mt-4">
          <Button 
            icon={<FontAwesomeIcon icon={faPlus}/>}
            severity="success"
            onClick={handleOpenCreateModal}
          />
        </div>

        <table className="border-collapse border border-gray-400 w-full mt-2 rounded">
          <thead>
            <tr className='bg-gray-100'>
              <th className="border border-gray-300 p-2">STT</th>
              <th className="border border-gray-300 p-2">Tên Sản Phẩm</th>
              <th className="border border-gray-300 p-2">Số Lượng</th>
              <th className="border border-gray-300 p-2">Ngày Tạo</th>
              <th className="border border-gray-300 p-2">Trạng Thái</th>
              <th className="border border-gray-300 p-2">Chức Năng</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="border border-gray-300 py-4 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product.id}>
                  <td className="border border-gray-300 py-4">{index + 1}</td>
                  <td className="border border-gray-300">{product.name}</td>
                  <td className="border border-gray-300">{product.stock}</td>
                  <td className="border border-gray-300">{product.createdAt}</td>
                  <td className="border border-gray-300">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'Stock' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="border border-gray-300">
                    <div className="flex gap-2 justify-center">
                      <Button 
                        severity="success" 
                        icon={<FontAwesomeIcon icon={faPen} />} 
                        onClick={() => handleOpenUpdateModal(product)}
                        rounded
                        text
                      />
                      <Button 
                        severity="danger" 
                        icon={<FontAwesomeIcon icon={faTrash} />} 
                        rounded
                        text
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingProduct ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}
        >
          <ProductForm
            key={editingProduct ? editingProduct.id : 'create'}
            initialData={editingProduct}
            onSubmitForm={handleFormSubmit}
            onClose={handleCloseModal}
          />
        </Modal>
      </div>
    </div>
  )
}

export default ProductList;