import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({
    open,
    onClose,
    title,
    children,
    size = 'md',
    className,
}) => {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (open) document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    if (!open) return null;

    const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            <div
                className={cn(
                    'relative z-10 w-full bg-hiku-surface border border-hiku-border rounded-xl shadow-2xl animate-slide-in',
                    sizes[size],
                    className
                )}
            >
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-hiku-border">
                        <h2 className="text-lg font-semibold text-hiku-text">{title}</h2>
                        <Button variant="ghost" size="xs" onClick={onClose}>
                            <X size={16} />
                        </Button>
                    </div>
                )}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};
