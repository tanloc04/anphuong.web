import { Button } from "primereact/button";
import type { ButtonProps } from "primereact/button";

export const DeleteButton = (props: ButtonProps) => {
 return (
        <Button
            severity="danger"
            icon="pi pi-trash"
            aria-label="Xóa"
            outlined
            {...props}
        /> 
    );
};