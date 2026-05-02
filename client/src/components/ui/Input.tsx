import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    prefix?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    hint,
    leftIcon,
    prefix,
    className,
    id,
    ...props
}) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label htmlFor={inputId} className="text-2xs font-mono text-hiku-muted uppercase tracking-widest">
                    <span className="text-hiku-accent">// </span>{label}
                </label>
            )}
            <div className="relative flex items-center">
                {prefix && (
                    <span className="absolute left-3 text-hiku-moss text-xs font-mono select-none">{prefix}</span>
                )}
                {leftIcon && !prefix && (
                    <span className="absolute left-3 text-hiku-muted">{leftIcon}</span>
                )}
                <input
                    id={inputId}
                    className={cn(
                        'w-full bg-hiku-surface border font-mono text-sm text-hiku-cream',
                        'rounded-sm px-3 py-2.5',
                        'placeholder:text-hiku-pine',
                        'focus:outline-none focus:border-hiku-accent focus:bg-hiku-surface2',
                        'transition-colors duration-150',
                        'disabled:opacity-40 disabled:cursor-not-allowed',
                        error ? 'border-hiku-danger' : 'border-hiku-border',
                        (leftIcon || prefix) && 'pl-9',
                        className,
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-2xs text-hiku-danger font-mono">
                    <span className="mr-1">✗</span>{error}
                </p>
            )}
            {hint && !error && (
                <p className="text-2xs text-hiku-muted font-mono">{hint}</p>
            )}
        </div>
    );
};
