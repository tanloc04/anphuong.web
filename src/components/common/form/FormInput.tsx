import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import type { InputTextProps } from "primereact/inputtext";
import { classNames } from "primereact/utils";

interface Props<T extends FieldValues> extends InputTextProps {
    name: Path<T>,
    control: Control<T>,
    label?: string,
    rules?: any,
    labelClassName?: string
}

export const FormInput = <T extends FieldValues>({ name, control, label, rules, className, labelClassName, ...props }: Props<T>) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label 
                    htmlFor={name} 
                    className={classNames("font-medium", labelClassName || "text-gray-700")}
                >
                    {label}
                </label>
            )}
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
                            className={classNames({ "p-invalid": fieldState.invalid }, className, "w-full")}
                        />
                        {fieldState.error && <small className="p-error text-red-500 text-xs">{fieldState.error.message}</small>}
                    </>
                )}
            />
        </div>
    );
};