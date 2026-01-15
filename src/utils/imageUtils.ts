// src/utils/imageUtils.ts

// Hàm chèn tham số biến đổi vào URL Cloudinary
export const getCloudinaryImage = (url: string | null | undefined, width?: number, height?: number) => {
    if (!url) return '/placeholder.png'; // Ảnh mặc định nếu null
    
    // Nếu không phải ảnh Cloudinary thì trả về nguyên gốc (ví dụ ảnh local)
    if (!url.includes('cloudinary.com')) return url;

    // Tìm vị trí '/upload/' để chèn tham số
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;

    // Cấu hình tham số: 
    // f_auto: Tự chọn định dạng (webp/avif)
    // q_auto: Tự nén chất lượng mà không giảm quá nhiều độ nét
    const params = ['f_auto', 'q_auto'];
    
    if (width) params.push(`w_${width}`);
    if (height) params.push(`h_${height}`);
    
    // c_fill: Crop ảnh cho vừa khít khung mà không bị méo (quan trọng cho card sản phẩm)
    if (width || height) params.push('c_fill'); 

    const paramsString = params.join(',');
    
    // Ghép chuỗi URL mới
    // VD: .../upload/w_300,h_400,c_fill,f_auto,q_auto/v123...
    return `${url.slice(0, uploadIndex)}/upload/${paramsString}${url.slice(uploadIndex + 7)}`;
};