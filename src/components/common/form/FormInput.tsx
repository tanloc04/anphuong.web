import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import type { InputTextProps } from "primereact/inputtext";
import { classNames } from "primereact/utils";

interface Props<T extends FieldValues> extends InputTextProps {
    name: Path<T>,
    control: Control<T>,
    label?: string,
    rules?: any
}

export const FormInput = <T extends FieldValues>({ name, control, label, rules, className, ...props }: Props<T>) => {
    return (
        <div className="flex flex-col gap-2">
            {label && <label htmlFor={name} className="font-medium text-gray-700">{label}</label>}
            <Controller 
                name={name}
                control={control}
                rules={rules}
                render={({ field, fieldState }) => (
                    <>
                        <InputText 
                            id={name}
                            {...field}
                            {...props}
                            className={classNames({ "p-invalid": fieldState.invalid }, className)}
                        />
                        {fieldState.error && <small className="p-error">{fieldState.error.message}</small>}
                    </>
                )}
            />
        </div>
    );
};
