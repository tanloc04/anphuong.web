import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";
import { Password } from "primereact/password";
import type { PasswordProps } from "primereact/password";
import { classNames } from "primereact/utils";

interface FormPasswordProps<T extends FieldValues> extends Omit<PasswordProps, 'name' | 'checked'> {
    control: Control<T>,
    name: Path<T>,
    label?: string,
    rules?: RegisterOptions<T>,
    labelClassName?: string,
    inputClassName?: string
}

export const FormPassword = <T extends FieldValues>({ control, name, label, rules, className, labelClassName, inputClassName, ...props }: FormPasswordProps<T>) => {
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
                        <Password 
                            id={name}
                            {...field}
                            {...props}
                            // style={{ width: '100%' }} là liều thuốc mạnh nhất để ép nó bung full
                            style={{ width: '100%' }} 
                            className={classNames({ "p-invalid": fieldState.invalid }, className, "w-full")}
                            inputClassName={classNames("w-full", inputClassName)}
                            inputStyle={{ width: '100%' }} // Ép input bên trong full width
                        />

                        {fieldState.error && (
                            <small className="p-error text-red-500 text-xs mt-1 block">{fieldState.error.message}</small>
                        )}
                    </>
                )}
            />
        </div>
    );
};