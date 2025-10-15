import type { ButtonHTMLAttributes, ReactNode, JSX } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode,
  icon?: JSX.Element, 
  variant?: 
      'primary' 
    | 'secondary' 
    | 'danger' 
    | 'ghost',
  size?: 
      'small' 
    | 'medium' 
    | 'large',
  className?: string   
}


const Button = (
    {
      children, 
      icon, 
      variant = 'primary',
      size = 'medium',
      className = "",
      disabled = false,
      ...props
    }: ButtonProps
  ) => {
    const baseClasses = 'flex items-center justify-center font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-bule-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost: 'bg-transparent text-gray-800 hover:bg-gray-100 focus:ring-gray-400'
    }

    const sizeClasses = {
      small: 'px-3 py-1.5 text-sm',
      medium: 'px-4 py-2 text-base',
      large: 'px-6 py-3 text-lg'
    }

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    const finalClassName = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      disabledClasses,
      className
    ].filter(Boolean).join(' ');
  
  return (
    <div>
        <button 
          className={finalClassName}
          disabled={disabled}
          {...props}
        >
           {icon && <span className="mr-2">{icon}</span>}
           {children}
        </button>
    </div>
  )
}

export default Button