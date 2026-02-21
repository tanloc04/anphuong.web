import { useState } from "react";
import { authService } from "@/services/authService";
import type { ConfirmAccountResponse } from "@/@types/auth.types";

export const useConfirmAccount = () => {
    const [loading, setLoading] = useState(false);
    const verify = async (id: string): Promise<ConfirmAccountResponse> => {
        setLoading(true);
        const result = await authService.confirmAccount(id);

        setLoading(false);
        return result;
    };

    return {
        loading,
        verify
    };
};