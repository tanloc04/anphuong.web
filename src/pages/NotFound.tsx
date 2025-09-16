import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="font-montserrat flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-9xl font-montserrat-bold text-red-500 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Trang bạn tìm không tồn tại hoặc đã bị di chuyển.</p>
      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Quay về trang chủ
      </Link>
    </div>
  )
}

export default NotFound
