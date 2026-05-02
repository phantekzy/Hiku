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
    const base = [
        'inline-flex items-center justify-center gap-2',
        'font-mono font-medium tracking-wide',
        'border transition-all duration-150',
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-hiku-accent',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'select-none whitespace-nowrap',
    ].join(' ');

    const variants: Record<string, string> = {
        primary: 'bg-hiku-accent border-hiku-accent text-hiku-bg hover:bg-hiku-accent-hover hover:border-hiku-accent-hover',
        secondary: 'bg-hiku-surface2 border-hiku-border text-hiku-cream hover:border-hiku-border-light hover:bg-hiku-pine',
        ghost: 'bg-transparent border-transparent text-hiku-muted hover:text-hiku-cream hover:bg-hiku-surface2',
        danger: 'bg-transparent border-hiku-danger-muted text-hiku-danger hover:bg-hiku-danger-muted/20',
        outline: 'bg-transparent border-hiku-border text-hiku-cream-dim hover:border-hiku-accent hover:text-hiku-cream',
    };

    const sizes: Record<string, string> = {
        xs: 'px-2 py-1 text-2xs rounded-sm',
        sm: 'px-3 py-1.5 text-xs rounded-sm',
        md: 'px-4 py-2 text-sm rounded',
        lg: 'px-5 py-2.5 text-sm rounded',
    };

    return (
        <button
            className={cn(base, variants[variant], sizes[size], className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            ) : icon}
            {children}
        </button>
    );
};
