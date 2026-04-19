import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, FC, ReactNode } from "react";

type ButtonColor = 'default' | 'green' | 'orange' | 'red' | 'blue' | 'pink' | 'dark';

const colorClassMap: Record<ButtonColor, string> = {
  default: 'btn-default',
  green: 'btn-green',
  orange: 'btn-orange',
  red: 'btn-red',
  blue: 'btn-blue',
  pink: 'btn-pink',
  dark: 'btn-dark',
};

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  color?: ButtonColor;
  size?: 'sm' | 'default' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export const Button: FC<Props> = ({
                                    className,
                                    color = 'default',
                                    size = 'default',
                                    loading,
                                    disabled,
                                    children,
                                    ...props
                                  }) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-sm lg:px-3 lg:py-1.5 lg:text-base",
    default: "px-3 py-1.5 text-base lg:px-4 lg:py-2 lg:text-xl",
    lg: "px-4 py-2 text-lg lg:px-6 lg:py-3 lg:text-2xl",
  };

  return (
    <button
      className={clsx(
        'btn-neo relative inline-block text-center font-semibold no-underline border-2 border-black [text-shadow:2px_2px_2px_#00000040] whitespace-nowrap',
        sizeClasses[size],
        colorClassMap[color],
        className
      )}
      style={{ borderRadius: 'var(--radius-md)' }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="absolute top-0 left-0 right-0 bottom-0 m-auto h-[1.5em] w-[1.5em] rounded-full border-4 border-transparent border-t-white animate-loading-spinner"></span>
      )}
      <span className={clsx('transition-opacity', { 'opacity-0': loading, 'opacity-100': !loading })}>
        {children}
      </span>
    </button>
  );
};