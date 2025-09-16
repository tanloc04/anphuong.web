import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

export function Footer() {
  return (
    <footer id="footer" className="bg-card border-t border-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-3xl font-montserrat-bold text-foreground mb-4">An Phương</h3>
            <p className="font-montserrat text-muted-foreground mb-4 text-gray-600">
              Thương hiệu nội thất hiện đại, tối giản cho không gian sống đô thị.
            </p>
            <div className="font-montserrat space-y-2 text-gray-600">
              <div className="flex items-center text-sm text-muted-foreground">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                123 Đường ABC, Quận 1, TP.HCM
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                (028) 1234 5678
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                info@anphuong.vn
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat-semibold text-foreground mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-gray-600 font-montserrat">
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Sản phẩm</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Dự án</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Về chúng tôi</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Tin tức</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Liên hệ</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-montserrat-semibold text-foreground mb-4">Dịch vụ</h4>
            <ul className="space-y-2 text-gray-600 font-montserrat">
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Thiết kế nội thất</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Thi công trọn gói</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Bảo hành & bảo trì</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Tư vấn phong thủy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-montserrat-semibold text-foreground mb-4">Đăng ký nhận tin</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
            </p>
            <div className="space-y-3 font-montserrat">
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="newsletter" />
                <label htmlFor="newsletter" className="text-xs text-muted-foreground">
                  Tôi đồng ý nhận email marketing
                </label>
              </div>
              <button
                className="bg-[#c4a484] hover:bg-[#b8956f] w-full  text-white px-8 py-3 rounded-lg transition-colors duration-300 cursor-pointer active:scale-95"
                >
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-300 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
              <FontAwesomeIcon icon={faFacebook} className="text-4xl" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
              <FontAwesomeIcon icon={faInstagram} className="text-4xl" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
              <FontAwesomeIcon icon={faYoutube} className="text-4xl" />
            </a>
          </div>
          <p className="font-montserrat text-sm text-muted-foreground text-gray-600">
            © 2025 An Phương. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
