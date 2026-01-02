import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";
import type { InputNumberProps } from "primereact/inputnumber";
import { classNames } from "primereact/utils";

interface FormNumberProps<T extends FieldValues> extends Omit<InputNumberProps, "name" | "value" | "onChange"> {
    control: Control<T>,
    name: Path<T>,
    label?: string,
    rules?: RegisterOptions<T>
}

export const FormNumber = <T extends FieldValues>({ control, name, label, rules, className, ...props }: FormNumberProps<T>) => {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label htmlFor={name} className="font-medium text-gray-700">{label}</label>
            )}

            <Controller 
                name={name}
                control={control}
                rules={rules}
                render={({ field, fieldState }) => (
                    <>
                        <InputNumber 
                            id={name}
                            value={field.value}
                            onValueChange={(e) => field.onChange(e.value)}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            className={classNames({ "p-invalid": fieldState.invalid }, className, "w-full")}
                            inputClassName="w-full"
                            {...props}
                        />
                        {fieldState.error && (
                            <small className="p-error text-red-500 text-xs mt-1 block">{fieldState.error.message}</small>
                        )}

                    </>
                )}
            />
        </div>
    );
}