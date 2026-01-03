import { Button } from "primereact/button";
import type { ButtonProps } from "primereact/button";

export const CreateButton = (props: ButtonProps) => {
    return (
        <Button 
            icon="pi pi-plus"
            severity="info"
            aria-label="Thêm mới"
            outlined
            {...props}
            
        />
    );
};