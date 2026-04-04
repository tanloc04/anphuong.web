import axios from "axios";

export interface Province {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  phone_code: number;
  districts?: District[];
}

export interface District {
  code: number;
  name: string;
  province_code: number;
  wards?: Ward[];
}

export interface Ward {
  code: number;
  name: string;
  district_code: number;
}

export const locationApi = {
  // Lấy danh sách 63 Tỉnh/Thành
  getAllProvinces: async () => {
    const response = await axios.get<Province[]>('https://provinces.open-api.vn/api/p/');
    return response.data;
  },
  
  // Lấy danh sách Quận/Huyện theo Mã Tỉnh
  getDistrictsByProvince: async (provinceCode: number) => {
    const response = await axios.get<Province>(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
    return response.data.districts || [];
  },

  // Lấy danh sách Phường/Xã theo Mã Huyện
  getWardsByDistrict: async (districtCode: number) => {
    const response = await axios.get<District>(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    return response.data.wards || [];
  }
};