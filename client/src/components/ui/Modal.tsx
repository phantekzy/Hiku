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
}

export const Modal: React.FC<ModalProps> = ({
    open, onClose, title, children, size = 'md',
}) => {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (open) document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    if (!open) return null;

    const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            <div className={cn(
                'relative z-10 w-full bg-hiku-surface border border-hiku-border',
                'rounded-t-lg sm:rounded shadow-glow animate-slide-up',
                sizes[size],
            )}>
                {/* top bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-hiku-border">
                    <div className="flex items-center gap-2">
                        <span className="text-hiku-accent text-xs">▋</span>
                        {title && (
                            <span className="text-xs font-mono font-semibold text-hiku-cream-dim uppercase tracking-wider">
                                {title}
                            </span>
                        )}
                    </div>
                    <Button variant="ghost" size="xs" onClick={onClose}>
                        <X size={13} />
                    </Button>
                </div>
                <div className="p-4 sm:p-5">{children}</div>
            </div>
        </div>
    );
};
