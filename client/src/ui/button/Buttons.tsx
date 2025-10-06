import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, FC, ReactNode } from "react";

type ButtonColor = 'default' | 'green' | 'orange' | 'red' | 'blue' | 'pink' | 'dark';

const colorClassMap: Record<ButtonColor, string> = {
  default: 'bg-[#e7e7e7] text-black shadow-[inset_-6px_-6px_0px_0px_#cfcfcf,var(--shadow-primary)] hover:bg-[#ffffff] active:bg-[#e7e7e7] active:shadow-[inset_6px_6px_0px_0px_#cfcfcf,var(--shadow-primary)]',
  green: 'bg-[#92cc41] text-white shadow-[inset_-6px_-6px_0px_0px_#65a013,var(--shadow-primary)] hover:bg-[#76c442] active:bg-[#92cc41] active:shadow-[inset_6px_6px_0px_0px_#65a013,var(--shadow-primary)]',
  orange: 'bg-[#f7d51d] text-black shadow-[inset_-6px_-6px_0px_0px_#c9ae17,var(--shadow-primary)] hover:bg-[#e7c819] active:bg-[#f7d51d] active:shadow-[inset_6px_6px_0px_0px_#c9ae17,var(--shadow-primary)]',
  red: 'bg-[#e76e55] text-white shadow-[inset_-6px_-6px_0px_0px_#bf3d41,var(--shadow-primary)] hover:bg-[#c25c48] active:bg-[#761c1e] active:shadow-[inset_6px_6px_0px_0px_#bf3d41,var(--shadow-primary)]',
  blue: 'bg-[#109fff] text-white shadow-[inset_-6px_-6px_0px_0px_#006bb3,var(--shadow-primary)] hover:bg-[#1195ec] active:bg-[#109fff] active:shadow-[inset_6px_6px_0px_0px_#108de0,var(--shadow-primary)]',
  pink: 'bg-[#ee2097] text-white shadow-[inset_-6px_-6px_0px_0px_#902c74,var(--shadow-primary)] hover:bg-[#eb55ac] active:bg-[#ee2097] active:shadow-[inset_6px_6px_0px_0px_#902c74,var(--shadow-primary)]',
  dark: 'bg-[#444444] text-white shadow-[inset_-6px_-6px_0px_0px_#333333,var(--shadow-primary)] hover:bg-[#555555] active:bg-[#444444] active:shadow-[inset_6px_6px_0px_0px_#333333,var(--shadow-primary)]',
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
        'relative inline-block text-center rounded-xl font-semibold no-underline border-2 border-black transition-all [text-shadow:2px_2px_2px_#00000040] whitespace-nowrap',
        sizeClasses[size],
        colorClassMap[color],
        'disabled:bg-[#d3d3d3] disabled:text-[#757575] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-[inset_-6px_-6px_0px_0px_#adafbc,var(--shadow-primary)]',
        className
      )}
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