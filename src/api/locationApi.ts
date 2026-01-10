import axios from "axios";

export interface Province {
    code: number;
    name: string;
    division_type: string;
    codename: string;
    phone_code: number;
}

export const locationApi = {
    getAllProvinces: async () => {
        const response = await axios.get<Province[]>('https://provinces.open-api.vn/api/?depth=1');
        return response.data;
    }
};