import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { confirmAccount } from '../request';

const AccountConfirmation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [message, setMessage] = useState("Vui lòng nhấn nút bên dưới để kích hoạt tài khoản của bạn.");

    const handleConfirm = async () => {
        if (!id) return;
        setLoading(true);
        const result = await confirmAccount(id);
        setLoading(false);
        if (result.success) {
            setStatus('SUCCESS');
            setMessage("Tài khoản đã được kích hoạt thành công! Bạn sẽ được chuyển đến trang đăng nhập.");
            toast.current?.show({ severity: 'success', summary: 'Thành công', detail: result.message, life: 3000 });
            
            setTimeout(() => {
                navigate('/account/login');
            }, 3000);
        } else {
            setStatus('ERROR');
            setMessage(result.message || "Có lỗi xảy ra trong quá trình xác thực.");
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: result.message, life: 3000 });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <Toast ref={toast} />
            <Card className="w-full max-w-md shadow-lg text-center p-4">
                <div className="flex flex-col items-center gap-4">
                    <i className={`pi ${status === 'SUCCESS' ? 'pi-check-circle text-green-500' : status === 'ERROR' ? 'pi-times-circle text-red-500' : 'pi-envelope text-blue-500'} text-6xl mb-2`}></i>
                    
                    <h2 className="text-2xl font-bold text-gray-800">
                        {status === 'SUCCESS' ? 'Xác thực thành công' : status === 'ERROR' ? 'Xác thực thất bại' : 'Xác thực tài khoản'}
                    </h2>
                    
                    <p className="text-gray-600 mb-4">{message}</p>

                    {status === 'IDLE' && (
                        <Button 
                            label="Kích hoạt ngay" 
                            icon="pi pi-check" 
                            loading={loading} 
                            onClick={handleConfirm}
                            className="w-full bg-blue-600 border-blue-600 hover:bg-blue-700"
                        />
                    )}

                    {status === 'ERROR' && (
                        <Button 
                            label="Về trang chủ" 
                            icon="pi pi-home" 
                            onClick={() => navigate('/')}
                            className="w-full p-button-outlined"
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AccountConfirmation;