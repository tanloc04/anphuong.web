import { useState, useEffect } from "react"

interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  fullname: string;
  phone?: number;
  customerAddress: string;
}

interface ApiResponse {
  success: boolean;
  data: User[];
}

const User = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;
      const fetchUsers = async () => {
        setLoading(true);
        try{
          const response = await fetch('http://localhost:5273/api/Customer', {signal});
          if (!response.ok){
            throw new Error('Không thể địt');
          }
          const data:ApiResponse = await response.json();

          if (Array.isArray(data.data)) {
            setUsers(data.data);
          } else {
            console.error('Dữ liệu của data ko phải mảng!', data.data);
            setUsers([]);
          }
          setLoading(false);
        } catch (e: any){
          if (e.name === 'AbortError')
            return;
          setError(e.message);
          setLoading(false);
        }
      };
      fetchUsers();
      return () => controller.abort();
    }, []);

  return (
    <div className="user-count-box">
      <h2>Users List</h2>
      {loading && <p>Đang tải...</p>}
      {error && <p>Lỗi {error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.fullname || "Không có tên"}</li>
        ))}
      </ul>
    </div>
  )
}

export default User;
