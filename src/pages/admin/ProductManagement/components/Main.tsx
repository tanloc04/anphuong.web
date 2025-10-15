import Header from "./Header"
import Button from "../../components/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons"

const Main = () => {
  const productsArray = [
    {
      id: 1,
      name: 'Bàn Console',
      stock: 10,
      createdAt: '2025-10-05',
      status: 'Stock',
      func: 'Add'
    },

    {
      id: 1,
      name: 'Bàn Console',
      stock: 10,
      createdAt: '2025-10-05',
      status: 'Stock',
      func: 'Add'
    }
  ]
  return (
    <div>
      <Header />
      <table className="border-collapse border border-gray-400 w-full mt-2 rounded">
        <thead>
          <tr>
            <th className="border border-gray-300">STT</th>
            <th className="border border-gray-300">Tên Sản Phẩm</th>
            <th className="border border-gray-300">Số Lượng</th>
            <th className="border border-gray-300">Ngày Tạo</th>
            <th className="border border-gray-300">Trạng Thái</th>
            <th className="border border-gray-300">Chức Năng</th> 
          </tr>
        </thead>
        <tbody className="text-center">
          {productsArray.map((product) => (
            <tr key={product.id}>
              <td className="border border-gray-300 py-4">{product.id}</td>
              <td className="border border-gray-300">{product.name}</td>
              <td className="border border-gray-300">{product.stock}</td>
              <td className="border border-gray-300">{product.createdAt}</td>
              <td className="border border-gray-300">{product.status}</td>
              <td className="border border-gray-300">
                <div className="flex gap-2 ml-1">
                  <Button size="small"><FontAwesomeIcon icon={faPen}/></Button>
                  <Button size="small" className="!bg-[red] focus:ring-red-500"><FontAwesomeIcon icon={faTrash}/></Button>
                </div>
              </td>
          </tr>))}
        </tbody>
      </table>
    </div>
  )
}

export default Main
