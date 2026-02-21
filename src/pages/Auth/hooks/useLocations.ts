import { useState, useEffect } from "react"
import { locationApi } from "@/api/locationApi"

interface LocationOption {
    label: string,
    value: string
}

export const useProvinces = () => {
    const [provinces, setProvinces] = useState<LocationOption[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchProvinces = async () => {
            setIsLoading(true);
            try {
                const data = await locationApi.getAllProvinces();
                const formattedProvinces = data.map((p: any) => ({
                    label: p.name,
                    value: p.name
                }));
                setProvinces(formattedProvinces);
            } catch (error) {
               console.error("Lỗi lấy danh sách các tỉnh:", error);
               setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProvinces();
    }, []);

    return { provinces, isLoading, error };
}