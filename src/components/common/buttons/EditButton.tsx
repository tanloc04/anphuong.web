import { Button } from "primereact/button";
import type { ButtonProps } from "primereact/button";

export const EditButton = (props: ButtonProps) => {
    return (
        <Button 
            severity="success"
            icon="pi pi-cog"
            aria-label="Cài đặt"
            outlined
            {...props}
        />
    );
};