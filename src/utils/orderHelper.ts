export const getStatusSeverity = (status: number): "success" | "info" | "warning" | "danger" | "secondary" | undefined => {
    switch (status) {
        case 0: return 'warning';
        case 1: return 'secondary';
        case 2: return 'info';
        case 3: return 'success';
        case 4: return 'danger';
        default: return 'info';
    }
};

export const getStatusLabel = (status: number): string => {
    const statusMap: Record<number, string> = {
        0: 'Chờ xác nhận',
        1: 'Đang chuẩn bị hàng',
        2: 'Đang giao hàng',
        3: 'Hoàn thành',
        4: 'Đã hủy'
    };
    return statusMap[status] || 'Không xác định';
};

export const ORDER_STATUS_OPTIONS = [
    { label: 'Chờ xác nhận', value: 0 },
    { label: 'Đang chuẩn bị hàng', value: 1 },
    { label: 'Đang giao hàng', value: 2 },
    { label: 'Hoàn thành', value: 3 },
    { label: 'Đã hủy', value: 4 },
];