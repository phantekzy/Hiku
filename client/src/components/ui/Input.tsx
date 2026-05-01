import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    hint,
    leftIcon,
    className,
    id,
    ...props
}) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-hiku-text">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-hiku-muted">
                        {leftIcon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={cn(
                        'w-full rounded-lg border bg-hiku-surface2 px-3 py-2.5 text-sm text-hiku-text',
                        'placeholder:text-hiku-muted/60',
                        'border-hiku-border',
                        'focus:outline-none focus:ring-2 focus:ring-hiku-accent focus:border-hiku-accent',
                        'transition-colors duration-150',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        leftIcon && 'pl-10',
                        error && 'border-red-500 focus:ring-red-500',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            {hint && !error && <p className="text-xs text-hiku-muted">{hint}</p>}
        </div>
    );
};
