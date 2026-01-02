import { Button } from "primereact/button";
import type { ButtonProps } from "primereact/button";

export const EditButton = (props: ButtonProps) => {
    return (
        <Button 
            severity="success"
            icon="pi pi-cog"
            tooltip="Cài đặt"
            aria-label="Cài đặt"
            {...props}
        />
    );
};