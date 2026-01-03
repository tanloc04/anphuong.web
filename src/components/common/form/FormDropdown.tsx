import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path , RegisterOptions} from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import type { DropdownProps } from "primereact/dropdown";
import { classNames } from "primereact/utils";

interface FormDropdownProps <T extends FieldValues> extends Omit<DropdownProps, "name" | "value" | "onChange"> {
    control: Control<T>,
    name: Path<T>,
    label?: string,
    rules?: RegisterOptions<T>
}

export const FormDropdown = <T extends FieldValues>({ control, name, label, rules, className, options, optionLabel = "label", optionValue = "value", ...props } : FormDropdownProps<T>) => {
    return(
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
                        <Dropdown 
                            id={name}
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            options={options}
                            optionLabel={optionLabel}
                            optionValue={optionValue}
                            {...props}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            className={classNames({ "p-invalid": fieldState.invalid }, className, "w-full")}
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