import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    className,
    disabled,
    ...props
}) => {
    const base =
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-hiku-accent focus:ring-offset-2 focus:ring-offset-hiku-bg disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
        primary: 'bg-hiku-accent hover:bg-hiku-accent-hover text-white shadow-lg shadow-hiku-accent/20',
        secondary: 'bg-hiku-surface2 hover:bg-hiku-border text-hiku-text',
        ghost: 'bg-transparent hover:bg-hiku-surface2 text-hiku-muted hover:text-hiku-text',
        danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30',
        outline: 'bg-transparent border border-hiku-border hover:border-hiku-accent text-hiku-text',
    };

    const sizes = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={cn(base, variants[variant], sizes[size], className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            ) : icon}
            {children}
        </button>
    );
};
